// // // import React, { useState } from "react";
// // // import {
// // //   TextField,
// // //   Pagination,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TableRow,
// // //   Paper,
// // //   Typography,
// // //   Select,
// // //   MenuItem,
// // //   InputLabel,
// // //   FormControl,
// // //   TableSortLabel,
// // //   Dialog,
// // //   DialogTitle,
// // //   DialogContent,
// // //   DialogContentText,
// // //   DialogActions,
// // //   Button,
// // //   Chip,
// // // } from "@mui/material";
// // // import { Skeleton } from "@mui/material";
// // // import VisibilityIcon from "@mui/icons-material/Visibility";
// // // import { Box } from "@mui/material";
// // // import { IconButton } from "@mui/material";
// // // import DeleteIcon from "@mui/icons-material/Delete";
// // // import { Tooltip } from "@mui/material";
// // // import axios from "axios";
// // // import { Snackbar, Alert } from "@mui/material";
// // // import { useNavigate } from "react-router-dom";
// // // import useOrderStore from "../../store/useOrderStore.js";
// // // import OrderStatusSelector from "./OrderStatusSelector.jsx";
// // // import SendToCourierButton from "./SendToCourierButton.jsx";
// // // import CourierSummary from "../componentAdmin/CourierSummery.jsx";
// // // import RequirePermission from "./RequirePermission.jsx";
// // //
// // // const AllOrders = ({ allOrders, orderListLoading, orderListError, title }) => {
// // //   const {
// // //     fetchAllOrders,
// // //     totalOrders,
// // //     totalPages,
// // //     currentPage,
// // //     itemsPerPage,
// // //     setCurrentPage,
// // //     setItemsPerPage,
// // //   } = useOrderStore();
// // //
// // //   // Local state for search and sorting
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [sortDirection, setSortDirection] = useState("desc");
// // //   const [orderBy, setOrderBy] = useState("orderNo");
// // //   const [openDialog, setOpenDialog] = useState(false);
// // //   const [deleteId, setDeleteId] = useState(null);
// // //   const apiUrl = import.meta.env.VITE_API_URL;
// // //   const [snackbarMessage, setSnackbarMessage] = useState("");
// // //   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
// // //   const [openSnackbar, setOpenSnackbar] = useState(false);
// // //   const navigate = useNavigate();
// // //   const token = localStorage.getItem("token");
// // //
// // //   const handleOpenDialog = (id) => {
// // //     setDeleteId(id);
// // //     setOpenDialog(true);
// // //   };
// // //
// // //   const handleCloseDialog = () => {
// // //     setOpenDialog(false);
// // //     setDeleteId(null);
// // //   };
// // //
// // //   const handleSearchChange = (event) => {
// // //     setSearchTerm(event.target.value);
// // //   };
// // //
// // //   const handlePageChange = (event, value) => {
// // //     setCurrentPage(value);
// // //   };
// // //
// // //   const handleItemsPerPageChange = (event) => {
// // //     const newLimit = event.target.value;
// // //     setItemsPerPage(newLimit);
// // //   };
// // //
// // //   const handleSortRequest = (property) => {
// // //     const isAsc = orderBy === property && sortDirection === "asc";
// // //     setSortDirection(isAsc ? "desc" : "asc");
// // //     setOrderBy(property);
// // //   };
// // //
// // //   const sortData = (data) => {
// // //     return data.sort((a, b) => {
// // //       if (orderBy === "orderNo") {
// // //         return compare(a.orderNo, b.orderNo);
// // //       }
// // //       if (orderBy === "orderDate") {
// // //         return compare(new Date(a.orderDate), new Date(b.orderDate));
// // //       }
// // //       if (orderBy === "totalAmount") {
// // //         return compare(a.totalAmount, b.totalAmount);
// // //       }
// // //       if (orderBy === "shippingInfo.fullName") {
// // //         return compare(a.shippingInfo.fullName, b.shippingInfo.fullName);
// // //       }
// // //       if (orderBy === "shippingInfo.mobileNo") {
// // //         return compare(a.shippingInfo.mobileNo, b.shippingInfo.mobileNo);
// // //       }
// // //       if (orderBy === "orderStatus") {
// // //         return compare(a.orderStatus, b.orderStatus);
// // //       }
// // //       if (orderBy === "paymentStatus") {
// // //         return compare(a.paymentStatus, b.paymentStatus);
// // //       }
// // //       return 0;
// // //     });
// // //   };
// // //
// // //   const compare = (a, b) => {
// // //     if (a < b) return sortDirection === "asc" ? -1 : 1;
// // //     if (a > b) return sortDirection === "asc" ? 1 : -1;
// // //     return 0;
// // //   };
// // //
// // //   // Filter orders based on the search term
// // //   const filteredOrders = allOrders.filter(
// // //     (order) =>
// // //       order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       order.shippingInfo.fullName
// // //         .toLowerCase()
// // //         .includes(searchTerm.toLowerCase()) ||
// // //       order.shippingInfo.mobileNo.includes(searchTerm),
// // //   );
// // //
// // //   // Sorting the filtered orders
// // //   const sortedOrders = sortData(filteredOrders);
// // //
// // //   // Calculate the range for "Showing X to Y of Z entries"
// // //   const startEntry = (currentPage - 1) * itemsPerPage + 1;
// // //   const endEntry = Math.min(currentPage * itemsPerPage, totalOrders);
// // //
// // //   const handleView = (orderId) => {
// // //     navigate(`/admin/orders/${orderId}`);
// // //   };
// // //
// // //   const handleConfirmDelete = async () => {
// // //     try {
// // //       const response = await axios.delete(`${apiUrl}/orders/${deleteId}`, {
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });
// // //
// // //       if (response.data.success) {
// // //         setSnackbarMessage("Order deleted successfully");
// // //         setSnackbarSeverity("success");
// // //         setOpenSnackbar(true);
// // //         fetchAllOrders("", currentPage, itemsPerPage);
// // //       } else {
// // //         setSnackbarMessage(response.data.message || "Failed to delete order");
// // //         setSnackbarSeverity("error");
// // //         setOpenSnackbar(true);
// // //       }
// // //     } catch (error) {
// // //       setSnackbarMessage(
// // //         error.response?.data?.message || "Error deleting order",
// // //       );
// // //       setSnackbarSeverity("error");
// // //       setOpenSnackbar(true);
// // //     }
// // //     handleCloseDialog();
// // //   };
// // //
// // //   const handleSuccess = () => {
// // //     fetchAllOrders(); // Refetch orders on success
// // //   };
// // //
// // //   return (
// // //     <div className="p-4 shadow rounded-lg">
// // //       <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
// // //         {title}
// // //       </h1>
// // //       <div
// // //         className={
// // //           "grid grid-cols-2 gap-4 shadow rounded-lg p-4 items-center mt-6 mb-6"
// // //         }
// // //       >
// // //         {/* Search bar */}
// // //         <TextField
// // //           label="Search.."
// // //           variant="outlined"
// // //           onChange={handleSearchChange}
// // //           value={searchTerm}
// // //         />
// // //
// // //         {/* Items per page selector */}
// // //         <FormControl>
// // //           <InputLabel>Items per Page</InputLabel>
// // //           <Select
// // //             value={itemsPerPage}
// // //             onChange={handleItemsPerPageChange}
// // //             label="Items per Page"
// // //           >
// // //             <MenuItem value={5}>5</MenuItem>
// // //             <MenuItem value={10}>10</MenuItem>
// // //             <MenuItem value={25}>25</MenuItem>
// // //             <MenuItem value={50}>50</MenuItem>
// // //             <MenuItem value={100}>100</MenuItem>
// // //           </Select>
// // //         </FormControl>
// // //       </div>
// // //
// // //       {/* Loading and error states */}
// // //       {orderListLoading && (
// // //         <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
// // //           <Table>
// // //             <TableHead>
// // //               <TableRow>
// // //                 {[
// // //                   "Order No",
// // //                   "Order Date & Time",
// // //                   "Customer",
// // //                   "Mobile No",
// // //                   "Status",
// // //                   "Payment Status",
// // //                   "Total Amount",
// // //                 ].map((header, i) => (
// // //                   <TableCell key={i}>
// // //                     <Skeleton
// // //                       variant="text"
// // //                       width={120}
// // //                       height={30}
// // //                       align="center"
// // //                     />
// // //                   </TableCell>
// // //                 ))}
// // //               </TableRow>
// // //             </TableHead>
// // //             <TableBody>
// // //               {[...Array(itemsPerPage)].map((_, index) => (
// // //                 <TableRow key={index}>
// // //                   {Array(7)
// // //                     .fill()
// // //                     .map((_, cellIndex) => (
// // //                       <TableCell key={cellIndex}>
// // //                         <Skeleton variant="text" width="100%" height={20} />
// // //                       </TableCell>
// // //                     ))}
// // //                 </TableRow>
// // //               ))}
// // //             </TableBody>
// // //           </Table>
// // //         </TableContainer>
// // //       )}
// // //
// // //       {orderListError && (
// // //         <Typography color="error">{orderListError}</Typography>
// // //       )}
// // //
// // //       {!orderListLoading && !orderListError && (
// // //         <>
// // //           <TableContainer component={Paper}>
// // //             <Table>
// // //               <TableHead>
// // //                 <TableRow>
// // //                   <TableCell>
// // //                     <TableSortLabel
// // //                       active={orderBy === "orderNo"}
// // //                       direction={orderBy === "orderNo" ? sortDirection : "asc"}
// // //                       onClick={() => handleSortRequest("orderNo")}
// // //                     >
// // //                       Order No
// // //                     </TableSortLabel>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <TableSortLabel
// // //                       active={orderBy === "orderDate"}
// // //                       direction={
// // //                         orderBy === "orderDate" ? sortDirection : "asc"
// // //                       }
// // //                       onClick={() => handleSortRequest("orderDate")}
// // //                     >
// // //                       Order Date & Time
// // //                     </TableSortLabel>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <TableSortLabel
// // //                       active={orderBy === "shippingInfo.fullName"}
// // //                       direction={
// // //                         orderBy === "shippingInfo.fullName"
// // //                           ? sortDirection
// // //                           : "asc"
// // //                       }
// // //                       onClick={() => handleSortRequest("shippingInfo.fullName")}
// // //                     >
// // //                       Customer
// // //                     </TableSortLabel>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <TableSortLabel
// // //                       active={orderBy === "shippingInfo.mobileNo"}
// // //                       direction={
// // //                         orderBy === "shippingInfo.mobileNo"
// // //                           ? sortDirection
// // //                           : "asc"
// // //                       }
// // //                       onClick={() => handleSortRequest("shippingInfo.mobileNo")}
// // //                     >
// // //                       Mobile No
// // //                     </TableSortLabel>
// // //                   </TableCell>
// // //                   <TableCell>Courier</TableCell>
// // //                   <TableCell>Courier Status</TableCell>
// // //
// // //                   <TableCell>
// // //                     <TableSortLabel
// // //                       active={orderBy === "orderStatus"}
// // //                       direction={
// // //                         orderBy === "orderStatus" ? sortDirection : "asc"
// // //                       }
// // //                       onClick={() => handleSortRequest("orderStatus")}
// // //                     >
// // //                       Status
// // //                     </TableSortLabel>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <TableSortLabel
// // //                       active={orderBy === "paymentStatus"}
// // //                       direction={
// // //                         orderBy === "paymentStatus" ? sortDirection : "asc"
// // //                       }
// // //                       onClick={() => handleSortRequest("paymentStatus")}
// // //                     >
// // //                       Payment Status
// // //                     </TableSortLabel>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <TableSortLabel
// // //                       active={orderBy === "totalAmount"}
// // //                       direction={
// // //                         orderBy === "totalAmount" ? sortDirection : "asc"
// // //                       }
// // //                       onClick={() => handleSortRequest("totalAmount")}
// // //                     >
// // //                       Total Amount
// // //                     </TableSortLabel>
// // //                   </TableCell>
// // //                   <TableCell>Actions</TableCell>
// // //                 </TableRow>
// // //               </TableHead>
// // //               <TableBody>
// // //                 {sortedOrders.map((order) => (
// // //                   <TableRow key={order._id} hover>
// // //                     <TableCell>{order.orderNo}</TableCell>
// // //                     <TableCell>
// // //                       {new Date(order.createdAt).toLocaleString()}
// // //                     </TableCell>
// // //                     <TableCell>{order.shippingInfo.fullName}</TableCell>
// // //                     <TableCell>{order.shippingInfo.mobileNo}</TableCell>
// // //                     <TableCell>
// // //                       <Box
// // //                         sx={{
// // //                           display: "flex",
// // //                           flexDirection: "column",
// // //                           gap: 1,
// // //                         }}
// // //                       >
// // //                         <SendToCourierButton
// // //                           orderData={{
// // //                             invoice: order.orderNo,
// // //                             recipient_name: order.shippingInfo?.fullName,
// // //                             recipient_phone: order.shippingInfo?.mobileNo,
// // //                             recipient_address: order.shippingInfo?.address,
// // //                             cod_amount: order.dueAmount,
// // //                             note: order.note || "", // optional fallback
// // //                             order_id: order._id,
// // //                             courier_status: order.sentToCourier,
// // //                           }}
// // //                           onSuccess={handleSuccess}
// // //                         />
// // //                       </Box>
// // //                     </TableCell>
// // //                     <TableCell>
// // //                       <CourierSummary phone={order.shippingInfo?.mobileNo} />
// // //                     </TableCell>
// // //                     <TableCell>
// // //                       <OrderStatusSelector
// // //                         orderId={order._id}
// // //                         refetchOrders={() =>
// // //                           fetchAllOrders("", currentPage, itemsPerPage)
// // //                         }
// // //                       />
// // //                     </TableCell>
// // //                     <TableCell>
// // //                       <Chip
// // //                         label={
// // //                           order.paymentStatus.charAt(0).toUpperCase() +
// // //                           order.paymentStatus.slice(1)
// // //                         }
// // //                         color={
// // //                           order.paymentStatus === "paid" ? "success" : "error"
// // //                         }
// // //                         variant="filled"
// // //                         sx={{
// // //                           fontWeight: "bold",
// // //                           minWidth: "100px",
// // //                           height: "32px",
// // //                           borderRadius: "4px",
// // //                           backgroundColor:
// // //                             order.paymentStatus === "paid"
// // //                               ? "#4caf50"
// // //                               : "#f44336",
// // //                           color: "#ffffff",
// // //                           "&:hover": {
// // //                             backgroundColor:
// // //                               order.paymentStatus === "paid"
// // //                                 ? "#388e3c"
// // //                                 : "#d32f2f",
// // //                           },
// // //                           "& .MuiChip-label": {
// // //                             textTransform: "capitalize",
// // //                             fontSize: "0.875rem",
// // //                           },
// // //                         }}
// // //                       />
// // //                     </TableCell>
// // //                     <TableCell>Tk. {order.totalAmount?.toFixed(2)}</TableCell>
// // //                     <TableCell>
// // //                       <Box sx={{ display: "flex", gap: 1 }}>
// // //                         <Tooltip title="View">
// // //                           <IconButton
// // //                             onClick={() => handleView(order._id)}
// // //                             color="primary"
// // //                           >
// // //                             <VisibilityIcon />
// // //                           </IconButton>
// // //                         </Tooltip>
// // //                         <RequirePermission
// // //                           permission="delete_orders"
// // //                           fallback={true}
// // //                         >
// // //                           <Tooltip title="Delete">
// // //                             <IconButton
// // //                               onClick={() => handleOpenDialog(order._id)}
// // //                               color="error"
// // //                             >
// // //                               <DeleteIcon />
// // //                             </IconButton>
// // //                           </Tooltip>
// // //                         </RequirePermission>
// // //                       </Box>
// // //                     </TableCell>
// // //                   </TableRow>
// // //                 ))}
// // //               </TableBody>
// // //             </Table>
// // //           </TableContainer>
// // //
// // //           {/* Pagination */}
// // //           <Box
// // //             sx={{
// // //               display: "flex",
// // //               justifyContent: "space-between",
// // //               alignItems: "center",
// // //               mt: 2,
// // //             }}
// // //           >
// // //             <Typography>
// // //               Showing {startEntry} to {endEntry} of {totalOrders} entries
// // //             </Typography>
// // //             <Pagination
// // //               count={totalPages}
// // //               page={currentPage}
// // //               onChange={handlePageChange}
// // //               color="primary"
// // //             />
// // //           </Box>
// // //         </>
// // //       )}
// // //
// // //       {/* Delete Confirmation Dialog */}
// // //       <Dialog open={openDialog} onClose={handleCloseDialog}>
// // //         <DialogTitle>Confirm Delete</DialogTitle>
// // //         <DialogContent>
// // //           <DialogContentText>
// // //             Are you sure you want to delete this order? This action cannot be
// // //             undone.
// // //           </DialogContentText>
// // //         </DialogContent>
// // //         <DialogActions>
// // //           <Button onClick={handleCloseDialog}>Cancel</Button>
// // //           <Button onClick={handleConfirmDelete} color="error">
// // //             Delete
// // //           </Button>
// // //         </DialogActions>
// // //       </Dialog>
// // //
// // //       {/* Snackbar for notifications */}
// // //       <Snackbar
// // //         open={openSnackbar}
// // //         autoHideDuration={3000}
// // //         onClose={() => setOpenSnackbar(false)}
// // //         anchorOrigin={{ vertical: "top", horizontal: "right" }}
// // //       >
// // //         <Alert
// // //           onClose={() => setOpenSnackbar(false)}
// // //           severity={snackbarSeverity}
// // //           sx={{ width: "100%" }}
// // //         >
// // //           {snackbarMessage}
// // //         </Alert>
// // //       </Snackbar>
// // //     </div>
// // //   );
// // // };
// // //
// // // export default AllOrders;
// //
// // import React, { useState } from "react";
// // import {
// //   TextField,
// //   Pagination,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   Typography,
// //   Select,
// //   MenuItem,
// //   InputLabel,
// //   FormControl,
// //   TableSortLabel,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogContentText,
// //   DialogActions,
// //   Button,
// //   Chip,
// // } from "@mui/material";
// // import { Skeleton } from "@mui/material";
// // import VisibilityIcon from "@mui/icons-material/Visibility";
// // import { Box } from "@mui/material";
// // import { IconButton } from "@mui/material";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import { Tooltip } from "@mui/material";
// // import axios from "axios";
// // import { Snackbar, Alert } from "@mui/material";
// // import { useNavigate } from "react-router-dom";
// // import useOrderStore from "../../store/useOrderStore.js";
// // import OrderStatusSelector from "./OrderStatusSelector.jsx";
// // import SendToCourierButton from "./SendToCourierButton.jsx";
// // import CourierSummary from "../componentAdmin/CourierSummery.jsx";
// // import RequirePermission from "./RequirePermission.jsx";
// //
// // const AllOrders = ({ allOrders, orderListLoading, orderListError, title }) => {
// //   const {
// //     fetchAllOrders,
// //     totalOrders,
// //     totalPages,
// //     currentPage,
// //     itemsPerPage,
// //     setCurrentPage,
// //     setItemsPerPage,
// //   } = useOrderStore();
// //
// //   // Local state for sorting
// //   const [sortDirection, setSortDirection] = useState("desc");
// //   const [orderBy, setOrderBy] = useState("orderNo");
// //   const [openDialog, setOpenDialog] = useState(false);
// //   const [deleteId, setDeleteId] = useState(null);
// //   const apiUrl = import.meta.env.VITE_API_URL;
// //   const [snackbarMessage, setSnackbarMessage] = useState("");
// //   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
// //   const [openSnackbar, setOpenSnackbar] = useState(false);
// //   const navigate = useNavigate();
// //   const token = localStorage.getItem("token");
// //
// //   const handleOpenDialog = (id) => {
// //     setDeleteId(id);
// //     setOpenDialog(true);
// //   };
// //
// //   const handleCloseDialog = () => {
// //     setOpenDialog(false);
// //     setDeleteId(null);
// //   };
// //
// //   const handlePageChange = (event, value) => {
// //     setCurrentPage(value);
// //   };
// //
// //   const handleItemsPerPageChange = (event) => {
// //     const newLimit = event.target.value;
// //     setItemsPerPage(newLimit);
// //   };
// //
// //   const handleSortRequest = (property) => {
// //     const isAsc = orderBy === property && sortDirection === "asc";
// //     setSortDirection(isAsc ? "desc" : "asc");
// //     setOrderBy(property);
// //   };
// //
// //   const sortData = (data) => {
// //     return data.sort((a, b) => {
// //       if (orderBy === "orderNo") {
// //         return compare(a.orderNo, b.orderNo);
// //       }
// //       if (orderBy === "orderDate") {
// //         return compare(new Date(a.orderDate), new Date(b.orderDate));
// //       }
// //       if (orderBy === "totalAmount") {
// //         return compare(a.totalAmount, b.totalAmount);
// //       }
// //       if (orderBy === "shippingInfo.fullName") {
// //         return compare(a.shippingInfo.fullName, b.shippingInfo.fullName);
// //       }
// //       if (orderBy === "shippingInfo.mobileNo") {
// //         return compare(a.shippingInfo.mobileNo, b.shippingInfo.mobileNo);
// //       }
// //       if (orderBy === "orderStatus") {
// //         return compare(a.orderStatus, b.orderStatus);
// //       }
// //       if (orderBy === "paymentStatus") {
// //         return compare(a.paymentStatus, b.paymentStatus);
// //       }
// //       return 0;
// //     });
// //   };
// //
// //   const compare = (a, b) => {
// //     if (a < b) return sortDirection === "asc" ? -1 : 1;
// //     if (a > b) return sortDirection === "asc" ? 1 : -1;
// //     return 0;
// //   };
// //
// //   // Sorting the orders directly (no filtering)
// //   const sortedOrders = sortData(allOrders);
// //
// //   // Calculate the range for "Showing X to Y of Z entries"
// //   const startEntry = (currentPage - 1) * itemsPerPage + 1;
// //   const endEntry = Math.min(currentPage * itemsPerPage, totalOrders);
// //
// //   const handleView = (orderId) => {
// //     navigate(`/admin/orders/${orderId}`);
// //   };
// //
// //   const handleConfirmDelete = async () => {
// //     try {
// //       const response = await axios.delete(`${apiUrl}/orders/${deleteId}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //
// //       if (response.data.success) {
// //         setSnackbarMessage("Order deleted successfully");
// //         setSnackbarSeverity("success");
// //         setOpenSnackbar(true);
// //         fetchAllOrders("", currentPage, itemsPerPage);
// //       } else {
// //         setSnackbarMessage(response.data.message || "Failed to delete order");
// //         setSnackbarSeverity("error");
// //         setOpenSnackbar(true);
// //       }
// //     } catch (error) {
// //       setSnackbarMessage(
// //         error.response?.data?.message || "Error deleting order",
// //       );
// //       setSnackbarSeverity("error");
// //       setOpenSnackbar(true);
// //     }
// //     handleCloseDialog();
// //   };
// //
// //   const handleSuccess = () => {
// //     fetchAllOrders(); // Refetch orders on success
// //   };
// //
// //   return (
// //     <div className="p-4 shadow rounded-lg">
// //       <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
// //         {title}
// //       </h1>
// //       <div
// //         className={
// //           "grid grid-cols-1 gap-4 shadow rounded-lg p-4 items-center mt-6 mb-6"
// //         }
// //       >
// //         {/* Items per page selector */}
// //         <FormControl>
// //           <InputLabel>Items per Page</InputLabel>
// //           <Select
// //             value={itemsPerPage}
// //             onChange={handleItemsPerPageChange}
// //             label="Items per Page"
// //           >
// //             <MenuItem value={5}>5</MenuItem>
// //             <MenuItem value={10}>10</MenuItem>
// //             <MenuItem value={25}>25</MenuItem>
// //             <MenuItem value={50}>50</MenuItem>
// //             <MenuItem value={100}>100</MenuItem>
// //           </Select>
// //         </FormControl>
// //       </div>
// //
// //       {/* Loading and error states */}
// //       {orderListLoading && (
// //         <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 {[
// //                   "Order No",
// //                   "Order Date & Time",
// //                   "Customer",
// //                   "Mobile No",
// //                   "Status",
// //                   "Payment Status",
// //                   "Total Amount",
// //                 ].map((header, i) => (
// //                   <TableCell key={i}>
// //                     <Skeleton
// //                       variant="text"
// //                       width={120}
// //                       height={30}
// //                       align="center"
// //                     />
// //                   </TableCell>
// //                 ))}
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {[...Array(itemsPerPage)].map((_, index) => (
// //                 <TableRow key={index}>
// //                   {Array(7)
// //                     .fill()
// //                     .map((_, cellIndex) => (
// //                       <TableCell key={cellIndex}>
// //                         <Skeleton variant="text" width="100%" height={20} />
// //                       </TableCell>
// //                     ))}
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       )}
// //
// //       {orderListError && (
// //         <Typography color="error">{orderListError}</Typography>
// //       )}
// //
// //       {!orderListLoading && !orderListError && (
// //         <>
// //           <TableContainer component={Paper}>
// //             <Table>
// //               <TableHead>
// //                 <TableRow>
// //                   <TableCell>
// //                     <TableSortLabel
// //                       active={orderBy === "orderNo"}
// //                       direction={orderBy === "orderNo" ? sortDirection : "asc"}
// //                       onClick={() => handleSortRequest("orderNo")}
// //                     >
// //                       Order No
// //                     </TableSortLabel>
// //                   </TableCell>
// //                   <TableCell>
// //                     <TableSortLabel
// //                       active={orderBy === "orderDate"}
// //                       direction={
// //                         orderBy === "orderDate" ? sortDirection : "asc"
// //                       }
// //                       onClick={() => handleSortRequest("orderDate")}
// //                     >
// //                       Order Date & Time
// //                     </TableSortLabel>
// //                   </TableCell>
// //                   <TableCell>
// //                     <TableSortLabel
// //                       active={orderBy === "shippingInfo.fullName"}
// //                       direction={
// //                         orderBy === "shippingInfo.fullName"
// //                           ? sortDirection
// //                           : "asc"
// //                       }
// //                       onClick={() => handleSortRequest("shippingInfo.fullName")}
// //                     >
// //                       Customer
// //                     </TableSortLabel>
// //                   </TableCell>
// //                   <TableCell>
// //                     <TableSortLabel
// //                       active={orderBy === "shippingInfo.mobileNo"}
// //                       direction={
// //                         orderBy === "shippingInfo.mobileNo"
// //                           ? sortDirection
// //                           : "asc"
// //                       }
// //                       onClick={() => handleSortRequest("shippingInfo.mobileNo")}
// //                     >
// //                       Mobile No
// //                     </TableSortLabel>
// //                   </TableCell>
// //                   <TableCell>Courier</TableCell>
// //                   <TableCell>Courier Status</TableCell>
// //
// //                   <TableCell>
// //                     <TableSortLabel
// //                       active={orderBy === "orderStatus"}
// //                       direction={
// //                         orderBy === "orderStatus" ? sortDirection : "asc"
// //                       }
// //                       onClick={() => handleSortRequest("orderStatus")}
// //                     >
// //                       Status
// //                     </TableSortLabel>
// //                   </TableCell>
// //                   <TableCell>
// //                     <TableSortLabel
// //                       active={orderBy === "paymentStatus"}
// //                       direction={
// //                         orderBy === "paymentStatus" ? sortDirection : "asc"
// //                       }
// //                       onClick={() => handleSortRequest("paymentStatus")}
// //                     >
// //                       Payment Status
// //                     </TableSortLabel>
// //                   </TableCell>
// //                   <TableCell>
// //                     <TableSortLabel
// //                       active={orderBy === "totalAmount"}
// //                       direction={
// //                         orderBy === "totalAmount" ? sortDirection : "asc"
// //                       }
// //                       onClick={() => handleSortRequest("totalAmount")}
// //                     >
// //                       Total Amount
// //                     </TableSortLabel>
// //                   </TableCell>
// //                   <TableCell>Actions</TableCell>
// //                 </TableRow>
// //               </TableHead>
// //               <TableBody>
// //                 {sortedOrders.map((order) => (
// //                   <TableRow key={order._id} hover>
// //                     <TableCell>{order.orderNo}</TableCell>
// //                     <TableCell>
// //                       {new Date(order.createdAt).toLocaleString()}
// //                     </TableCell>
// //                     <TableCell>{order.shippingInfo.fullName}</TableCell>
// //                     <TableCell>{order.shippingInfo.mobileNo}</TableCell>
// //                     <TableCell>
// //                       <Box
// //                         sx={{
// //                           display: "flex",
// //                           flexDirection: "column",
// //                           gap: 1,
// //                         }}
// //                       >
// //                         <SendToCourierButton
// //                           orderData={{
// //                             invoice: order.orderNo,
// //                             recipient_name: order.shippingInfo?.fullName,
// //                             recipient_phone: order.shippingInfo?.mobileNo,
// //                             recipient_address: order.shippingInfo?.address,
// //                             cod_amount: order.dueAmount,
// //                             note: order.note || "", // optional fallback
// //                             order_id: order._id,
// //                             courier_status: order.sentToCourier,
// //                           }}
// //                           onSuccess={handleSuccess}
// //                         />
// //                       </Box>
// //                     </TableCell>
// //                     <TableCell>
// //                         <CourierSummary phone={order.shippingInfo?.mobileNo} />
// //                     </TableCell>
// //
// //                     <TableCell>
// //                         <OrderStatusSelector
// //                           orderId={order._id}
// //                           refetchOrders={() =>
// //                             fetchAllOrders("", currentPage, itemsPerPage)
// //                           }
// //                         />
// //                     </TableCell>
// //                     <TableCell>
// //                       <Chip
// //                         label={
// //                           order.paymentStatus.charAt(0).toUpperCase() +
// //                           order.paymentStatus.slice(1)
// //                         }
// //                         color={
// //                           order.paymentStatus === "paid" ? "success" : "error"
// //                         }
// //                         variant="filled"
// //                         sx={{
// //                           fontWeight: "bold",
// //                           minWidth: "100px",
// //                           height: "32px",
// //                           borderRadius: "4px",
// //                           backgroundColor:
// //                             order.paymentStatus === "paid"
// //                               ? "#4caf50"
// //                               : "#f44336",
// //                           color: "#ffffff",
// //                           "&:hover": {
// //                             backgroundColor:
// //                               order.paymentStatus === "paid"
// //                                 ? "#388e3c"
// //                                 : "#d32f2f",
// //                           },
// //                           "& .MuiChip-label": {
// //                             textTransform: "capitalize",
// //                             fontSize: "0.875rem",
// //                           },
// //                         }}
// //                       />
// //                     </TableCell>
// //                     <TableCell>Tk. {order.totalAmount?.toFixed(2)}</TableCell>
// //                     <TableCell>
// //                       <Box sx={{ display: "flex", gap: 1 }}>
// //                         <Tooltip title="View">
// //                           <IconButton
// //                             onClick={() => handleView(order._id)}
// //                             color="primary"
// //                           >
// //                             <VisibilityIcon />
// //                           </IconButton>
// //                         </Tooltip>
// //                         <RequirePermission
// //                           permission="delete_orders"
// //                           fallback={true}
// //                         >
// //                           <Tooltip title="Delete">
// //                             <IconButton
// //                               onClick={() => handleOpenDialog(order._id)}
// //                               color="error"
// //                             >
// //                               <DeleteIcon />
// //                             </IconButton>
// //                           </Tooltip>
// //                         </RequirePermission>
// //                       </Box>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           </TableContainer>
// //
// //           {/* Pagination */}
// //           <Box
// //             sx={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               mt: 2,
// //             }}
// //           >
// //             <Typography>
// //               Showing {startEntry} to {endEntry} of {totalOrders} entries
// //             </Typography>
// //             <Pagination
// //               count={totalPages}
// //               page={currentPage}
// //               onChange={handlePageChange}
// //               color="primary"
// //             />
// //           </Box>
// //         </>
// //       )}
// //
// //       {/* Delete Confirmation Dialog */}
// //       <Dialog open={openDialog} onClose={handleCloseDialog}>
// //         <DialogTitle>Confirm Delete</DialogTitle>
// //         <DialogContent>
// //           <DialogContentText>
// //             Are you sure you want to delete this order? This action cannot be
// //             undone.
// //           </DialogContentText>
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={handleCloseDialog}>Cancel</Button>
// //           <Button onClick={handleConfirmDelete} color="error">
// //             Delete
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //
// //       {/* Snackbar for notifications */}
// //       <Snackbar
// //         open={openSnackbar}
// //         autoHideDuration={3000}
// //         onClose={() => setOpenSnackbar(false)}
// //         anchorOrigin={{ vertical: "top", horizontal: "right" }}
// //       >
// //         <Alert
// //           onClose={() => setOpenSnackbar(false)}
// //           severity={snackbarSeverity}
// //           sx={{ width: "100%" }}
// //         >
// //           {snackbarMessage}
// //         </Alert>
// //       </Snackbar>
// //     </div>
// //   );
// // };
// //
// // export default AllOrders;
//
// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Pagination,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   TableSortLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button,
//   Chip,
// } from "@mui/material";
// import { Skeleton } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { Box } from "@mui/material";
// import { IconButton } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { Tooltip } from "@mui/material";
// import axios from "axios";
// import { Snackbar, Alert } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import useOrderStore from "../../store/useOrderStore.js";
// import OrderStatusSelector from "./OrderStatusSelector.jsx";
// import SendToCourierButton from "./SendToCourierButton.jsx";
// import CourierSummary from "../componentAdmin/CourierSummery.jsx";
// import RequirePermission from "./RequirePermission.jsx";
//
// const AllOrders = ({ allOrders, orderListLoading, orderListError, title, status = "" }) => {
//   const {
//     fetchAllOrders,
//     totalOrders,
//     totalPages,
//     currentPage,
//     itemsPerPage,
//     setCurrentPage,
//     setItemsPerPage,
//     searchQuery,
//     setSearchQuery,
//     currentStatus,
//   } = useOrderStore();
//
//   // Local state for sorting and UI
//   const [sortDirection, setSortDirection] = useState("desc");
//   const [orderBy, setOrderBy] = useState("orderNo");
//   const [openDialog, setOpenDialog] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//
//   // Debounced search effect
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       fetchAllOrders(status, currentPage, itemsPerPage);
//     }, 500); // 500ms debounce
//
//     return () => clearTimeout(timeoutId);
//   }, [searchQuery, currentPage, itemsPerPage, status]);
//
//   // Initial load
//   useEffect(() => {
//     fetchAllOrders(status, 1, itemsPerPage);
//   }, []);
//
//   const handleOpenDialog = (id) => {
//     setDeleteId(id);
//     setOpenDialog(true);
//   };
//
//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setDeleteId(null);
//   };
//
//   const handleSearchChange = (event) => {
//     const query = event.target.value;
//     setSearchQuery(query);
//     setCurrentPage(1); // Reset to first page when searching
//   };
//
//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };
//
//   const handleItemsPerPageChange = (event) => {
//     const newLimit = event.target.value;
//     setItemsPerPage(newLimit);
//   };
//
//   const handleSortRequest = (property) => {
//     const isAsc = orderBy === property && sortDirection === "asc";
//     setSortDirection(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };
//
//   const sortData = (data) => {
//     return data.sort((a, b) => {
//       if (orderBy === "orderNo") {
//         return compare(a.orderNo, b.orderNo);
//       }
//       if (orderBy === "orderDate") {
//         return compare(new Date(a.orderDate), new Date(b.orderDate));
//       }
//       if (orderBy === "totalAmount") {
//         return compare(a.totalAmount, b.totalAmount);
//       }
//       if (orderBy === "shippingInfo.fullName") {
//         return compare(a.shippingInfo.fullName, b.shippingInfo.fullName);
//       }
//       if (orderBy === "shippingInfo.mobileNo") {
//         return compare(a.shippingInfo.mobileNo, b.shippingInfo.mobileNo);
//       }
//       if (orderBy === "orderStatus") {
//         return compare(a.orderStatus, b.orderStatus);
//       }
//       if (orderBy === "paymentStatus") {
//         return compare(a.paymentStatus, b.paymentStatus);
//       }
//       return 0;
//     });
//   };
//
//   const compare = (a, b) => {
//     if (a < b) return sortDirection === "asc" ? -1 : 1;
//     if (a > b) return sortDirection === "asc" ? 1 : -1;
//     return 0;
//   };
//
//   // Sorting the orders (search is now handled server-side)
//   const sortedOrders = sortData(allOrders);
//
//   // Calculate the range for "Showing X to Y of Z entries"
//   const startEntry = (currentPage - 1) * itemsPerPage + 1;
//   const endEntry = Math.min(currentPage * itemsPerPage, totalOrders);
//
//   const handleView = (orderId) => {
//     navigate(`/admin/orders/${orderId}`);
//   };
//
//   const handleConfirmDelete = async () => {
//     try {
//       const response = await axios.delete(`${apiUrl}/orders/${deleteId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//
//       if (response.data.success) {
//         setSnackbarMessage("Order deleted successfully");
//         setSnackbarSeverity("success");
//         setOpenSnackbar(true);
//         fetchAllOrders(status, currentPage, itemsPerPage);
//       } else {
//         setSnackbarMessage(response.data.message || "Failed to delete order");
//         setSnackbarSeverity("error");
//         setOpenSnackbar(true);
//       }
//     } catch (error) {
//       setSnackbarMessage(
//         error.response?.data?.message || "Error deleting order",
//       );
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//     }
//     handleCloseDialog();
//   };
//
//   const handleSuccess = () => {
//     fetchAllOrders(status, currentPage, itemsPerPage);
//   };
//
//   return (
//     <div className="p-4 shadow rounded-lg">
//       <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
//         {title}
//       </h1>
//       <div className="grid grid-cols-2 gap-4 shadow rounded-lg p-4 items-center mt-6 mb-6">
//         {/* Search bar */}
//         <TextField
//           label="Search by Order No, Customer Name, or Mobile No"
//           variant="outlined"
//           onChange={handleSearchChange}
//           value={searchQuery}
//           placeholder="Enter search term..."
//         />
//
//         {/* Items per page selector */}
//         <FormControl>
//           <InputLabel>Items per Page</InputLabel>
//           <Select
//             value={itemsPerPage}
//             onChange={handleItemsPerPageChange}
//             label="Items per Page"
//           >
//             <MenuItem value={5}>5</MenuItem>
//             <MenuItem value={10}>10</MenuItem>
//             <MenuItem value={25}>25</MenuItem>
//             <MenuItem value={50}>50</MenuItem>
//             <MenuItem value={100}>100</MenuItem>
//           </Select>
//         </FormControl>
//       </div>
//
//       {/* Show search info */}
//       {searchQuery && (
//         <Box sx={{ mb: 2 }}>
//           <Typography variant="body2" color="textSecondary">
//             {orderListLoading ? "Searching..." : `Search results for: "${searchQuery}"`}
//           </Typography>
//         </Box>
//       )}
//
//       {/* Loading and error states */}
//       {orderListLoading && (
//         <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 {[
//                   "Order No",
//                   "Order Date & Time",
//                   "Customer",
//                   "Mobile No",
//                   "Courier",
//                   "Courier Status",
//                   "Status",
//                   "Payment Status",
//                   "Total Amount",
//                   "Actions",
//                 ].map((header, i) => (
//                   <TableCell key={i}>
//                     <Skeleton
//                       variant="text"
//                       width={120}
//                       height={30}
//                       align="center"
//                     />
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {[...Array(itemsPerPage)].map((_, index) => (
//                 <TableRow key={index}>
//                   {Array(10)
//                     .fill()
//                     .map((_, cellIndex) => (
//                       <TableCell key={cellIndex}>
//                         <Skeleton variant="text" width="100%" height={20} />
//                       </TableCell>
//                     ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//
//       {orderListError && (
//         <Typography color="error">{orderListError}</Typography>
//       )}
//
//       {!orderListLoading && !orderListError && (
//         <>
//           {/* No results message */}
//           {allOrders.length === 0 ? (
//             <Box sx={{ textAlign: "center", py: 4 }}>
//               <Typography variant="h6" color="textSecondary">
//                 {searchQuery ? "No orders found matching your search." : "No orders found."}
//               </Typography>
//               {searchQuery && (
//                 <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//                   Try adjusting your search terms or clear the search to see all orders.
//                 </Typography>
//               )}
//             </Box>
//           ) : (
//             <>
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>
//                         <TableSortLabel
//                           active={orderBy === "orderNo"}
//                           direction={orderBy === "orderNo" ? sortDirection : "asc"}
//                           onClick={() => handleSortRequest("orderNo")}
//                         >
//                           Order No
//                         </TableSortLabel>
//                       </TableCell>
//                       <TableCell>
//                         <TableSortLabel
//                           active={orderBy === "orderDate"}
//                           direction={
//                             orderBy === "orderDate" ? sortDirection : "asc"
//                           }
//                           onClick={() => handleSortRequest("orderDate")}
//                         >
//                           Order Date & Time
//                         </TableSortLabel>
//                       </TableCell>
//                       <TableCell>
//                         <TableSortLabel
//                           active={orderBy === "shippingInfo.fullName"}
//                           direction={
//                             orderBy === "shippingInfo.fullName"
//                               ? sortDirection
//                               : "asc"
//                           }
//                           onClick={() => handleSortRequest("shippingInfo.fullName")}
//                         >
//                           Customer
//                         </TableSortLabel>
//                       </TableCell>
//                       <TableCell>
//                         <TableSortLabel
//                           active={orderBy === "shippingInfo.mobileNo"}
//                           direction={
//                             orderBy === "shippingInfo.mobileNo"
//                               ? sortDirection
//                               : "asc"
//                           }
//                           onClick={() => handleSortRequest("shippingInfo.mobileNo")}
//                         >
//                           Mobile No
//                         </TableSortLabel>
//                       </TableCell>
//                       <TableCell>Courier</TableCell>
//                       <TableCell>Courier Status</TableCell>
//                       <TableCell>
//                         <TableSortLabel
//                           active={orderBy === "orderStatus"}
//                           direction={
//                             orderBy === "orderStatus" ? sortDirection : "asc"
//                           }
//                           onClick={() => handleSortRequest("orderStatus")}
//                         >
//                           Status
//                         </TableSortLabel>
//                       </TableCell>
//                       <TableCell>
//                         <TableSortLabel
//                           active={orderBy === "paymentStatus"}
//                           direction={
//                             orderBy === "paymentStatus" ? sortDirection : "asc"
//                           }
//                           onClick={() => handleSortRequest("paymentStatus")}
//                         >
//                           Payment Status
//                         </TableSortLabel>
//                       </TableCell>
//                       <TableCell>
//                         <TableSortLabel
//                           active={orderBy === "totalAmount"}
//                           direction={
//                             orderBy === "totalAmount" ? sortDirection : "asc"
//                           }
//                           onClick={() => handleSortRequest("totalAmount")}
//                         >
//                           Total Amount
//                         </TableSortLabel>
//                       </TableCell>
//                       <TableCell>Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {sortedOrders.map((order) => (
//                       <TableRow key={order._id} hover>
//                         <TableCell>{order.orderNo}</TableCell>
//                         <TableCell>
//                           {new Date(order.createdAt).toLocaleString()}
//                         </TableCell>
//                         <TableCell>{order.shippingInfo.fullName}</TableCell>
//                         <TableCell>{order.shippingInfo.mobileNo}</TableCell>
//                         <TableCell>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               flexDirection: "column",
//                               gap: 1,
//                             }}
//                           >
//                             <SendToCourierButton
//                               orderData={{
//                                 invoice: order.orderNo,
//                                 recipient_name: order.shippingInfo?.fullName,
//                                 recipient_phone: order.shippingInfo?.mobileNo,
//                                 recipient_address: order.shippingInfo?.address,
//                                 cod_amount: order.dueAmount,
//                                 note: order.note || "",
//                                 order_id: order._id,
//                                 courier_status: order.sentToCourier,
//                               }}
//                               onSuccess={handleSuccess}
//                             />
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           <CourierSummary phone={order.shippingInfo?.mobileNo} />
//                         </TableCell>
//                         <TableCell>
//                           <OrderStatusSelector
//                             orderId={order._id}
//                             refetchOrders={() =>
//                               fetchAllOrders(status, currentPage, itemsPerPage)
//                             }
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={
//                               order.paymentStatus.charAt(0).toUpperCase() +
//                               order.paymentStatus.slice(1)
//                             }
//                             color={
//                               order.paymentStatus === "paid" ? "success" : "error"
//                             }
//                             variant="filled"
//                             sx={{
//                               fontWeight: "bold",
//                               minWidth: "100px",
//                               height: "32px",
//                               borderRadius: "4px",
//                               backgroundColor:
//                                 order.paymentStatus === "paid"
//                                   ? "#4caf50"
//                                   : "#f44336",
//                               color: "#ffffff",
//                               "&:hover": {
//                                 backgroundColor:
//                                   order.paymentStatus === "paid"
//                                     ? "#388e3c"
//                                     : "#d32f2f",
//                               },
//                               "& .MuiChip-label": {
//                                 textTransform: "capitalize",
//                                 fontSize: "0.875rem",
//                               },
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell>Tk. {order.totalAmount?.toFixed(2)}</TableCell>
//                         <TableCell>
//                           <Box sx={{ display: "flex", gap: 1 }}>
//                             <Tooltip title="View">
//                               <IconButton
//                                 onClick={() => handleView(order._id)}
//                                 color="primary"
//                               >
//                                 <VisibilityIcon />
//                               </IconButton>
//                             </Tooltip>
//                             <RequirePermission
//                               permission="delete_orders"
//                               fallback={true}
//                             >
//                               <Tooltip title="Delete">
//                                 <IconButton
//                                   onClick={() => handleOpenDialog(order._id)}
//                                   color="error"
//                                 >
//                                   <DeleteIcon />
//                                 </IconButton>
//                               </Tooltip>
//                             </RequirePermission>
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//
//               {/* Pagination */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   mt: 2,
//                 }}
//               >
//                 <Typography>
//                   Showing {startEntry} to {endEntry} of {totalOrders} entries
//                   {searchQuery && ` (filtered)`}
//                 </Typography>
//                 <Pagination
//                   count={totalPages}
//                   page={currentPage}
//                   onChange={handlePageChange}
//                   color="primary"
//                 />
//               </Box>
//             </>
//           )}
//         </>
//       )}
//
//       {/* Delete Confirmation Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this order? This action cannot be
//             undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button onClick={handleConfirmDelete} color="error">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//
//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={3000}
//         onClose={() => setOpenSnackbar(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={() => setOpenSnackbar(false)}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };
//
// export default AllOrders;

import React, { useState, useEffect } from "react";
import {
  TextField,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Chip,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Skeleton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../../store/useOrderStore.js";
import OrderStatusSelector from "./OrderStatusSelector.jsx";
import SendToCourierButton from "./SendToCourierButton.jsx";
import CourierSummary from "../componentAdmin/CourierSummery.jsx";
import RequirePermission from "./RequirePermission.jsx";

const AllOrders = ({
  allOrders,
  orderListLoading,
  orderListError,
  title,
  status = "",
}) => {
  const {
    fetchAllOrders,
    totalOrders,
    totalPages,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    searchQuery,
    setSearchQuery,
    currentStatus,
  } = useOrderStore();

  // Local state for sorting and UI
  const [sortDirection, setSortDirection] = useState("desc");
  const [orderBy, setOrderBy] = useState("orderNo");
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Local search input state (separate from the store's searchQuery)
  const [searchInput, setSearchInput] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Only fetch when searchQuery (from store) changes, not searchInput
  useEffect(() => {
    fetchAllOrders(status, currentPage, itemsPerPage);
  }, [searchQuery, currentPage, itemsPerPage, status]);

  // Initial load
  useEffect(() => {
    fetchAllOrders(status, 1, itemsPerPage);
  }, []);

  const handleOpenDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  // Handle input change (only updates local state, doesn't trigger API)
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  // Handle search execution (Enter key or search button click)
  const handleSearchExecute = () => {
    setSearchQuery(searchInput.trim());
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle Enter key press
  const handleSearchKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchExecute();
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    const newLimit = event.target.value;
    setItemsPerPage(newLimit);
  };

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      if (orderBy === "orderNo") {
        return compare(a.orderNo, b.orderNo);
      }
      if (orderBy === "orderDate") {
        return compare(new Date(a.orderDate), new Date(b.orderDate));
      }
      if (orderBy === "totalAmount") {
        return compare(a.totalAmount, b.totalAmount);
      }
      if (orderBy === "shippingInfo.fullName") {
        return compare(a.shippingInfo.fullName, b.shippingInfo.fullName);
      }
      if (orderBy === "shippingInfo.mobileNo") {
        return compare(a.shippingInfo.mobileNo, b.shippingInfo.mobileNo);
      }
      if (orderBy === "orderStatus") {
        return compare(a.orderStatus, b.orderStatus);
      }
      if (orderBy === "paymentStatus") {
        return compare(a.paymentStatus, b.paymentStatus);
      }
      return 0;
    });
  };

  const compare = (a, b) => {
    if (a < b) return sortDirection === "asc" ? -1 : 1;
    if (a > b) return sortDirection === "asc" ? 1 : -1;
    return 0;
  };

  // Sorting the orders (search is now handled server-side)
  const sortedOrders = sortData(allOrders);

  // Calculate the range for "Showing X to Y of Z entries"
  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalOrders);

  const handleView = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/orders/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSnackbarMessage("Order deleted successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        fetchAllOrders(status, currentPage, itemsPerPage);
      } else {
        setSnackbarMessage(response.data.message || "Failed to delete order");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(
        error.response?.data?.message || "Error deleting order",
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
    handleCloseDialog();
  };

  const handleSuccess = () => {
    fetchAllOrders(status, currentPage, itemsPerPage);
  };

  return (
    <div className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        {title}
      </h1>
      <div className="grid grid-cols-2 gap-4 shadow rounded-lg p-4 items-center mt-6 mb-6">
        {/* Search bar with search and clear buttons */}
        <TextField
          label="Search Orders"
          variant="outlined"
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyPress={handleSearchKeyPress}
          placeholder="Search Orders..."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchInput && (
                  <IconButton
                    aria-label="clear search"
                    onClick={handleClearSearch}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
                <IconButton
                  aria-label="search"
                  onClick={handleSearchExecute}
                  edge="end"
                  disabled={!searchInput.trim()}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Items per page selector */}
        <FormControl>
          <InputLabel>Items per Page</InputLabel>
          <Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            label="Items per Page"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Show search info */}
      {searchQuery && (
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="textSecondary">
            {orderListLoading
              ? "Searching..."
              : `Search results for: "${searchQuery}"`}
          </Typography>
          <Button size="small" variant="outlined" onClick={handleClearSearch}>
            Clear Search
          </Button>
        </Box>
      )}

      {/* Loading and error states */}
      {orderListLoading && (
        <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Order No",
                  "Order Date & Time",
                  "Customer",
                  "Mobile No",
                  "Courier",
                  "Courier Status",
                  "Status",
                  "Payment Status",
                  "Total Amount",
                  "Actions",
                ].map((header, i) => (
                  <TableCell key={i}>
                    <Skeleton
                      variant="text"
                      width={120}
                      height={30}
                      align="center"
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(itemsPerPage)].map((_, index) => (
                <TableRow key={index}>
                  {Array(10)
                    .fill()
                    .map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" width="100%" height={20} />
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {orderListError && (
        <Typography color="error">{orderListError}</Typography>
      )}

      {!orderListLoading && !orderListError && (
        <>
          {/* No results message */}
          {allOrders.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                {searchQuery
                  ? "No orders found matching your search."
                  : "No orders found."}
              </Typography>
              {searchQuery && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  Try adjusting your search terms or clear the search to see all
                  orders.
                </Typography>
              )}
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "orderNo"}
                          direction={
                            orderBy === "orderNo" ? sortDirection : "asc"
                          }
                          onClick={() => handleSortRequest("orderNo")}
                        >
                          Order No
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "orderDate"}
                          direction={
                            orderBy === "orderDate" ? sortDirection : "asc"
                          }
                          onClick={() => handleSortRequest("orderDate")}
                        >
                          Order Date & Time
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "shippingInfo.fullName"}
                          direction={
                            orderBy === "shippingInfo.fullName"
                              ? sortDirection
                              : "asc"
                          }
                          onClick={() =>
                            handleSortRequest("shippingInfo.fullName")
                          }
                        >
                          Customer
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "shippingInfo.mobileNo"}
                          direction={
                            orderBy === "shippingInfo.mobileNo"
                              ? sortDirection
                              : "asc"
                          }
                          onClick={() =>
                            handleSortRequest("shippingInfo.mobileNo")
                          }
                        >
                          Mobile No
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Courier</TableCell>
                      <TableCell>Courier Status</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "orderStatus"}
                          direction={
                            orderBy === "orderStatus" ? sortDirection : "asc"
                          }
                          onClick={() => handleSortRequest("orderStatus")}
                        >
                          Status
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "paymentStatus"}
                          direction={
                            orderBy === "paymentStatus" ? sortDirection : "asc"
                          }
                          onClick={() => handleSortRequest("paymentStatus")}
                        >
                          Payment Status
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "totalAmount"}
                          direction={
                            orderBy === "totalAmount" ? sortDirection : "asc"
                          }
                          onClick={() => handleSortRequest("totalAmount")}
                        >
                          Total Amount
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedOrders.map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell>{order.orderNo}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{order.shippingInfo.fullName}</TableCell>
                        <TableCell>{order.shippingInfo.mobileNo}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <SendToCourierButton
                              orderData={{
                                invoice: order.orderNo,
                                recipient_name: order.shippingInfo?.fullName,
                                recipient_phone: order.shippingInfo?.mobileNo,
                                recipient_address: order.shippingInfo?.address,
                                cod_amount: order.dueAmount,
                                note: order.note || "",
                                order_id: order._id,
                                courier_status: order.sentToCourier,
                              }}
                              onSuccess={handleSuccess}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <CourierSummary
                            phone={order.shippingInfo?.mobileNo}
                          />
                        </TableCell>
                        <TableCell>
                          <OrderStatusSelector
                            orderId={order._id}
                            refetchOrders={() =>
                              fetchAllOrders(status, currentPage, itemsPerPage)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              order.paymentStatus.charAt(0).toUpperCase() +
                              order.paymentStatus.slice(1)
                            }
                            color={
                              order.paymentStatus === "paid"
                                ? "success"
                                : "error"
                            }
                            variant="filled"
                            sx={{
                              fontWeight: "bold",
                              minWidth: "100px",
                              height: "32px",
                              borderRadius: "4px",
                              backgroundColor:
                                order.paymentStatus === "paid"
                                  ? "#4caf50"
                                  : "#f44336",
                              color: "#ffffff",
                              "&:hover": {
                                backgroundColor:
                                  order.paymentStatus === "paid"
                                    ? "#388e3c"
                                    : "#d32f2f",
                              },
                              "& .MuiChip-label": {
                                textTransform: "capitalize",
                                fontSize: "0.875rem",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          Tk. {order.totalAmount?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="View">
                              <IconButton
                                onClick={() => handleView(order._id)}
                                color="primary"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <RequirePermission
                              permission="delete_orders"
                              fallback={true}
                            >
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() => handleOpenDialog(order._id)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </RequirePermission>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Typography>
                  Showing {startEntry} to {endEntry} of {totalOrders} entries
                  {searchQuery && ` (filtered)`}
                </Typography>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
};

export default AllOrders;
