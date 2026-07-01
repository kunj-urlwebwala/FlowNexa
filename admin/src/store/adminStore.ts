import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AdminUser {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AdminState {
  sidebarExpanded: boolean;
  searchOpen: boolean;
  notificationsOpen: boolean;
  user: AdminUser | null;
  token: string | null;
  setSidebarExpanded: (expanded: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      sidebarExpanded: false,
      searchOpen: false,
      notificationsOpen: false,
      user: null,
      token: null,
      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
      setSearchOpen: (open) => set({ searchOpen: open }),
      setNotificationsOpen: (open) => set({ notificationsOpen: open }),
      login: async (email, password) => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
          const res = await fetch(`${API_URL}/auth/admin/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();
          if (!res.ok) {
            return false;
          }

          set({
            user: data.data.admin,
            token: data.data.accessToken,
          });
          return true;
        } catch (error) {
          console.error("Login request failed:", error);
          return false;
        }
      },
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "flownexa-admin-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarExpanded: state.sidebarExpanded,
        user: state.user,
        token: state.token,
      }),
    }
  )
);

