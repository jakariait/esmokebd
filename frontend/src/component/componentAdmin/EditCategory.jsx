import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import useAuthAdminStore from "../../store/AuthAdminStore";
import {
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	Snackbar,
	CircularProgress,
} from "@mui/material";

const EditCategory = () => {
	const { id } = useParams();
	const [category, setCategory] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const { token } = useAuthAdminStore();
	const navigate = useNavigate();
	const apiURL = import.meta.env.VITE_API_URL;

	useEffect(() => {
		if (!id) return;

		axios
			.get(`${apiURL}/category/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				if (res.data) {
					setCategory(res.data);
				} else {
					setError("Category not found.");
				}
				setLoading(false);
			})
			.catch((err) => {
				setError("Error fetching category data. Please try again.");
				setLoading(false);
			});
	}, [id, token]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const categoryData = {
			name: category?.name,
			featureCategory: category?.featureCategory,
			showOnNavbar: category?.showOnNavbar,
		};

		try {
			const response = await axios.put(`${apiURL}/category/${id}`, categoryData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json", // Set Content-Type as application/json
				},
			});


			// Redirect to the category list after successful update
			if (response.data) {
				setSnackbarMessage("Category updated successfully!");
				setOpenSnackbar(true);
				setTimeout(() => navigate("/admin/categorylist/"), 2000); // Redirect after Snackbar message
			}
		} catch (err) {
			let errorMessage =
				"Error updating category: " + (err.response?.data?.message || err.message);
			setSnackbarMessage(errorMessage);
			setOpenSnackbar(true);
		}
	};



	if (loading) return <CircularProgress />;
	if (error) return <p>{error}</p>;

	return (
		<div className="p-4 shadow rounded-lg">
			<h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
				Edit Category
			</h1>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 gap-6">
					<div className="space-y-2">
						<TextField
							label="Category Name"
							value={category?.name || ""}
							onChange={(e) => setCategory({ ...category, name: e.target.value })}
							variant="outlined"
							fullWidth
							required
							error={!category?.name}
							helperText={!category?.name ? "Category name is required" : ""}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Feature Category */}
						<div className="space-y-2">
							<FormControl fullWidth>
								<InputLabel>Feature Category</InputLabel>
								<Select
									value={category?.featureCategory === true ? "true" : "false"} // Convert boolean to string
									onChange={(e) =>
										setCategory({ ...category, featureCategory: e.target.value === "true" }) // Convert back to boolean
									}
									label="Feature Category"
								>
									<MenuItem value="true">Yes</MenuItem>
									<MenuItem value="false">No</MenuItem>
								</Select>
							</FormControl>
						</div>

						{/* Show on Navbar */}
						<div className="space-y-2">
							<FormControl fullWidth>
								<InputLabel>Show on Navbar</InputLabel>
								<Select
									value={category?.showOnNavbar === true ? "true" : "false"} // Convert boolean to string
									onChange={(e) =>
										setCategory({ ...category, showOnNavbar: e.target.value === "true" }) // Convert back to boolean
									}
									label="Show on Navbar"
								>
									<MenuItem value="true">Yes</MenuItem>
									<MenuItem value="false">No</MenuItem>
								</Select>
							</FormControl>
						</div>
					</div>
				</div>

				<div className="flex justify-center">
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={loading}
						startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
					>
						{loading ? "Saving..." : "Save Category"}
					</Button>
				</div>
			</form>

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

export default EditCategory;