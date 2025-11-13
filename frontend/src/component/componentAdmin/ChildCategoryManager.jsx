import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useChildCategoryStore from "../../store/useChildCategoryStore.js";
import Skeleton from "react-loading-skeleton";

const ChildCategoryManager = () => {
  const navigate = useNavigate();
  const {
    childCategories,
    loading,
    fetchChildCategories,
    deleteChildCategory,
  } = useChildCategoryStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchChildCategories();
  }, [fetchChildCategories]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteChildCategory(id);
      setSnackbarMessage("Category deleted successfully!");
      setOpenSnackbar(true);
    }
  };

  const filteredCategories = childCategories.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase() || "")
  );

  return (
    <div className="shadow rounded-xl p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
          Child Category List
        </h1>
        <TextField
          label="Search Category"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div>
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
        </div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Active</b>
                  </TableCell>
                  <TableCell>
                    <b>Category</b>
                  </TableCell>
                  <TableCell>
                    <b>Sub Category</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((category) => (
                    <TableRow key={category._id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.isActive ? "Yes" : "No"}</TableCell>
                      <TableCell>{category.category?.name || "N/A"}</TableCell>
                      <TableCell>{category.subCategory?.name || "N/A"}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            navigate(
                              `/admin/edit-child-category/${category._id}`,
                            )
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
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCategories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) =>
              setRowsPerPage(parseInt(event.target.value, 10))
            }
          />
        </>
      )}
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

export default ChildCategoryManager;
