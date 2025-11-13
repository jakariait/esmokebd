import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import useAuthAdminStore from "../../store/AuthAdminStore.js";

const DeliveryCharge = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [shippingMethods, setShippingMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuthAdminStore();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentMethod, setCurrentMethod] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedValue, setEditedValue] = useState("");

  useEffect(() => {
    fetchShippingMethods();

    // 👂 Listen for custom event
    const handleShippingCreated = () => fetchShippingMethods();
    window.addEventListener("shippingMethodCreated", handleShippingCreated);

    return () => {
      window.removeEventListener("shippingMethodCreated", handleShippingCreated);
    };
  }, [apiUrl]);

  const fetchShippingMethods = async () => {
    try {
      const res = await axios.get(`${apiUrl}/getAllShipping`);
      setShippingMethods(res.data.data || []);
    } catch (err) {
      setError("Failed to load shipping methods");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (method) => {
    setCurrentMethod(method);
    setEditedName(method.name);
    setEditedValue(method.value);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await axios.patch(
        `${apiUrl}/updateShipping/${currentMethod._id}`,
        {
          name: editedName,
          value: editedValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchShippingMethods();
      setEditDialogOpen(false);
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleDeleteOpen = (method) => {
    setCurrentMethod(method);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${apiUrl}/deleteShipping/${currentMethod._id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ using Zustand token now
        },
      });
      fetchShippingMethods();
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className={"shadow rounded-lg p-4"}>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Delivery Charge List
      </h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Charge</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippingMethods.map((method) => (
              <TableRow key={method._id}>
                <TableCell>{method.name}</TableCell>
                <TableCell>Tk. {method.value}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditOpen(method)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteOpen(method)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Delivery Method</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="dense"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Charge"
            type="number"
            margin="dense"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{currentMethod?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
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

export default DeliveryCharge;
