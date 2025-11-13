import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import useAuthAdminStore from "../../store/AuthAdminStore.js";

const defaultForm = {
  question: "",
  answer: "",
  status: "published",
};

const AdminFAQSection = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const { token } = useAuthAdminStore();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/faq`);
      setFaqs(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load FAQs:", err);
      showSnackbar("Failed to load FAQs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [apiUrl]);

  const handleOpen = (faq = null) => {
    if (faq) {
      setFormData(faq);
      setEditingId(faq._id);
    } else {
      setFormData(defaultForm);
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setFormData(defaultForm);
    setEditingId(null);
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.patch(`${apiUrl}/faq/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showSnackbar("FAQ updated successfully", "success");
      } else {
        await axios.post(`${apiUrl}/faq`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showSnackbar("FAQ added successfully", "success");
      }
      fetchFAQs();
      handleClose();
    } catch (err) {
      console.error("Save failed", err);
      showSnackbar("Failed to save FAQ", "error");
    }
  };

  const confirmDeleteFAQ = (faq) => {
    setFaqToDelete(faq);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${apiUrl}/faq/${faqToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showSnackbar("FAQ deleted successfully", "success");
      fetchFAQs();
    } catch (err) {
      console.error("Delete failed", err);
      showSnackbar("Failed to delete FAQ", "error");
    } finally {
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
    }
  };

  return (
    <Box className="p-4 shadow rounded-lg">
      <Box className="flex justify-between items-center mb-6">
        <h1 className="border-l-4 primaryBorderColor primaryTextColor pl-2 text-lg font-semibold">
          Manage FAQs
        </h1>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add FAQ
        </Button>
      </Box>

      {loading ? (
        <Box className="flex justify-center items-center h-40">
          <CircularProgress />
        </Box>
      ) : (
        <Box className="grid md:grid-cols-2 items-center justify-center gap-6">
          {faqs.map((faq) => (
            <Box key={faq._id} className="p-4 rounded-lg shadow transition-all">
              <Box className="flex justify-between items-start">
                <Box>
                  <Typography variant="subtitle1" className="font-semibold">
                    {faq.question}
                  </Typography>
                  <Typography variant="body2" className="mt-1 text-gray-700">
                    {faq.answer}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Status: {faq.status}
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpen(faq)} color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => confirmDeleteFAQ(faq)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Update FAQ" : "Add New FAQ"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            name="question"
            label="Question"
            value={formData.question}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="answer"
            label="Answer"
            value={formData.answer}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="dense"
          />
          <TextField
            name="status"
            label="Status"
            select
            value={formData.status}
            onChange={handleChange}
            fullWidth
            margin="dense"
          >
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Are you sure you want to delete this FAQ?
          </Alert>
          <Typography className="mt-2">
            <strong>Question:</strong> {faqToDelete?.question}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmed}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminFAQSection;
