import React, { useState } from "react";
import { TextField, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import PermissionsCheckboxGroup from "../../component/componentAdmin/PermissionsCheckboxGroup.jsx";

const AdminCreate = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();


  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    password: "",
  });
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${apiUrl}/admin/create`,
        { ...formData, permissions: selectedPermissions },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSnackbar({
        open: true,
        message: "Admin created successfully",
        severity: "success",
      });
      // Delay navigation by 2 seconds
      setTimeout(() => {
        navigate("/admin/adminlist");
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to create admin",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"p-4 shadow rounded-lg"}>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Create New Admin
      </h1>

      <div className="flex gap-4">
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </div>
      <div className={"flex gap-4"}>
        <TextField
          label="Mobile No"
          name="mobileNo"
          value={formData.mobileNo}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </div>

      <PermissionsCheckboxGroup
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
      />
      <div className={"flex justify-center mt-4"}>
        <button
          className={
            "primaryBgColor accentTextColor px-4 py-2 rounded-md cursor-pointer "
          }
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // 👈 this positions it
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminCreate;
