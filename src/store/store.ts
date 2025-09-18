// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "../features/projects/projectsSlice";
import reportsReducer from "../features/reports/reportsSlice";


export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    reports: reportsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
