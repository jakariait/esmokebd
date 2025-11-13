import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";
import useAuthAdminStore from "../../store/AuthAdminStore.js";

const apiURL = import.meta.env.VITE_API_URL;
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

const defaultCoupon = {
  code: "",
  type: "percentage",
  value: "",
  minimumOrder: "",
  startDate: "",
  endDate: "",
  status: "active",
};

const CouponTable = () => {
  const { token } = useAuthAdminStore();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(defaultCoupon);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${apiURL}/getAllCoupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(response.data.data || []);
    } catch (err) {
      showSnackbar("Failed to load coupons.", "error");
      setError("Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleEdit = (coupon) => {
    setIsEdit(true);
    setFormData({ ...coupon });
    setFormOpen(true);
  };

  const handleCreate = () => {
    setIsEdit(false);
    setFormData(defaultCoupon);
    setFormOpen(true);
  };

  const saveCoupon = async () => {
    try {
      const url = isEdit
        ? `${apiURL}/updateCoupon/${formData._id}`
        : `${apiURL}/createCoupon`;

      const method = isEdit ? axios.patch : axios.post;

      const response = await method(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (isEdit) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === formData._id ? response.data.data : c)),
        );
        showSnackbar("Coupon updated successfully");
        fetchCoupons(); // 👈 Refetch
      } else {
        setCoupons((prev) => [...prev, response.data.data]);
        showSnackbar("Coupon created successfully");
        fetchCoupons(); // 👈 Refetch
      }

      setFormOpen(false);
    } catch (err) {
      showSnackbar("Failed to save coupon", "error");
    }
  };

  const confirmDelete = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!couponToDelete) return;

    try {
      await axios.delete(`${apiURL}/deleteCoupon/${couponToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(coupons.filter((c) => c._id !== couponToDelete._id));
      showSnackbar("Coupon deleted successfully.");
      fetchCoupons(); // 👈 Refetch
    } catch (err) {
      showSnackbar("Failed to delete coupon.", "error");
    } finally {
      setDeleteDialogOpen(false);
      setCouponToDelete(null);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="p-4 flex gap-6 flex-col justify-start shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor  pl-2 text-lg font-semibold">
        Coupon Management
      </h1>
      <div className="flex items-center justify-center">
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ mt: 2 }}
          onClick={handleCreate}
        >
          Create New Coupon
        </Button>
      </div>

      <h1 className="border-l-4 primaryBorderColor primaryTextColor mt-6 pl-2 text-lg font-semibold">
        All Coupons
      </h1>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Coupon Code</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Value</TableCell>
              <TableCell align="center">Minimum Order</TableCell>
              <TableCell align="center">Start Date</TableCell>
              <TableCell align="center">End Date</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell align="center">{coupon.code}</TableCell>
                <TableCell align="center">
                  {capitalizeFirst(coupon.type)}
                </TableCell>
                <TableCell align="center">
                  {coupon.type === "percentage"
                    ? `${coupon.value}%`
                    : `${coupon.value}`}
                </TableCell>
                <TableCell align="center">Tk. {coupon.minimumOrder}</TableCell>
                <TableCell align="center">
                  {formatDate(coupon.startDate)}
                </TableCell>
                <TableCell align="center">
                  {formatDate(coupon.endDate)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={capitalizeFirst(coupon.status)}
                    color={coupon.status === "active" ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <div className={"flex"}>
                    <IconButton
                      onClick={() => handleEdit(coupon)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => confirmDelete(coupon)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEdit ? "Update Coupon" : "Create Coupon"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Coupon Code"
            fullWidth
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            sx={{ mt: 2 }}
            required
          />
          <TextField
            label="Type"
            fullWidth
            select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            sx={{ mt: 2 }}
            required
          >
            <MenuItem value="percentage">Percentage</MenuItem>
            <MenuItem value="amount">Amount</MenuItem>
          </TextField>
          <TextField
            label="Value"
            type="number"
            fullWidth
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
            sx={{ mt: 2 }}
            required
          />
          <TextField
            label="Minimum Order"
            type="number"
            fullWidth
            value={formData.minimumOrder}
            onChange={(e) =>
              setFormData({ ...formData, minimumOrder: e.target.value })
            }
            sx={{ mt: 2 }}
            required
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.startDate?.slice(0, 10)}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            sx={{ mt: 2 }}
            required
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.endDate?.slice(0, 10)}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            sx={{ mt: 2 }}
            required
          />
          <TextField
            label="Status"
            fullWidth
            select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            sx={{ mt: 2 }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={saveCoupon} variant="contained">
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete coupon{" "}
          <strong>{couponToDelete?.code}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmed}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CouponTable;
