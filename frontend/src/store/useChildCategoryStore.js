import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./AuthAdminStore.js"; // Import auth store
const apiUrl = import.meta.env.VITE_API_URL;

const useChildCategoryStore = create((set) => ({
  childCategories: [],
  selectedChildCategory: null,
  loading: false,
  error: null,

  // Fetch all child categories
  fetchChildCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/child-category`);
      set({ childCategories: response.data.childCategories || [], loading: false });
    } catch (error) {
      console.error("Error fetching child categories:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch child categories",
        loading: false,
      });
    }
  },

  // Fetch a single child category by ID
  fetchChildCategoryById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/child-category/${id}`);
      set({ selectedChildCategory: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch child category",
        loading: false,
      });
      return null;
    }
  },

  // Create a new child category
  createChildCategory: async (data) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Unauthorized: No token found");

      const response = await axios.post(`${apiUrl}/child-category`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        childCategories: [...state.childCategories, response.data],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create child category",
        loading: false,
      });
    }
  },

  // Update a child category
  updateChildCategory: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Unauthorized: No token found");

      const response = await axios.put(`${apiUrl}/child-category/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        childCategories: state.childCategories.map((child) =>
          child._id === id ? response.data : child
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update child category",
        loading: false,
      });
    }
  },

  // Delete a child category
  deleteChildCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Unauthorized: No token found");

      await axios.delete(`${apiUrl}/child-category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        childCategories: state.childCategories.filter((child) => child._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete child category",
        loading: false,
      });
    }
  },
}));

export default useChildCategoryStore;
