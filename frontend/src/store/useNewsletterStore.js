import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./AuthAdminStore.js";

const apiUrl = import.meta.env.VITE_API_URL; // Ensure API URL is set correctly

const useNewsletterStore = create((set, get) => ({
  subscribers: [], // List of subscribers
  isLoading: false, // Loading state
  error: null, // Error messages

  // Fetch all subscribers
  fetchSubscribers: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        set({ error: "No token found. Please log in.", isLoading: false });
        return;
      }

      const res = await axios.get(`${apiUrl}/subscribers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        subscribers: Array.isArray(res.data) ? res.data : [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Fetch Subscribers Error:", error.response || error);
      set({
        error: error.response?.data?.message || "Failed to fetch subscribers",
        isLoading: false,
      });
    }
  },

  // Subscribe a new user and return success status
  subscribe: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${apiUrl}/subscribe`,
        { Email: email }, // Use "Email" if your backend expects this key
        { headers: { "Content-Type": "application/json" } }
      );

      // Accept any successful status code (200-299)
      if (response.status >= 200 && response.status < 300) {
        set((state) => ({
          subscribers: [...state.subscribers, { email }],
          isLoading: false,
          error: null,
        }));
        return true;
      } else {
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Subscription failed",
        isLoading: false,
      });
      return false;
    }
  },

  // Delete a subscriber by email
  deleteSubscriber: async (email) => {
    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      await axios.delete(`${apiUrl}/delete-subscriber`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { Email: email }, // Changed key to "Email" to match backend expectations
      });

      set((state) => ({
        subscribers: state.subscribers.filter((sub) => sub.email !== email),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete subscriber",
        isLoading: false,
      });
    }
  },

}));

export default useNewsletterStore;

