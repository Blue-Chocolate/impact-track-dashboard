// src/features/projects/pages/ProjectsPage.tsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProjectForm from "../component/ProjectForm";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import Notifications from "../../../widgets/Notifications";
import axios, { AxiosError } from "axios";
import ProjectSearch from "../component/ProjectSearch";

import {
  loadProjects,
  addProject,
  editProject,
  removeProject,
  clearMessages,
  addNotification,
} from "../projectsSlice";
import type { RootState, AppDispatch } from "../../../store/store";

// Loading skeleton component
const ProjectSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="border-t border-gray-200 first:border-t-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="flex space-x-2 ml-4">
            <div className="h-8 w-12 bg-gray-300 rounded"></div>
            <div className="h-8 w-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Empty state component
const EmptyState = ({ hasSearchQuery, onClearSearch }: { hasSearchQuery: boolean; onClearSearch: () => void }) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    {hasSearchQuery ? (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your search criteria or create a new project.</p>
        <button
          onClick={onClearSearch}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Clear search
        </button>
      </div>
    ) : (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
        <p className="text-gray-500">Get started by creating your first project above.</p>
      </div>
    )}
  </div>
);

// Error state component
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-4 text-red-300">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load projects</h3>
    <p className="text-gray-500 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Try again
    </button>
  </div>
);

