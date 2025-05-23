import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice } from "./slices/auth-slices";
import { createChatSlice } from "./slices/chat-slice";

export const useAppStore = create(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createChatSlice(...a),
    }),
    {
      name: "app-storage", // storage key in localStorage
      partialize: (state) => ({
        userInfo: state.userInfo, // only persist this part
      }),
    }
  )
);
