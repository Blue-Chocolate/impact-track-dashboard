import React, { useState } from "react";
import axios from "axios";

interface Project {
  id: number;
  name: string;
  description: string;
  beneficiaries: number;
  startDate: string;
  endDate: string;
}

const ProjectSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get<Project[]>("http://localhost:4000/projects");
      const projects = res.data;

      const queryWords = trimmedQuery.toLowerCase().split(/\s+/);
      const filteredProjects = projects.filter((project) => {
        const name = project.name.toLowerCase();
        const description = project.description.toLowerCase();
        
        return queryWords.some((word) => {
          const wordRegex = new RegExp(`\\b${word}\\b`, "i"); 
          return wordRegex.test(name) || wordRegex.test(description);
        });
      });

      setResults(filteredProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search projects by name or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading projects...</p>}

      <div>
        {!loading && results.length === 0 && query.trim() && (
          <p className="text-gray-500">No projects found</p>
        )}
        {results.map((project) => (
          <div key={project.id} className="border p-2 mb-2 rounded">
            <h3 className="font-bold">{project.name}</h3>
            <p>{project.description}</p>
            <p>Beneficiaries: {project.beneficiaries}</p>
            <p>
              {project.startDate} - {project.endDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSearch;