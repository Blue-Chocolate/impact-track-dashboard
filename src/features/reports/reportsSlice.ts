// src/features/reports/reportsSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import reportsData from "./reports.json";

export type Report = {
  id: number;
  title: string;
  date: string;
  summary: string;
};

export type ReportsState = {
  items: Report[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
};

const initialState: ReportsState = {
  items: [],
  loading: false,
  error: null,
  searchTerm: "",
};

// Async fetch (simulate API)
export const loadReports = createAsyncThunk(
  "reports/loadReports",
  async () => {
    // Simulate async fetch
    return new Promise<Report[]>((resolve) => {
      setTimeout(() => resolve(reportsData), 300);
    });
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    clearSearchTerm(state) {
      state.searchTerm = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadReports.fulfilled, (state, action: PayloadAction<Report[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load reports";
      });
  },
});

export const { setSearchTerm, clearSearchTerm } = reportsSlice.actions;
export default reportsSlice.reducer;
