import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {type Setting } from "./types";
import * as api from "./api/settingsApi";

export const loadSettings = createAsyncThunk("settings/load", async () => {
  return await api.fetchSettings();
});

export const addSetting = createAsyncThunk("settings/add", async (setting: Omit<Setting, "id">) => {
  return await api.createSetting(setting);
});

export const editSetting = createAsyncThunk("settings/edit", async (setting: Setting) => {
  return await api.updateSetting(setting);
});

export const removeSetting = createAsyncThunk("settings/remove", async (id: number) => {
  await api.deleteSetting(id);
  return id;
});

interface SettingsState {
  settings: Setting[];
  loading: boolean;
}

const initialState: SettingsState = { settings: [], loading: false };

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadSettings.pending, state => { state.loading = true; })
      .addCase(loadSettings.fulfilled, (state, action: PayloadAction<Setting[]>) => {
        state.settings = action.payload;
        state.loading = false;
      })
      .addCase(addSetting.fulfilled, (state, action: PayloadAction<Setting>) => {
        state.settings.push(action.payload);
      })
      .addCase(editSetting.fulfilled, (state, action: PayloadAction<Setting>) => {
        state.settings = state.settings.map(s => s.id === action.payload.id ? action.payload : s);
      })
      .addCase(removeSetting.fulfilled, (state, action: PayloadAction<number>) => {
        state.settings = state.settings.filter(s => s.id !== action.payload);
      });
  },
});

export default settingsSlice.reducer;
