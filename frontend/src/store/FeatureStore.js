import { create } from "zustand";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const FeatureStore = create((set) => ({
  FeatureStoreList: [], // Initialize as an empty array
  FeatureStoreListLoading: false,
  FeatureStoreListError: null,

  FeatureStoreListRequest: async () => {
    set({ FeatureStoreListLoading: true, FeatureStoreListError: null });

    try {
      const res = await axios.get(`${apiUrl}/feature-images`);

      // Check if res.data contains the expected data
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        set({
          FeatureStoreList: res.data.data, // Set the data array
          FeatureStoreListLoading: false,
        });
      } else {
        throw new Error("Invalid data format: Expected an array");
      }
    } catch (error) {
      set({
        FeatureStoreListError: error.message || "Unknown Error",
        FeatureStoreListLoading: false,
      });
    }
  },
}));

export default FeatureStore;