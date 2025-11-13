import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useSearchParams } from "react-router-dom";
import useProductStore from "../../store/useProductStore.js";
import useCategoryStore from "../../store/useCategoryStore.js";
import useFlagStore from "../../store/useFlagStore.js";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Typography,
  Drawer,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import Skeleton from "react-loading-skeleton";
import {
  ChevronLeft,
  ChevronRight,
  X as CloseIcon,
  ArrowDownWideNarrow,
  SlidersHorizontal,
  Radio,
  Circle,
  ArrowUp10,
  ArrowDown01,
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  Search,
} from "lucide-react";
import ProductList from "./ProductList.jsx";

const Product = () => {
  // Global store values
  const {
    products,
    totalPages,
    currentPage,
    loading,
    error,
    fetchProducts,
    totalProducts,
  } = useProductStore();

  const { categories } = useCategoryStore();
  const { flags } = useFlagStore();

  // Local state for drawer visibility
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  // Local state for search input (for debouncing)
  const [searchInput, setSearchInput] = useState("");

  // URL search parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Ref to prevent initial fetch on mount
  const isInitialized = useRef(false);

  // Ref for search debounce timer
  const searchTimeoutRef = useRef(null);

  // Get current filters from URL params - single source of truth
  const currentFilters = useMemo(
    () => ({
      page: parseInt(searchParams.get("page")) || 1,
      limit: parseInt(searchParams.get("limit")) || 20,
      sort: searchParams.get("sort") || "",
      category: searchParams.get("category") || "",
      subcategory: searchParams.get("subcategory") || "",
      childCategory: searchParams.get("childCategory") || "",
      stock: searchParams.get("stock") || "",
      flags: searchParams.get("flags") || "",
      search: searchParams.get("search") || "",
    }),
    [searchParams],
  );

  // Initialize search input from URL on component mount
  useEffect(() => {
    setSearchInput(currentFilters.search);
  }, [currentFilters.search]);

  // Function to update URL params
  const updateFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // Handler for search input changes (with debouncing)
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchInput(value);

      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout for debounced search
      searchTimeoutRef.current = setTimeout(() => {
        updateFilters({
          ...currentFilters,
          search: value,
          page: 1, // Reset to first page when search changes
        });
      }, 500); // 500ms debounce delay
    },
    [currentFilters, updateFilters],
  );

  // Clear search handler
  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    updateFilters({
      ...currentFilters,
      search: "",
      page: 1,
    });
  }, [currentFilters, updateFilters]);

  // Handler to change pages
  const handlePageChange = useCallback(
    (newPage) => {
      updateFilters({ ...currentFilters, page: newPage });
    },
    [currentFilters, updateFilters],
  );

  // Handler for all dropdown-based filters
  const handleFilterChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      updateFilters({
        ...currentFilters,
        [name]: value,
        page: 1, // Reset to first page when filters change
      });
      setLeftDrawerOpen(false);
      setRightDrawerOpen(false);
    },
    [currentFilters, updateFilters],
  );

  // Handler to change items per page
  const handleItemsPerPageChange = useCallback(
    (e) => {
      const newLimit = parseInt(e.target.value);
      updateFilters({
        ...currentFilters,
        limit: newLimit,
        page: 1,
      });
    },
    [currentFilters, updateFilters],
  );

  // Custom sort handler for mobile drawer
  const handleSortChange = useCallback(
    (sortValue) => {
      updateFilters({
        ...currentFilters,
        sort: sortValue,
        page: 1,
      });
      setRightDrawerOpen(false);
    },
    [currentFilters, updateFilters],
  );

  // Memoized values to avoid unnecessary re-renders
  const memoizedCategories = useMemo(() => categories || [], [categories]);
  const memoizedFlags = useMemo(
    () => (flags || []).filter((flag) => flag.isActive),
    [flags],
  );

  // Single effect to fetch products when filters change
  useEffect(() => {
    // Skip initial render to prevent double fetch
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    // Create a stable reference for the filters
    const filtersToFetch = { ...currentFilters };

    // Only fetch if we have valid filters
    const hasValidFilters =
      Object.values(filtersToFetch).some(
        (value) => value !== "" && value !== null && value !== undefined,
      ) || filtersToFetch.page === 1;

    if (hasValidFilters) {
      fetchProducts(filtersToFetch);
    }
  }, [currentFilters, fetchProducts]);

  // Initial fetch on component mount
  useEffect(() => {
    if (isInitialized.current === false) {
      fetchProducts(currentFilters);
      isInitialized.current = true;
    }
  }, []); // Only run once on mount

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Show error if exists
  if (error) {
    return (
      <Typography variant="h6" color="error" className="p-4">
        {error}
      </Typography>
    );
  }

  return (
    <div className="xl:container xl:mx-auto px-6 py-5 justify-center md:justify-start">
      {/* Loading skeletons */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, subIdx) => (
                <Skeleton key={subIdx} height={250} width="100%" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Search Bar - Always visible */}

          {/* Mobile Filter/Sort Buttons */}
          <div className="md:hidden mb-4 flex items-center justify-between">
            <IconButton onClick={() => setLeftDrawerOpen(true)}>
              <SlidersHorizontal size={20} className="primaryTextColor" />
            </IconButton>

            <IconButton onClick={() => setRightDrawerOpen(true)}>
              <ArrowDownWideNarrow size={25} className="primaryTextColor" />
            </IconButton>
          </div>

          {/* Mobile Left Drawer (Filters) */}
          <Drawer
            anchor="left"
            open={leftDrawerOpen}
            onClose={() => setLeftDrawerOpen(false)}
          >
            <div className="w-[300px] p-4">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6">Filters</Typography>
                <IconButton onClick={() => setLeftDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="flex flex-col gap-4">
                {/* Search in mobile drawer */}
                <TextField
                  fullWidth
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: searchInput && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleClearSearch}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <CloseIcon size={16} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={currentFilters.category}
                    onChange={handleFilterChange}
                    label="Category"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {memoizedCategories.map((cat) => (
                      <MenuItem key={cat._id} value={cat.name}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Flag</InputLabel>
                  <Select
                    name="flags"
                    value={currentFilters.flags}
                    onChange={handleFilterChange}
                    label="Flag"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {memoizedFlags.map((flag) => (
                      <MenuItem key={flag._id} value={flag.name}>
                        {flag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Stock</InputLabel>
                  <Select
                    name="stock"
                    value={currentFilters.stock}
                    onChange={handleFilterChange}
                    label="Stock"
                  >
                    <MenuItem value="">
                      <em>All</em>
                    </MenuItem>
                    <MenuItem value="in">In Stock</MenuItem>
                    <MenuItem value="out">Out of Stock</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Sort</InputLabel>
                  <Select
                    name="sort"
                    value={currentFilters.sort}
                    onChange={handleFilterChange}
                    label="Sort"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="price_high">Price: High to Low</MenuItem>
                    <MenuItem value="price_low">Price: Low to High</MenuItem>
                    <MenuItem value="name_asc">Name: A to Z</MenuItem>
                    <MenuItem value="name_desc">Name: Z to A</MenuItem>
                    <MenuItem value="latest">Latest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </Drawer>

          {/* Mobile Right Drawer (Sort options) */}
          <Drawer
            anchor="bottom"
            open={rightDrawerOpen}
            onClose={() => setRightDrawerOpen(false)}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6">Sort Options</Typography>
                <IconButton onClick={() => setRightDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </div>

              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                {[
                  { value: "", label: "None", icon: Radio },
                  {
                    value: "price_high",
                    label: "Price: High to Low",
                    icon: ArrowUp10,
                  },
                  {
                    value: "price_low",
                    label: "Price: Low to High",
                    icon: ArrowDown01,
                  },
                  {
                    value: "name_asc",
                    label: "Name: A to Z",
                    icon: ArrowDownAZ,
                  },
                  {
                    value: "name_desc",
                    label: "Name: Z to A",
                    icon: ArrowUpAZ,
                  },
                  { value: "latest", label: "Latest", icon: ArrowUpNarrowWide },
                  {
                    value: "oldest",
                    label: "Oldest",
                    icon: ArrowDownNarrowWide,
                  },
                ].map(({ value, label, icon: Icon }) => (
                  <div
                    key={value}
                    className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-100"
                    onClick={() => handleSortChange(value)}
                  >
                    {currentFilters.sort === value ? (
                      <Circle className="mr-3 text-primary" size={20} />
                    ) : (
                      <Icon className="mr-3 text-secondary" size={20} />
                    )}
                    <Typography
                      className={
                        currentFilters.sort === value
                          ? "font-semibold text-primary"
                          : "text-secondary"
                      }
                    >
                      {label}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </Drawer>

          {/* Desktop Filters */}
          <div className="hidden md:block mb-6">
            <Grid container spacing={2}>
              <Grid item xs={4} sm={4} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={currentFilters.category}
                    onChange={handleFilterChange}
                    label="Category"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {memoizedCategories.map((cat) => (
                      <MenuItem key={cat._id} value={cat.name}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4} sm={4} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Flag</InputLabel>
                  <Select
                    name="flags"
                    value={currentFilters.flags}
                    onChange={handleFilterChange}
                    label="Flag"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {memoizedFlags.map((flag) => (
                      <MenuItem key={flag._id} value={flag.name}>
                        {flag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4} sm={4} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Stock</InputLabel>
                  <Select
                    name="stock"
                    value={currentFilters.stock}
                    onChange={handleFilterChange}
                    label="Stock"
                  >
                    <MenuItem value="">
                      <em>All</em>
                    </MenuItem>
                    <MenuItem value="in">In Stock</MenuItem>
                    <MenuItem value="out">Out of Stock</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Sort</InputLabel>
                  <Select
                    name="sort"
                    value={currentFilters.sort}
                    onChange={handleFilterChange}
                    label="Sort"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="price_high">Price: High to Low</MenuItem>
                    <MenuItem value="price_low">Price: Low to High</MenuItem>
                    <MenuItem value="name_asc">Name: A to Z</MenuItem>
                    <MenuItem value="name_desc">Name: Z to A</MenuItem>
                    <MenuItem value="latest">Latest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Items per page</InputLabel>
                  <Select
                    value={currentFilters.limit}
                    onChange={handleItemsPerPageChange}
                    label="Items per page"
                  >
                    {[5, 10, 20, 50].map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>

          {/* Active Search/Filter Indicators */}
          {(currentFilters.search ||
            currentFilters.category ||
            currentFilters.flags ||
            currentFilters.stock !== "" ||
            currentFilters.sort) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {currentFilters.search && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <Search size={14} />
                  Search: "{currentFilters.search}"
                  <button
                    onClick={handleClearSearch}
                    className="hover:bg-blue-200 rounded-full p-1"
                  >
                    <CloseIcon size={12} />
                  </button>
                </div>
              )}
              {currentFilters.category && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Category: {currentFilters.category}
                </div>
              )}
              {currentFilters.flags && (
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Flag: {currentFilters.flags}
                </div>
              )}
              {currentFilters.stock && (
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  Stock:{" "}
                  {currentFilters.stock === "in" ? "In Stock" : "Out of Stock"}
                </div>
              )}
              {currentFilters.sort && (
                <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  Sort:{" "}
                  {currentFilters.sort
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
              )}
            </div>
          )}

          {/* Product List or No Results */}
          {products.length === 0 && !loading ? (
            <div className="text-center py-20">
              <Typography variant="h6" className="text-gray-500 mb-4">
                {currentFilters.search
                  ? `No products found for "${currentFilters.search}"`
                  : "No products found"}
              </Typography>
              <Typography variant="body2" className="text-gray-400">
                {currentFilters.search
                  ? "Try a different search term or adjust your filters"
                  : "Try adjusting your filters or search criteria"}
              </Typography>
            </div>
          ) : (
            <ProductList products={products} />
          )}

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={() => handlePageChange(currentFilters.page - 1)}
                disabled={currentFilters.page === 1 || loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
                  ${
                    currentFilters.page === 1 || loading
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-gray-500 hover:bg-gray-100"
                  }`}
              >
                <ChevronLeft size={18} />
                <span className="hidden md:block">Previous</span>
              </button>

              <div className="flex items-center gap-2 text-sm">
                <span>
                  Page {currentFilters.page} of {totalPages}
                </span>
                <span className="hidden md:block text-gray-500">
                  • {totalProducts} Products
                  {currentFilters.search && ` for "${currentFilters.search}"`}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentFilters.page + 1)}
                disabled={currentFilters.page >= totalPages || loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
                  ${
                    currentFilters.page >= totalPages || loading
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-gray-500 hover:bg-gray-100"
                  }`}
              >
                <span className="hidden md:block">Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Product;
