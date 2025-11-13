import React, { useEffect, useState } from "react";
import ImageComponent from "../componentGeneral/ImageComponent.jsx";
import CourierSummery from "./CourierSummery.jsx";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import RequirePermission from "./RequirePermission.jsx";

const AbandonedCartsList = ({ data, onPageChange, onDeleteRequest }) => {
  const { totalCount, carts, page, limit } = data;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Incomplete Orders ({totalCount})
      </h1>

      {carts.length === 0 ? (
        <p className="text-gray-600">No  Incomplete Orders Found.</p>
      ) : (
        <div className="space-y-4">
          {carts.map((cart) => (
            <div
              key={cart._id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 mb-2">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {cart.fullName || "Unnamed Customer"}
                  </h3>
                  <div className="text-sm text-gray-700 space-y-0.5">
                    <p>
                      <strong>Number:</strong> {cart.number || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong> {cart.email || "N/A"}
                    </p>
                    <p>
                      <strong>Address:</strong> {cart.address || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="text-sm">
                  <CourierSummery phone={cart.number} />
                </div>

                <div className="text-right flex flex-col mt-3 md:mt-0 items-end space-y-1">
                  <p className="text-md font-semibold text-gray-800">
                    Total: Tk.{cart.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(cart.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <RequirePermission permission="delete_incomplete_orders"  fallback={true}>
                    <button
                      onClick={() => onDeleteRequest(cart._id)}
                      className="text-xs primaryBgColor accentTextColor rounded-md px-2 py-1 cursor-pointer"
                    >
                      Delete
                    </button>
                  </RequirePermission >
                </div>
              </div>

              {cart.cartItems.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  {cart.cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center space-x-3 border border-gray-100 rounded-md p-2"
                    >
                      <ImageComponent
                        imageName={item.product?.thumbnailImage}
                        altName={item.product?.name}
                        skeletonHeight={50}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-medium">
                          {item.product?.name || "-"}
                        </p>
                        <p className="text-gray-500">
                          {item.product?.category || "-"} |{" "}
                          {item.variant?.sizeName || "No size"}
                        </p>
                        <p className="text-gray-700">
                          Tk.{item.price.toFixed(2)} × {item.quantity} ={" "}
                          <span className="font-semibold">
                            Tk.{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 mt-2">No items in cart.</p>
              )}
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-1 rounded primaryBgColor accentTextColor disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-1 rounded primaryBgColor accentTextColor disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AbandonedCartsContainer = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();

  const [data, setData] = useState({
    totalCount: 0,
    carts: [],
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState(null);

  const fetchAbandonedCarts = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiUrl}/abandoned-cart?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      if (json.success) {
        setData({
          carts: json.data.carts,
          totalCount: json.data.totalCount,
          page,
          limit,
        });
        setError(null);
      } else {
        throw new Error(json.message || "Failed to fetch abandoned carts");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show dialog when user clicks delete button
  const handleDeleteRequest = (cartId) => {
    setSelectedCartId(cartId);
    setOpenDialog(true);
  };

  // Confirm delete and call API
  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`${apiUrl}/abandoned-cart/${selectedCartId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete cart");
      }

      setOpenDialog(false);
      setSelectedCartId(null);

      // Refresh the list after deletion
      fetchAbandonedCarts(data.page, data.limit);
    } catch (err) {
      alert("Error deleting cart: " + err.message);
    }
  };

  // Cancel delete dialog
  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedCartId(null);
  };

  useEffect(() => {
    fetchAbandonedCarts();
  }, []);

  const handlePageChange = (newPage) => {
    fetchAbandonedCarts(newPage, data.limit);
  };

  if (loading)
    return <p className="text-center mt-10">Loading abandoned carts...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600">Error: {error}</p>;

  return (
    <>
      <AbandonedCartsList
        data={data}
        onPageChange={handlePageChange}
        onDeleteRequest={handleDeleteRequest}
      />

      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Delete Abandoned Cart</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this abandoned cart? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>

          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AbandonedCartsContainer;
