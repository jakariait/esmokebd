import React, { useEffect, useState, useMemo } from "react";
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
import { useNavigate } from "react-router-dom";
import useSubCategoryStore from "../../store/useSubCategoryStore.js";

const SubCategoryManager = () => {
  const navigate = useNavigate();
  const {
    subCategories,
    fetchSubCategories,
    deleteSubCategory,
    loading,
    error,
  } = useSubCategoryStore();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch subcategories on mount
  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  // Handle Delete
  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this subcategory? This action cannot be undone.",
    );

    if (confirmation) {
      await deleteSubCategory(id);
      setSnackbarMessage("Subcategory deleted successfully!");
      setOpenSnackbar(true);
    }
  };

  // Handle Search with useMemo
  const filteredSubCategories = useMemo(() => {
    return subCategories
      .filter(
        (subCategory) =>
          subCategory.name &&
          subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .reverse();
  }, [subCategories, searchTerm]);

  // Handle Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={"shadow rounded-lg p-4"}>
      <div className={"flex justify-between items-center mb-6"}>
        <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
          Subcategory List
        </h1>

        {/* Search Field */}
        <TextField
          label="Search Subcategory"
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
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Subcategory Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Category</b>
                  </TableCell>
                  <TableCell>
                    <b>Active</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>No subcategories found.</TableCell>
                  </TableRow>
                ) : (
                  filteredSubCategories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((subCategory) => (
                      <TableRow key={subCategory._id}>
                        <TableCell>{subCategory.name || "N/A"}</TableCell>
                        <TableCell>
                          {subCategory.category?.name || "N/A"}
                        </TableCell>
                        <TableCell>
                          {subCategory.isActive ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              navigate(
                                `/admin/edit-subcategory/${subCategory._id}`,
                              )
                            }
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(subCategory._id)}
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
            count={filteredSubCategories.length}
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

export default SubCategoryManager;
