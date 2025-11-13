import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { create } from "zustand";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  TextField,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import useAuthAdminStore from "../../store/AuthAdminStore";
import { useNavigate } from "react-router-dom";

// Zustand store
const useCategoryStore = create((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((cat) => cat._id !== id),
    })),
}));

const CategoryManager = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { categories, setCategories, deleteCategory } = useCategoryStore();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { token } = useAuthAdminStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiUrl}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCategories(res.data.categories);
        setLoading(false);
      })
      .catch((err) => {
        setSnackbarMessage("Error fetching categories. Please try again.");
        setOpenSnackbar(true);
        setLoading(false);
        console.error("Error fetching categories:", err);
      });
  }, [setCategories, apiUrl, token]);

  // Handle Delete
  const handleDelete = (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this category? This action cannot be undone.",
    );

    if (confirmation) {
      axios
        .delete(`${apiUrl}/category/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          deleteCategory(id);
          setSnackbarMessage("Category deleted successfully!");
          setOpenSnackbar(true);
        })
        .catch((err) => {
          setSnackbarMessage("Error deleting category. Please try again.");
          setOpenSnackbar(true);
          console.error("Error deleting category:", err);
        });
    }
  };

  // Handle Search with useMemo
  const filteredCategories = useMemo(() => {
    return categories
      .filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .reverse();
  }, [categories, searchTerm]);

  // Handle Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={"shadow rounded-xl p-4"}>
      <div className={"flex justify-between items-center mb-6"}>
        <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
          Category List
        </h1>

        {/* Search Field */}
        <TextField
          label="Search Category"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            "& .MuiInputBase-root": {
              padding: "2px",
              height: "50px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderWidth: 1,
            },
          }}
        />
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Category Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Featured</b>
                  </TableCell>
                  <TableCell>
                    <b>Show on Navbar</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>No categories found.</TableCell>
                  </TableRow>
                ) : (
                  filteredCategories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category) => (
                      <TableRow key={category._id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>
                          {category.featureCategory ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          {category.showOnNavbar ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              navigate(`/admin/edit-category/${category._id}`)
                            }
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(category._id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCategories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </div>
  );
};

export default CategoryManager;
