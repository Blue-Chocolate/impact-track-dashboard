import { createSlice, createAsyncThunk, type  PayloadAction } from "@reduxjs/toolkit";
import { type  Donor } from "./types";
import * as api from "./api/donorsApi";

export const loadDonors = createAsyncThunk("donors/load", async () => {
  return await api.fetchDonors();
});

export const addDonor = createAsyncThunk("donors/add", async (donor: Omit<Donor, "id">) => {
  return await api.createDonor(donor);
});

export const editDonor = createAsyncThunk("donors/edit", async (donor: Donor) => {
  return await api.updateDonor(donor);
});

export const removeDonor = createAsyncThunk("donors/remove", async (id: number) => {
  await api.deleteDonor(id);
  return id;
});

interface DonorsState {
  donors: Donor[];
  loading: boolean;
}

const initialState: DonorsState = { donors: [], loading: false };

const donorsSlice = createSlice({
  name: "donors",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadDonors.pending, state => { state.loading = true; })
      .addCase(loadDonors.fulfilled, (state, action: PayloadAction<Donor[]>) => {
        state.donors = action.payload;
        state.loading = false;
      })
      .addCase(addDonor.fulfilled, (state, action: PayloadAction<Donor>) => {
        state.donors.push(action.payload);
      })
      .addCase(editDonor.fulfilled, (state, action: PayloadAction<Donor>) => {
        state.donors = state.donors.map(d => d.id === action.payload.id ? action.payload : d);
      })
      .addCase(removeDonor.fulfilled, (state, action: PayloadAction<number>) => {
        state.donors = state.donors.filter(d => d.id !== action.payload);
      });
  },
});

export default donorsSlice.reducer;
