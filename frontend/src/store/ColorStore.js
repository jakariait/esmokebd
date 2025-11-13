import { create } from "zustand";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const useColorStore = create((set) => ({
  colors: null,
  isLoading: false,
  error: null,

  // Fetch the colors from the API
  fetchColors: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.get(`${apiUrl}/colors`);

      if (res.data?.data) {
        // Store colors in Zustand & localStorage for caching
        localStorage.setItem("themeColors", JSON.stringify(res.data.data));
        set({ colors: res.data.data, isLoading: false });
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      set({ error: error.message || "Failed to fetch colors", isLoading: false });
    }
  },

  // Update the colors using the PUT API call
  updateColors: async (newColors, token) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.put(`${apiUrl}/colors`, newColors, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.data) {
        // Store the updated colors in Zustand & localStorage
        localStorage.setItem("themeColors", JSON.stringify(res.data.data));
        set({ colors: res.data.data, isLoading: false });
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      set({ error: error.message || "Failed to update colors", isLoading: false });
    }
  },
}));

export default useColorStore;
