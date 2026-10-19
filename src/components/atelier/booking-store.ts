"use client";

import { create } from "zustand";

export type BookingView = "book" | "manage";

interface BookingState {
  open: boolean;
  view: BookingView;
  openBooking: () => void;
  openManage: () => void;
  close: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  open: false,
  view: "book",
  openBooking: () => set({ open: true, view: "book" }),
  openManage: () => set({ open: true, view: "manage" }),
  close: () => set({ open: false }),
}));
