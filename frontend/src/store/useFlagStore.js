import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./AuthAdminStore.js"; // Import auth store

const apiUrl = import.meta.env.VITE_API_URL;

const useFlagStore = create((set) => ({
  flags: [],
  loading: false,
  error: null,
  selectedFlag: null,

  // Fetch all flags
  fetchFlags: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/flags`);
      if (response.data.success && response.data.data) {
        set({ flags: response.data.data, loading: false });
      } else {
        throw new Error("Flags not found in the response");
      }
    } catch (error) {
      console.error("Error fetching flags:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch flags",
        loading: false,
      });
    }
  },

  // Fetch flag by ID
  fetchFlagById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/flags/${id}`);
      if (response.data?.flag) {
        set({ selectedFlag: response.data.flag, loading: false });
      } else {
        throw new Error("Flag not found");
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch flag",
        loading: false,
      });
    }
  },

  // Create a new flag
  createFlag: async (data) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Unauthorized: No token found");

      const response = await axios.post(`${apiUrl}/flags`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        flags: [...state.flags, response.data],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create flag",
        loading: false,
      });
    }
  },

  // Update flag
  updateFlag: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Unauthorized: No token found");

      const response = await axios.put(`${apiUrl}/flags/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        flags: state.flags.map((flag) =>
          flag._id === id ? response.data : flag
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update flag",
        loading: false,
      });
    }
  },

  // Delete a flag by ID
  deleteFlag: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Unauthorized: No token found");

      await axios.delete(`${apiUrl}/flags/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        flags: state.flags.filter((flag) => flag._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete flag",
        loading: false,
      });
    }
  },

  // Update flag positions
  updateFlagPositions: async (flagIds) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Unauthorized: No token found");

      await axios.put(
        `${apiUrl}/flags/rearrange`,
        { flagIds },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      set({ loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update flag positions",
        loading: false,
      });
    }
  },
}));

export default useFlagStore;