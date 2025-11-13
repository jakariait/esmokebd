import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";
import { BsArrowsCollapse } from "react-icons/bs";
import axios from "axios";
import useAuthAdminStore from "../../store/AuthAdminStore";
import ImageComponent from "../componentGeneral/ImageComponent.jsx";

import { saveAs } from "file-saver";
import RequirePermission from "./RequirePermission.jsx";
import ExcelJS from "exceljs";


const CustomerList = () => {
  const { token } = useAuthAdminStore();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" for ascending, "desc" for descending

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/getAllUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(res.data.users);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to fetch customers",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    // Filter customers based on search input
    const filtered = customers.filter(
      (cus) =>
        cus.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        cus.email?.toLowerCase().includes(search.toLowerCase()),
    );

    // Sort customers based on createdAt and the selected sort order
    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredCustomers(sorted);
  }, [search, customers, sortOrder]);

  const handleOpenDialog = (id) => {
    setSelectedCustomerId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCustomerId(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/deleteUser/${selectedCustomerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbar({
        open: true,
        message: "Customer deleted successfully",
        type: "success",
      });
      fetchCustomers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to delete customer",
        type: "error",
      });
    } finally {
      handleCloseDialog();
    }
  };

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Customers");

    worksheet.columns = [
      { header: "SL No", key: "sl", width: 8 },
      { header: "Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Joined Date", key: "joined", width: 15 },
      { header: "Deletion Requested", key: "deletion", width: 18 },
      { header: "Requested At", key: "requestedAt", width: 25 },
    ];

    filteredCustomers.forEach((cus, index) => {
      worksheet.addRow({
        sl: index + 1,
        name: cus.fullName || "N/A",
        email: cus.email || "N/A",
        phone: cus.phone || "N/A",
        joined: cus.createdAt
          ? new Date(cus.createdAt).toLocaleDateString()
          : "N/A",
        deletion: cus.accountDeletion?.requested ? "Yes" : "No",
        requestedAt: cus.accountDeletion?.requestedAt
          ? new Date(cus.accountDeletion.requestedAt).toLocaleString()
          : "N/A",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "customers.xlsx");
  };

  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * limit,
    page * limit,
  );

  const totalPages = Math.ceil(filteredCustomers.length / limit);

  return (
    <div className="p-4 shadow rounded-lg">
      <div className={"flex  items-center justify-between"}>
        <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
          Customer List
        </h1>
        <button
          className={
            "primaryBgColor accentTextColor cursor-pointer px-4 py-2 rounded-lg"
          }
          onClick={handleExportExcel}
        >
          Download As Excel
        </button>
      </div>

      <div className="flex justify-between items-center py-4 flex-wrap gap-4">
        <TextField
          label="Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-96"
        />
        <div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Typography>Show</Typography>
              <div className="relative">
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm appearance-none pr-8 bg-white focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <BsArrowsCollapse className="absolute right-2 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <Typography>entries</Typography>
            </div>

            <div className="flex items-center gap-2 relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm appearance-none pr-8 bg-white focus:outline-none"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
              <BsArrowsCollapse className="absolute right-2 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SL No.</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Reward Points</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Account Deletion</TableCell>
              <RequirePermission permission="delete_customers" fallback={true}>
                <TableCell>Action</TableCell>
              </RequirePermission>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: limit }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" height={30} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : paginatedCustomers.map((cus, index) => (
                  <TableRow key={cus._id}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>
                      {cus.userImage ? (
                        <ImageComponent
                          imageName={cus.userImage}
                          altName={cus.fullName}
                          skeletonHeight={"40"}
                          className={"w-20 object-cover"}
                        />
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{cus.fullName || "N/A"}</TableCell>
                    <TableCell>{cus.email || "N/A"}</TableCell>
                    <TableCell>{cus.phone || "N/A"}</TableCell>
                    <TableCell>{cus.address || "N/A"}</TableCell>
                    <TableCell>{cus.rewardPoints}</TableCell>
                    <TableCell>
                      {cus.createdAt
                        ? new Date(cus.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {cus.accountDeletion?.requested ? (
                        <span className="text-red-600 font-medium">
                          Requested at{" "}
                          {new Date(
                            cus.accountDeletion.requestedAt,
                          ).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </TableCell>
                    <RequirePermission
                      permission="delete_customers"
                      fallback={true}
                    >
                      <TableCell>
                        <MdDeleteOutline
                          className="text-red-600 cursor-pointer text-2xl"
                          onClick={() => handleOpenDialog(cus._id)}
                        />
                      </TableCell>
                    </RequirePermission>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && (
        <div className="flex justify-center items-center my-4">
          <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </Button>
          <Typography mx={2}>
            Page {page} of {totalPages}
          </Typography>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CustomerList;
