import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./AuthAdminStore.js"; // Import auth store

const apiUrl = import.meta.env.VITE_API_URL;

const useProductSizeStore = create((set) => ({
  productSizes: [],
  loading: false,
  error: null,
  selectedProductSize: null,

  // Fetch all product sizes
  fetchProductSizes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/product-sizes`);

      // Adjust to handle the structure of the API response
      if (response.data?.productSizes) {
        set({ productSizes: response.data.productSizes, loading: false });
      } else {
        throw new Error("Product sizes not found in the response");
      }
    } catch (error) {
      console.error("Error fetching product sizes:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch product sizes",
        loading: false,
      });
    }
  },

  // Fetch product size by ID
  fetchProductSizeById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/product-sizes/${id}`);
      if (response.data?.productSize) {
        set({ selectedProductSize: response.data.productSize, loading: false });
      } else {
        throw new Error("Product size not found");
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch product size",
        loading: false,
      });
    }
  },

  // Create a new product size
  createProductSize: async (data) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Unauthorized: No token found");

      const response = await axios.post(`${apiUrl}/product-sizes`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        productSizes: [...state.productSizes, response.data],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create product size",
        loading: false,
      });
    }
  },

  // Update product size
  updateProductSize: async (id, data) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Unauthorized: No token found");

      console.log("Sending data to backend:", data); // Log the data

      // Send the PUT request to the backend
      const response = await axios.put(`${apiUrl}/product-sizes/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Log the response to see what is returned from the backend
      console.log("Response from backend:", response.data);

      set((state) => ({
        productSizes: state.productSizes.map((size) =>
          size._id === id ? response.data : size
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating product size:", error); // Log the error
      set({
        error: error.response?.data?.message || "Failed to update product size",
        loading: false,
      });
    }
  },


  // Delete a product size by ID
  deleteProductSize: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("Unauthorized: No token found");

      await axios.delete(`${apiUrl}/product-sizes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        productSizes: state.productSizes.filter((size) => size._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete product size",
        loading: false,
      });
    }
  },
}));

export default useProductSizeStore;
