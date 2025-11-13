import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthAdminStore from "../../store/AuthAdminStore";
import PermissionsCheckboxGroup from "./PermissionsCheckboxGroup.jsx";

const EditAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthAdminStore();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const fetchAdmin = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Set password to empty so it's not shown in the input
      const adminData = { ...res.data.admin, password: "" };

      setAdmin(adminData);
      setSelectedPermissions(res.data.admin.permissions || []);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to fetch admin data",
      });
    } finally {
      setLoading(false);
    }
  };
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setUpdating(true);
    try {
      const payload = {
        name: admin.name,
        email: admin.email,
        mobileNo: admin.mobileNo,
        permissions: selectedPermissions,
      };

      if (admin.password.trim()) {
        payload.password = admin.password;
      }

      await axios.put(`${apiUrl}/admin/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({
        open: true,
        severity: "success",
        message: "Admin updated successfully",
      });

      setTimeout(() => navigate("/admin/adminlist"), 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: error.response?.data?.message || "Failed to update admin",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={"p-4 shadow rounded-lg"}>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Edit Admin
      </h1>
      <div className={"grid grid-cols-2 gap-4"}>
        <TextField
          label="Name"
          name="name"
          value={admin.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={admin.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mobile No"
          name="mobileNo"
          value={admin.mobileNo || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="New Password (optional)"
          name="password"
          type="password"
          value={admin.password || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </div>

      <PermissionsCheckboxGroup
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
      />
      <div className={"flex items-center justify-center"}>
        <button
          onClick={handleSubmit}
          disabled={updating}
          className={"primaryBgColor accentTextColor px-4 py-2 rounded-md mt-4 w-44 cursor-pointer"}
        >
          {updating ? "Updating..." : "Update"}
        </button>
      </div>




      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div >
  );
};

export default EditAdmin;
