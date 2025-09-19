// src/features/notifications/notificationsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface NotificationsState {
  list: Notification[];
}

const initialState: NotificationsState = {
  list: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, "id">>) => {
      const id = Date.now().toString();
      state.list.push({ ...action.payload, id });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((n) => n.id !== action.payload);
    },
  },
});

export const { addNotification, removeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
