import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Address } from "@/types/user";
import { toast } from "sonner";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  registerUser: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<User, "id" | "email">>) => Promise<void>;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email, password) => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
          const res = await fetch(`${API_URL}/auth/login`, {
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

          const user = data.data.user;
          const mapAddress = (addr: any): Address => ({
            id: addr.id,
            fullName: addr.fullName,
            phone: addr.phone,
            addressLine1: addr.street || addr.addressLine1 || "",
            addressLine2: addr.addressLine2 || "",
            city: addr.city,
            state: addr.state,
            zipCode: addr.postalCode || addr.zipCode || "",
            country: addr.country,
            isDefault: addr.isDefault || false,
          });
          const formattedUser: User = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            avatarUrl: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            addresses: (user.addresses || []).map(mapAddress),
          };

          set({
            isAuthenticated: true,
            user: formattedUser,
            token: data.data.accessToken,
          });
          return true;
        } catch (error) {
          console.error("Storefront login failed:", error);
          return false;
        }
      },
      registerUser: async (email, password, name) => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
          const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, name }),
          });

          const data = await res.json();
          if (!res.ok) {
            return false;
          }

          const user = data.data.user;
          const formattedUser: User = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            avatarUrl: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            addresses: [],
          };

          set({
            isAuthenticated: true,
            user: formattedUser,
            token: data.data.accessToken,
          });
          return true;
        } catch (error) {
          console.error("Storefront registration failed:", error);
          return false;
        }
      },
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      fetchProfile: async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
          const { token } = get();
          if (!token) return;

          const res = await fetch(`${API_URL}/users/profile`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            const mapAddress = (addr: any): Address => ({
              id: addr.id,
              fullName: addr.fullName,
              phone: addr.phone,
              addressLine1: addr.street || addr.addressLine1 || "",
              addressLine2: addr.addressLine2 || "",
              city: addr.city,
              state: addr.state,
              zipCode: addr.postalCode || addr.zipCode || "",
              country: addr.country,
              isDefault: addr.isDefault || false,
            });
            const user = data.data;
            const formattedUser: User = {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone || "",
              avatarUrl: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              addresses: (user.addresses || []).map(mapAddress),
            };
            set({
              isAuthenticated: true,
              user: formattedUser,
            });
          }
        } catch (err) {
          console.error("Failed to fetch user profile details:", err);
        }
      },
      updateProfile: async (updates) => {
        const { user, token } = get();
        if (!user || !token) return;
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
          const res = await fetch(`${API_URL}/users/profile`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
          });
          const data = await res.json();
          if (res.ok) {
            set({
              user: {
                ...user,
                name: data.data.name,
                phone: data.data.phone || "",
                avatarUrl: data.data.avatar || user.avatarUrl,
              },
            });
            toast.success("Profile details updated successfully");
          } else {
            toast.error(data.message || "Failed to update profile details");
          }
        } catch (err) {
          toast.error("Network error occurred updating profile");
        }
      },
      addAddress: async (address) => {
        const { user, token } = get();
        if (!user || !token) return;
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
          const res = await fetch(`${API_URL}/users/profile/addresses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(address),
          });
          const data = await res.json();
          if (res.ok) {
            const currentAddresses = user.addresses || [];
            const mapAddress = (addr: any): Address => ({
              id: addr.id,
              fullName: addr.fullName,
              phone: addr.phone,
              addressLine1: addr.street || addr.addressLine1 || "",
              addressLine2: addr.addressLine2 || "",
              city: addr.city,
              state: addr.state,
              zipCode: addr.postalCode || addr.zipCode || "",
              country: addr.country,
              isDefault: addr.isDefault || false,
            });
            const newAddr = mapAddress(data.data);

            let updatedAddresses = [...currentAddresses];
            if (newAddr.isDefault) {
              updatedAddresses = updatedAddresses.map((addr) => ({ ...addr, isDefault: false }));
            }
            updatedAddresses.push(newAddr);

            set({
              user: {
                ...user,
                addresses: updatedAddresses,
              },
            });
            toast.success("Shipping address registered successfully");
          } else {
            toast.error(data.message || "Failed to add address");
          }
        } catch (err) {
          toast.error("Network error occurred saving address");
        }
      },
      updateAddress: async (id, address) => {
        const { user, token } = get();
        if (!user || !token) return;
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
          const res = await fetch(`${API_URL}/users/profile/addresses/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(address),
          });
          const data = await res.json();
          if (res.ok) {
            const mapAddress = (addr: any): Address => ({
              id: addr.id,
              fullName: addr.fullName,
              phone: addr.phone,
              addressLine1: addr.street || addr.addressLine1 || "",
              addressLine2: addr.addressLine2 || "",
              city: addr.city,
              state: addr.state,
              zipCode: addr.postalCode || addr.zipCode || "",
              country: addr.country,
              isDefault: addr.isDefault || false,
            });
            let updatedAddresses = user.addresses?.map((addr) => (addr.id === id ? mapAddress(data.data) : addr)) || [];

            if (address.isDefault) {
              updatedAddresses = updatedAddresses.map((addr) => ({
                ...addr,
                isDefault: addr.id === id,
              }));
            }

            set({
              user: {
                ...user,
                addresses: updatedAddresses,
              },
            });
            toast.success("Shipping address updated successfully");
          } else {
            toast.error(data.message || "Failed to update address");
          }
        } catch (err) {
          toast.error("Network error occurred updating address");
        }
      },
      deleteAddress: async (id) => {
        const { user, token } = get();
        if (!user || !token) return;
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
          const res = await fetch(`${API_URL}/users/profile/addresses/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const updatedAddresses = user.addresses?.filter((addr) => addr.id !== id) || [];
            if (user.addresses?.find((addr) => addr.id === id)?.isDefault && updatedAddresses.length > 0) {
              updatedAddresses[0].isDefault = true;
            }
            set({
              user: {
                ...user,
                addresses: updatedAddresses,
              },
            });
            toast.success("Shipping address removed successfully");
          }
        } catch (err) {
          toast.error("Network error occurred deleting address");
        }
      },
      setDefaultAddress: async (id) => {
        const { user, token } = get();
        if (!user || !token) return;
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
          const res = await fetch(`${API_URL}/users/profile/addresses/${id}/default`, {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const updatedAddresses = user.addresses?.map((addr) => ({
              ...addr,
              isDefault: addr.id === id,
            })) || [];
            set({
              user: {
                ...user,
                addresses: updatedAddresses,
              },
            });
            toast.success("Default shipping profile updated");
          }
        } catch (err) {
          toast.error("Network error occurred updating default address");
        }
      },
    }),
    {
      name: "flownexa-auth-store",
    }
  )
);
