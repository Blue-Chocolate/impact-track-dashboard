// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "../features/projects/projectsSlice";
import reportsReducer from "../features/reports/reportsSlice";
import donorsReducer from "../features/donors/donorsSlice";
import settingsReducer from "../features/settings/settingsSlice";




export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    reports: reportsReducer,
    donors: donorsReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
