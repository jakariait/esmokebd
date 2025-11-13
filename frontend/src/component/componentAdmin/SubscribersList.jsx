import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material"; // Import MUI Snackbar and Alert components
import useNewsletterStore from "../../store/useNewsletterStore.js"; // Import your Zustand store
import DataTable from "react-data-table-component";
import { FaTrash } from "react-icons/fa";
import { CSVLink } from "react-csv";

export default function SubscribersList() {
  const { subscribers, fetchSubscribers, deleteSubscriber, isLoading, error } =
    useNewsletterStore(); // Use Zustand store

  const [search, setSearch] = useState("");
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch subscribers on component mount
  useEffect(() => {
    fetchSubscribers(); // Fetch data when component is mounted
  }, [fetchSubscribers]);

  // Filter subscribers based on search input
  useEffect(() => {
    setFilteredSubscribers(
      subscribers.filter((sub) =>
        (sub.email || sub.Email || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    );
  }, [search, subscribers]);

  const handleDelete = async (row) => {
    const email = row.email || row.Email;
    if (!window.confirm("Are you sure you want to delete this subscriber?")) {
      return;
    }

    // Perform deletion
    await deleteSubscriber(email); // Delete subscriber

    // Check if there's an error in the store
    if (!error) {
      // If no error occurred, show success message
      setSnackbarMessage("Subscriber deleted successfully!");
      setSnackbarSeverity("success");

      // Refetch subscribers to ensure we have the updated list
      fetchSubscribers();
    } else {
      // If there was an error, show failure message
      setSnackbarMessage("Failed to delete subscriber!");
      setSnackbarSeverity("error");
    }

    setOpenSnackbar(true); // Show the snackbar message
  };

  const columns = [
    {
      name: "SL",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: "Email",
      selector: (row) => row.email || row.Email,
      sortable: true,
    },
    {
      name: "Subscribed On",
      selector: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
      sortable: true,
    },
    {
      name: "Action",
      width: "70px",
      cell: (row) => (
        <button onClick={() => handleDelete(row)} className="text-red-600">
          <FaTrash />
        </button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Subscribed Users List
      </h1>

      {/* Search & CSV Download */}
      <div className="flex justify-between items-center mt-3">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded-md w-1/3"
          onChange={(e) => setSearch(e.target.value)}
        />
        <CSVLink
          data={filteredSubscribers.map((sub) => ({
            Email: sub.email || sub.Email,
          }))}
          headers={[{ label: "Email", key: "Email" }]}
          filename={"subscribers.csv"}
          className="primaryBgColor accentTextColor px-4 py-2 rounded-md"
        >
          Download As Excel
        </CSVLink>
      </div>

      {/* Display errors if any */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredSubscribers}
        pagination
        responsive
        className="mt-4"
        progressPending={isLoading}
      />

      {/* MUI Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Snackbar will close after 3 seconds
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position at top right
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
