import { create } from "zustand";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const useSocialMediaLinkStore = create((set) => ({
  socialMediaLinks: null,
  loading: false,
  error: null,

  fetchSocialMediaLinks: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(`${apiUrl}/socialmedia`);
      set({ socialMediaLinks: response.data.data, loading: false }); // Store only the "data" object
    } catch (error) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    }
  },
}));

export default useSocialMediaLinkStore;