// Loading button component
const LoadingButton = ({ isLoading, children, ...props }: { isLoading: boolean; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    disabled={isLoading || props.disabled}
    className={`${props.className} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
  >
    {isLoading ? (
      <div className="flex items-center">
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </div>
    ) : children}
  </button>
);

export default function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.projects
  );

  const [projects, setProjects] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const pageSize = 10;

  // Enhanced fetch projects with comprehensive error handling
  const fetchProjects = useCallback(async (searchTerm = "") => {
    try {
      setIsSearching(!!searchTerm);
      if (!searchTerm) setIsLoading(true);
      setFetchError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.append('q', searchTerm.trim());
        // For json-server, use q for full-text search across all fields
        // Alternatively, if you want specific field searches:
        // params.append('name_like', searchTerm.trim());
        // params.append('description_like', searchTerm.trim());
      }

      const response = await axios.get(
        `http://localhost:4000/projects?${params.toString()}`,
        {
          signal: controller.signal,
          timeout: 10000,
        }
      );

      clearTimeout(timeoutId);

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }

      setProjects(response.data);
      setCurrentPage(1); // Reset to first page on new search

      if (searchTerm && response.data.length === 0) {
        dispatch(addNotification({
          message: `No projects found for "${searchTerm}"`,
          type: 'info'
        }));
      } else if (searchTerm && response.data.length > 0) {
        dispatch(addNotification({
          message: `Found ${response.data.length} project${response.data.length === 1 ? '' : 's'} matching "${searchTerm}"`,
          type: 'success'
        }));
      }

    } catch (err) {
      console.error('Fetch projects error:', err);
      
      let errorMessage = 'Failed to load projects';
      
      if (err instanceof AxiosError) {
        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please check your connection and try again.';
        } else if (err.response?.status === 404) {
          errorMessage = 'Projects endpoint not found. Please check your server configuration.';
        } else if (err.response?.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.response?.status === 400) {
          errorMessage = 'Invalid search parameters.';
        } else if (!navigator.onLine) {
          errorMessage = 'No internet connection. Please check your network.';
        } else {
          errorMessage = err.response?.data?.message || err.message || 'Network error occurred';
        }
      } else if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request was cancelled due to timeout';
        } else {
          errorMessage = err.message;
        }
      }

      setFetchError(errorMessage);
      dispatch(addNotification({
        message: errorMessage,
        type: 'error'
      }));

      // Set empty projects on error to show error state
      setProjects([]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [dispatch]);

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Enhanced delete handler with optimistic updates
  const handleDelete = useCallback(async (projectId: string, projectName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(projectId);
    
    // Optimistic update - remove from local state immediately
    const originalProjects = [...projects];
    setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));

    try {
      await dispatch(removeProject(projectId)).unwrap();
      
      dispatch(addNotification({
        message: `Project "${projectName}" deleted successfully`,
        type: 'success'
      }));

      // If we deleted the last item on the current page, go to previous page
      const remainingCount = originalProjects.length - 1;
      const maxPage = Math.ceil(remainingCount / pageSize);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }

    } catch (error) {
      console.error('Delete project error:', error);
      
      // Revert optimistic update on error
      setProjects(originalProjects);
      
      dispatch(addNotification({
        message: `Failed to delete project "${projectName}". Please try again.`,
        type: 'error'
      }));
    } finally {
      setIsDeleting(null);
    }
  }, [dispatch, projects, currentPage, pageSize]);

  // Enhanced form submission handler
  const handleFormSubmit = useCallback(async (data: any) => {
    try {
      if (editing) {
        await dispatch(editProject({ ...editing, ...data })).unwrap();
        dispatch(addNotification({
          message: `Project "${data.name}" updated successfully`,
          type: 'success'
        }));
      } else {
        await dispatch(addProject(data)).unwrap();
        dispatch(addNotification({
          message: `Project "${data.name}" created successfully`,
          type: 'success'
        }));
      }
      
      setEditing(null);
      fetchProjects(query); // Refresh list after add/edit
      
    } catch (error) {
      console.error('Form submission error:', error);
      dispatch(addNotification({
        message: `Failed to ${editing ? 'update' : 'create'} project. Please try again.`,
        type: 'error'
      }));
    }
  }, [dispatch, editing, query, fetchProjects]);

  // Search handler with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query !== undefined) {
        fetchProjects(query);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, fetchProjects]);

  // Pagination calculations
  const totalPages = useMemo(() => Math.ceil(projects.length / pageSize), [projects.length, pageSize]);
  const paginatedProjects = useMemo(() => 
    projects.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [projects, currentPage, pageSize]
  );

  // Clear search handler
  const handleClearSearch = useCallback(() => {
    setQuery("");
    fetchProjects("");
  }, [fetchProjects]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Manage your projects and track their progress
                </p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Total: {projects.length} projects</span>
                  {query && (
                    <>
                      <span>•</span>
                      <span>Searching for: "{query}"</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Notifications */}
          <div className="mb-6">
            <Notifications
              error={error}
              success={success}
              onClose={() => dispatch(clearMessages())}
            />
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 w-full sm:max-w-xs">
                  <ProjectSearch 
                    onSearch={setQuery}
                    isLoading={isSearching}
                    placeholder="Search projects..."
                  />
                </div>
                
                {query && (
                  <button
                    onClick={handleClearSearch}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear search
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Project Form */}
          <div className="mb-8">
            <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editing ? `Edit Project: ${editing.name}` : 'Create New Project'}
                </h2>
                {editing && (
                  <p className="mt-1 text-sm text-gray-600">
                    Make changes to the existing project below
                  </p>
                )}
              </div>
              <div className="p-6">
                <ProjectForm
                  onSubmit={handleFormSubmit}
                  initialValues={editing || undefined}
                  onCancel={() => setEditing(null)}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  All Projects
                </h2>
                {isLoading && (
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading projects...
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden">
              {isLoading ? (
                <ProjectSkeleton />
              ) : fetchError ? (
                <ErrorState 
                  error={fetchError} 
                  onRetry={() => fetchProjects(query)} 
                />
              ) : projects.length === 0 ? (
                <EmptyState 
                  hasSearchQuery={!!query} 
                  onClearSearch={handleClearSearch}
                />
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timeline
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedProjects.map((project, index) => (
                          <tr 
                            key={project.id} 
                            className={`hover:bg-gray-50 transition-colors duration-150 ${
                              editing?.id === project.id ? 'bg-indigo-50 border-indigo-200' : ''
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                    {project.name.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {project.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {project.beneficiaries} beneficiaries
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate" title={project.description}>
                                {project.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="space-y-1">
                                <div>Start: {new Date(project.startDate).toLocaleDateString()}</div>
                                <div>End: {new Date(project.endDate).toLocaleDateString()}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => setEditing(project)}
                                  disabled={editing?.id === project.id}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                  {editing?.id === project.id ? 'Editing...' : 'Edit'}
                                </button>
                                <LoadingButton
                                  isLoading={isDeleting === project.id}
                                  onClick={() => handleDelete(project.id, project.name)}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                >
                                  Delete
                                </LoadingButton>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4 p-4">
                    {paginatedProjects.map((project) => (
                      <div 
                        key={project.id} 
                        className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${
                          editing?.id === project.id ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                              {project.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-gray-900">{project.name}</h3>
                              <p className="text-xs text-gray-500">{project.beneficiaries} beneficiaries</p>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        
                        <div className="text-xs text-gray-500 mb-3">
                          <div>Start: {new Date(project.startDate).toLocaleDateString()}</div>
                          <div>End: {new Date(project.endDate).toLocaleDateString()}</div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditing(project)}
                            disabled={editing?.id === project.id}
                            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            {editing?.id === project.id ? 'Editing...' : 'Edit'}
                          </button>
                          <LoadingButton
                            isLoading={isDeleting === project.id}
                            onClick={() => handleDelete(project.id, project.name)}
                            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                          >
                            Delete
                          </LoadingButton>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            Next
                          </button>
                        </div>
                        
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Showing{' '}
                              <span className="font-medium">
                                {(currentPage - 1) * pageSize + 1}
                              </span>{' '}
                              to{' '}
                              <span className="font-medium">
                                {Math.min(currentPage * pageSize, projects.length)}
                              </span>{' '}
                              of{' '}
                              <span className="font-medium">{projects.length}</span>{' '}
                              results
                            </p>
                          </div>
                          <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                              <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                              >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                              
                              {/* Page numbers */}
                              {[...Array(totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                const isVisible = 
                                  pageNum === 1 || 
                                  pageNum === totalPages || 
                                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                                
                                if (!isVisible && pageNum !== 2 && pageNum !== totalPages - 1) {
                                  return pageNum === 2 || pageNum === totalPages - 1 ? (
                                    <span key={pageNum} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500">
                                      ...
                                    </span>
                                  ) : null;
                                }
                                
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200 ${
                                      pageNum === currentPage
                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}
                              
                              <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                              >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          {!isLoading && !fetchError && projects.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Beneficiaries</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projects.reduce((sum, p) => sum + (p.beneficiaries || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projects.filter(p => {
                        const now = new Date();
                        const start = new Date(p.startDate);
                        const end = new Date(p.endDate);
                        return now >= start && now <= end;
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}