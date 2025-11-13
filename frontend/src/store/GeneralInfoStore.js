import { create } from "zustand";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const useGeneralInfoStore = create((set) => ({
  GeneralInfoList: null,
  GeneralInfoListLoading: false,
  GeneralInfoListError: null,
  GeneralInfoUpdateLoading: false,
  GeneralInfoDeleteLoading: false,
  GeneralInfoSuccessMessage: null,
  GeneralInfoErrorMessage: null,

  // Fetch General Info
  GeneralInfoListRequest: async () => {
    set({ GeneralInfoListLoading: true, GeneralInfoListError: null });
    try {
      const res = await axios.get(`${apiUrl}/getGeneralInfo`);
      set({ GeneralInfoList: res.data, GeneralInfoListLoading: false });
    } catch (error) {
      set({
        GeneralInfoListError: error.response?.data?.message || "Failed to fetch General Info",
        GeneralInfoListLoading: false,
      });
    }
  },

  // Update General Info

  GeneralInfoUpdate: async (formData, token) => {
    set({ GeneralInfoUpdateLoading: true, GeneralInfoErrorMessage: null, GeneralInfoSuccessMessage: null });
    try {
      const res = await axios.post(`${apiUrl}/updateGeneralInfo`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      set({ GeneralInfoSuccessMessage: res.data.message, GeneralInfoUpdateLoading: false });
      return { success: true, message: res.data.message };
    } catch (error) {
      set({
        GeneralInfoErrorMessage: error.response?.data?.message || "Failed to update General Info",
        GeneralInfoUpdateLoading: false,
      });
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update General Info",
        status: error.response?.status
      };
    }
  },



  // Delete General Info
  GeneralInfoDelete: async (token) => {
    set({ GeneralInfoDeleteLoading: true, GeneralInfoErrorMessage: null, GeneralInfoSuccessMessage: null });
    try {
      await axios.delete(`${apiUrl}/deleteGeneralInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ GeneralInfoSuccessMessage: "General Info deleted successfully", GeneralInfoDeleteLoading: false });
    } catch (error) {
      set({
        GeneralInfoErrorMessage: error.response?.data?.message || "Failed to delete General Info",
        GeneralInfoDeleteLoading: false,
      });
    }
  },
}));

export default useGeneralInfoStore;
