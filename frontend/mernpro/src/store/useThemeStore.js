import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("vibly-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("vibly-theme", theme);
    set({ theme });
  },
}));

export default useThemeStore;