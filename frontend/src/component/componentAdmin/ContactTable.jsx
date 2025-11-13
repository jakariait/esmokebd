import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  CircularProgress,
} from "@mui/material";
import useAuthAdminStore from "../../store/AuthAdminStore.js";

const columns = [
  { id: "serialNumber", label: "S.No.", minWidth: 50, align: "center" },
  { id: "fullName", label: "Name", minWidth: 100 },
  { id: "phoneNumber", label: "Phone Number", minWidth: 100 },
  { id: "emailAddress", label: "Email Address", minWidth: 100 },
  { id: "message", label: "Message", minWidth: 270 },
  { id: "served", label: "Status", minWidth: 100, align: "center" },
  { id: "actions", label: "Actions", minWidth: 100, align: "center" },
];

const ContactTable = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${apiUrl}/contacts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch contacts");

        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setContacts(sortedData);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [apiUrl, token]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (!token) return console.log("Unauthorized request");

    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        const response = await fetch(`${apiUrl}/contacts/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to delete contact");

        setContacts((prev) => prev.filter((contact) => contact._id !== id));
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleToggleServed = async (id) => {
    if (!token) return alert("Unauthorized request");

    const contact = contacts.find((c) => c._id === id);
    if (!contact) return;

    const updatedContact = { ...contact, served: !contact.served };

    try {
      const response = await fetch(`${apiUrl}/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedContact),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setContacts((prev) =>
        prev.map((c) => (c._id === id ? updatedContact : c))
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 4 }}>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Contact Request
      </h1>
      {loading ? (
        <div className="flex justify-center p-4">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer>
            <Table aria-label="contact table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.length > 0 ? (
                  contacts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((contact, index) => (
                      <TableRow key={contact._id} hover>
                        {columns.map((column) => {
                          const value =
                            column.id === "serialNumber"
                              ? page * rowsPerPage + index + 1
                              : contact[column.id];

                          if (column.id === "served") {
                            return (
                              <TableCell key={column.id} align="center">
                                <Button
                                  variant="contained"
                                  color={value ? "success" : "error"}
                                  onClick={() => handleToggleServed(contact._id)}
                                >
                                  {value ? "Served" : "Pending"}
                                </Button>
                              </TableCell>
                            );
                          }

                          if (column.id === "actions") {
                            return (
                              <TableCell key={column.id} align="center">
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleDelete(contact._id)}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            );
                          }

                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No contacts available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 30, 50, 100]}
            component="div"
            count={contacts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
};

export default ContactTable;