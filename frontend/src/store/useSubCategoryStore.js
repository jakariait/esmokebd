import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./AuthAdminStore.js"; // Import auth store
const apiUrl = import.meta.env.VITE_API_URL;

const useSubCategoryStore = create((set) => ({
  subCategories: [],
  loading: false,
  error: null,

  fetchSubCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/sub-category`);
      set({ subCategories: response.data.subCategories || [], loading: false }); // Extract `subCategories`
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch subcategories",
        loading: false,
      });
    }
  },

  fetchSubCategoryById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/sub-category/${id}`);
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch subcategory",
        loading: false,
      });
      return null;
    }
  },

  createSubCategory: async (data) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token; // Get token automatically
      if (!token) throw new Error("Unauthorized: No token found");

      const response = await axios.post(`${apiUrl}/sub-category`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        subCategories: [...state.subCategories, response.data],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create subcategory",
        loading: false,
      });
    }
  },

  updateSubCategory: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Unauthorized: No token found");

      const response = await axios.put(`${apiUrl}/sub-category/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        subCategories: state.subCategories.map((sub) =>
          sub._id === id ? response.data : sub,
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update subcategory",
        loading: false,
      });
    }
  },

  deleteSubCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Unauthorized: No token found");

      await axios.delete(`${apiUrl}/sub-category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        subCategories: state.subCategories.filter((sub) => sub._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete subcategory",
        loading: false,
      });
    }
  },
}));

export default useSubCategoryStore;
