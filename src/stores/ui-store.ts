import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  readerOpen: boolean;
  searchOpen: boolean;
  settingsOpen: boolean;
  activeNav: "feed" | "explore" | "library" | "settings";
  toasts: Toast[];
  toggleSidebar: () => void;
  setReaderOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setActiveNav: (nav: "feed" | "explore" | "library" | "settings") => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

let toastId = 0;

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  readerOpen: false,
  searchOpen: false,
  settingsOpen: false,
  activeNav: "feed",
  toasts: [],
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setReaderOpen: (readerOpen) => set({ readerOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  setActiveNav: (activeNav) => set({ activeNav }),
  addToast: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id: String(++toastId) }],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
