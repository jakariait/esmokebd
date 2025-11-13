import { create } from "zustand";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const CarouselStore = create((set) => ({
  CarouselStoreList: null,
  CarouselStoreListLoading: false,
  CarouselStoreListError: null,

  CarouselStoreListRequest: async () => {
    set({ CarouselStoreListLoading: true, CarouselStoreListError: null });

    try {
      const res = await axios.get(`${apiUrl}/getallcarousel`);

      // Check if res.data contains the expected data
      if (res.data) {
        set({
          CarouselStoreList: res.data, // Directly use res.data
          CarouselStoreListLoading: false,
        });
      } else {
        throw new Error("Failed to fetch Carousel");
      }
    } catch (error) {
      set({
        CarouselStoreListError: error.message || "Unknown Error",
        CarouselStoreListLoading: false,
      });
    }
  },
}));

export default CarouselStore;
