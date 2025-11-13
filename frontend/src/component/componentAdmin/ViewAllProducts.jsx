import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import useProductStore from "../../store/useProductStore.js";
import ImageComponent from "../componentGeneral/ImageComponent.jsx";
import { FaEye } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { BsArrowsCollapse } from "react-icons/bs";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import RequirePermission from "./RequirePermission.jsx";

const ViewAllProducts = () => {
  const {
    products,
    totalPages,
    currentPage,
    loading,
    error,
    fetchProductsAdmin,
    deleteProduct,
  } = useProductStore();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
  });
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetchProductsAdmin(filters);
  }, [filters.page, filters.limit, fetchProductsAdmin]);

  useEffect(() => {
    setFilteredProducts(
      products
        .filter((product) =>
          product.name.toLowerCase().includes(filters.search.toLowerCase()),
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), // Sort newest first
    );
  }, [filters.search, products]);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  }, []);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Open the confirmation dialog
  const handleOpenDialog = (id) => {
    setSelectedProductId(id);
    setOpenDialog(true);
  };

  // Close the confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProductId(null);
  };

  // Handle product deletion
  const handleDelete = async () => {
    try {
      // Call the deleteProduct method to delete the product
      await deleteProduct(selectedProductId);

      // Successfully deleted
      setSnackbar({
        open: true,
        message: `Product ID ${selectedProductId} deleted successfully!`,
        type: "success",
      });

      // Refetch the product list after deletion
      fetchProductsAdmin(filters);
    } catch (err) {
      // Error occurred
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to delete product.",
        type: "error",
      });
    } finally {
      // Close the dialog after handling delete or error
      handleCloseDialog();
    }
  };

  if (loading)
    return (
      <div className="shadow p-7 rounded-lg grid gap-2">
        <Skeleton height={50} width={"30%"} />
        <div className={"grid grid-cols-2 gap-1"}>
          <Skeleton height={50} width={"80%"} />
          <Skeleton height={50} width={"80%"} />
        </div>
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
        <div className={"grid grid-cols-2 gap-1"}>
          <Skeleton height={50} width={"90%"} />
          <Skeleton height={50} width={"90%"} />
        </div>
      </div>
    );
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Product List
      </h1>
      <div className="flex items-center justify-between">
        <TextField
          label="Search"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <div className="flex items-center justify-center space-x-3 p-4">
          <h1 className="text-lg font-semibold text-gray-700">Show</h1>

          <div className="relative">
            <select
              name="limit"
              value={filters.limit}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm appearance-none pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <BsArrowsCollapse className="absolute right-2 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <h1 className="text-lg font-semibold text-gray-700">entries</h1>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SL No.</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discount Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Flags</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>{product.productId}</TableCell>
                <TableCell>
                  <div className="relative group">
                    <ImageComponent
                      imageName={product?.thumbnailImage}
                      altName={product?.name}
                      skeletonHeight={30}
                      className="w-25 h-25 object-cover transform group-hover:scale-150 transition-transform duration-300"
                    />
                  </div>
                </TableCell>
                <TableCell>{product?.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                {/*Main Price*/}
                <TableCell>
                  {product.variants?.length
                    ? product.variants.map((v) => v.price).join(", ")
                    : product.finalPrice}
                </TableCell>
                {/*Discount Price*/}
                <TableCell>
                  {product.variants?.length
                    ? product.variants.map((v) => v.discount).join(", ")
                    : product.finalDiscount}
                </TableCell>
                <TableCell>
                  {product.variants?.length
                    ? `${product.variants.map((v) => v.stock).join(", ")} (Total: ${product.variants.reduce((sum, v) => sum + v.stock, 0)})`
                    : product.finalStock}
                </TableCell>
                <TableCell>
                  {product.flags?.length
                    ? product.flags.map((flag, index) => flag.name).join(", ") // Join flag names with a comma
                    : "No Flags"}
                </TableCell>
                <TableCell>
                  {product.isActive ? (
                    <span className="text-green-500">Active</span>
                  ) : (
                    <span className="text-red-500">Inactive</span>
                  )}
                </TableCell>

                <TableCell>
                  <div className={"flex gap-1 flex-col"}>
                    <div
                      className={
                        "primaryBgColor py-1  flex justify-center items-center accentTextColor rounded-lg"
                      }
                    >
                      <a
                        href={`/product/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaEye className="w-5 h-5" />
                      </a>
                    </div>
                    <RequirePermission
                      permission="edit_products"
                      fallback={true}
                    >
                      <div
                        className={
                          "primaryBgColor py-1 flex justify-center items-center accentTextColor rounded-lg"
                        }
                      >
                        <Link to={`/admin/edit-product/${product.slug}`}>
                          <FaRegEdit className="w-5 h-5" />
                        </Link>
                      </div>
                    </RequirePermission>
                    <RequirePermission
                      permission="delete_products"
                      fallback={true}
                    >
                      <div
                        className={
                          "primaryBgColor py-1 flex justify-center items-center accentTextColor rounded-lg"
                        }
                      >
                        <MdDeleteOutline
                          onClick={() => handleOpenDialog(product.productId)}
                          className={"w-5 h-5 cursor-pointer"}
                        />
                      </div>
                    </RequirePermission>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position at top right
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div className="flex justify-center items-center my-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Typography mx={2}>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ViewAllProducts;
