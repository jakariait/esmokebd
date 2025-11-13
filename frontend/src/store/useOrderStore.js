import { create } from "zustand";
import axios from "axios";
import useAuthAdminStore from "./AuthAdminStore.js";

const apiUrl = import.meta.env.VITE_API_URL;

const useOrderStore = create((set, get) => ({
  // Status-wise orders and totals
  orderListByStatus: {
    pending: [],
    approved: [],
    intransit: [],
    delivered: [],
    returned: [],
    cancelled: [],
  },
  totalByStatus: {
    pending: 0,
    approved: 0,
    intransit: 0,
    delivered: 0,
    returned: 0,
    cancelled: 0,
  },

  // All orders regardless of status
  allOrders: [],
  totalOrders: 0,
  totalPages: 1,
  currentPage: 1,
  itemsPerPage: 10,
  currentStatus: "", // Track current status filter

  // Search functionality
  searchQuery: "",

  // Common loading/error state
  orderListLoading: false,
  orderListError: null,

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  setItemsPerPage: (limit) => {
    set({ itemsPerPage: limit, currentPage: 1 });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
  },

  clearSearch: () => {
    set({ searchQuery: "", currentPage: 1 });
  },

  fetchAllOrders: async (status = "", page = 1, limit = 10) => {
    const token = useAuthAdminStore.getState().token;
    const { searchQuery } = get(); // Get the current search query

    set({
      orderListLoading: true,
      orderListError: null,
      currentStatus: status,
    });

    try {
      const params = {
        page,
        limit,
      };

      // Add status filter if provided
      if (status) {
        params.orderStatus = status;
      }

      // Add search query if provided
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await axios.get(`${apiUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      if (res.data.success) {
        const { orders, totalOrders, totalPages, currentPage } = res.data;

        if (status) {
          set((state) => ({
            orderListByStatus: {
              ...state.orderListByStatus,
              [status]: orders || [],
            },
            totalByStatus: {
              ...state.totalByStatus,
              [status]: totalOrders || 0,
            },
            totalOrders: totalOrders || 0,
            totalPages: totalPages || 1,
            currentPage: currentPage || 1,
            itemsPerPage: limit,
            orderListLoading: false,
          }));
        } else {
          set({
            allOrders: orders || [],
            totalOrders: totalOrders || 0,
            totalPages: totalPages || 1,
            currentPage: currentPage || 1,
            itemsPerPage: limit,
            orderListLoading: false,
          });
        }
      } else {
        set({
          orderListError: "Failed to fetch orders",
          orderListLoading: false,
        });
      }
    } catch (error) {
      set({
        orderListError:
          error.response?.data?.message || "Failed to fetch orders",
        orderListLoading: false,
      });
    }
  },

  fetchAllOrdersWithoutPagination: async (status = "", page, limit) => {
    const token = useAuthAdminStore.getState().token;

    set({
      orderListLoading: true,
      orderListError: null,
      currentStatus: status,
    });

    try {
      const params = {};

      // Add status filter if provided
      if (status) {
        params.orderStatus = status;
      }

      // Add pagination if provided
      if (page) params.page = page;
      if (limit) params.limit = limit;

      const res = await axios.get(`${apiUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      if (res.data.success) {
        const { orders, totalOrders, totalPages, currentPage } = res.data;

        if (status) {
          set((state) => ({
            orderListByStatus: {
              ...state.orderListByStatus,
              [status]: orders || [],
            },
            totalByStatus: {
              ...state.totalByStatus,
              [status]: totalOrders || 0,
            },
            totalOrders: totalOrders || 0,
            totalPages: totalPages || 1,
            currentPage: currentPage || 1,
            itemsPerPage: limit || 10,
            orderListLoading: false,
          }));
        } else {
          set({
            allOrders: orders || [],
            totalOrders: totalOrders || 0,
            totalPages: totalPages || 1,
            currentPage: currentPage || 1,
            itemsPerPage: limit || 10,
            orderListLoading: false,
          });
        }
      } else {
        set({
          orderListError: "Failed to fetch orders",
          orderListLoading: false,
        });
      }
    } catch (error) {
      set({
        orderListError:
          error.response?.data?.message || "Failed to fetch orders",
        orderListLoading: false,
      });
    }
  },

  fetchStatusCount: async (status) => {
    const token = useAuthAdminStore.getState().token;
    try {
      const res = await axios.get(`${apiUrl}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { orderStatus: status, page: 1, limit: 1 }, // get only 1 to get the count
      });

      if (res.data.success) {
        set((state) => ({
          totalByStatus: {
            ...state.totalByStatus,
            [status]: res.data.totalOrders || 0,
          },
        }));
      }
    } catch (error) {
      // Silently fail for background count fetching
      console.error(`Failed to fetch count for status ${status}:`, error);
    }
  },

  fetchAllStatusCounts: async () => {
    const { fetchStatusCount } = get();
    const statuses = [
      "pending",
      "approved",
      "intransit",
      "delivered",
      "returned",
      "cancelled",
    ];
    await Promise.all(statuses.map((status) => fetchStatusCount(status)));
  },

  // Helper function to refresh current view
  refreshOrders: () => {
    const { currentStatus, currentPage, itemsPerPage } = get();
    get().fetchAllOrders(currentStatus, currentPage, itemsPerPage);
  },
}));

export default useOrderStore;