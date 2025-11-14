import React, { useRef, useState } from "react";
import useCategoryStore from "../../store/useCategoryStore.js";
import useSubCategoryStore from "../../store/useSubCategoryStore.js";
import useChildCategoryStore from "../../store/useChildCategoryStore.js";
import useFlagStore from "../../store/useFlagStore.js";
import useProductSizeStore from "../../store/useProductSizeStore.js";
import AuthAdminStore from "../../store/AuthAdminStore.js";
import { Editor } from "primereact/editor";
import { useNavigate } from "react-router-dom";

import {
  Box,
  MenuItem,
  Select,
  Typography,
  Chip,
  Input,
  ListItemText,
  Checkbox,
  FormHelperText,
  FormControl,
  TextField,
  InputAdornment,
  Button,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const AddProduct = () => {
  // Fetching data from the store
  const { categories } = useCategoryStore();
  const { subCategories } = useSubCategoryStore();
  const { childCategories } = useChildCategoryStore();
  const { flags } = useFlagStore();
  const { productSizes } = useProductSizeStore();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = AuthAdminStore();
  const navigate = useNavigate();

  // Local state for selected category, subcategory, and child category
  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [sizeChart, setSizeChart] = useState("");
  const [shippingReturn, setShippingReturn] = useState("");
  const [productCode, setProductCode] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [filteredChildCategories, setFilteredChildCategories] = useState([]);
  const [selectedChildCategory, setSelectedChildCategory] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [searchTags, setSearchTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [finalPrice, setFinalPrice] = useState("");
  const [finalDiscount, setFinalDiscount] = useState("");
  const [finalStock, setFinalStock] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [selectedFlags, setSelectedFlags] = useState([]);

  const [hasVariant, setHasVariant] = useState(true);
  const [variants, setVariants] = useState([
    { size: "", stock: "", price: "", discount: "" },
  ]);

  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar severity (success/error)

  const fileInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  const handleToggle = () => {
    setHasVariant(!hasVariant);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { size: "", stock: "", price: "", discount: "" },
    ]);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleMultipleImagesChange = (event) => {
    const files = Array.from(event.target.files);

    // Create separate lists for files and preview URLs
    const newImages = files.map((file) => file);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  // Remove a specific image
  const handleRemoveImages = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => {
      URL.revokeObjectURL(prevPreviews[index]); // Clean up memory
      return prevPreviews.filter((_, i) => i !== index);
    });

    // Reset input field if no images are left
    if (selectedImages.length === 1) {
      document.getElementById("multi-image-upload").value = "";
    }
  };

  // Remove all images
  const handleRemoveAllImages = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url)); // Clean up all URLs
    setSelectedImages([]);
    setImagePreviews([]);
    document.getElementById("multi-image-upload").value = ""; // Reset input field
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setThumbnailImage(file); // Store the file object (you'll upload this later)
      setImagePreview(imageUrl); // Set the preview URL
    }
  };
  // Remove image and reset preview
  const handleRemoveImage = () => {
    setThumbnailImage(null);
    setImagePreview("");
    document.getElementById("thumbnail-upload").value = ""; // Reset the input value
  };

  // Handle adding search tags
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!searchTags.includes(tagInput.trim())) {
        setSearchTags([...searchTags, tagInput.trim()]);
      }
      setTagInput(""); // Clear input field
    }
  };

  // Handle removing search tags
  const handleDeleteTag = (tagToDelete) => {
    setSearchTags(searchTags.filter((tag) => tag !== tagToDelete));
  };

  // Local state for form errors
  const [errors, setErrors] = useState({
    category: "",
  });

  // Handle category selection change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubCategory(""); // Reset subcategory selection
    setSelectedChildCategory(""); // Reset child category selection

    if (!categoryId) {
      setFilteredSubCategories([]);
      return;
    }

    // Filter subcategories based on selected category ID
    const filteredSubs = subCategories.filter(
      (sub) => sub.category._id === categoryId,
    );
    setFilteredSubCategories(filteredSubs);
  };

  // Handle subcategory selection change
  const handleSubCategoryChange = (e) => {
    const subCategoryId = e.target.value;
    setSelectedSubCategory(subCategoryId);
    setSelectedChildCategory(""); // Reset child category selection

    if (!subCategoryId) {
      setFilteredChildCategories([]);
      return;
    }

    // Filter child categories based on selected subcategory ID
    const filteredChilds = childCategories.filter(
      (child) => child.subCategory._id === subCategoryId,
    );
    setFilteredChildCategories(filteredChilds);
  };

  // Handle child category selection change
  const handleChildCategoryChange = (e) => {
    setSelectedChildCategory(e.target.value);
  };

  // Handle flag selection change
  const handleFlagChange = (e) => {
    const selected = e.target.value;
    setSelectedFlags(selected);
  };

  // Handle Final Price  change and validation
  const handleFinalPriceChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0; // Prevent negative values
    setFinalPrice(value);
  };
  // Handle Discount price  change and validation
  const handleDiscountChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0; // Prevent negative values
    setFinalDiscount(value);
  };
  // Handle Final Stock  change and validation
  const handleFinalStockChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0; // Prevent negative values
    setFinalStock(value);
  };
  // Handle reward points change and validation
  const handleRewardPointsChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0; // Prevent negative values
    setRewardPoints(value);
  };
  // Handle Purchase  change and validation
  const handlePurchasePriceChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0; // Prevent negative values
    setPurchasePrice(value);
  };

  // Handle adding keywords
  const handleAddKeyword = (e) => {
    if (e.key === "Enter" && keywordInput.trim() !== "") {
      e.preventDefault();
      if (!metaKeywords.includes(keywordInput.trim())) {
        setMetaKeywords([...metaKeywords, keywordInput.trim()]);
      }
      setKeywordInput(""); // Clear input field
    }
  };

  // Handle removing keywords
  const handleDeleteKeyword = (keywordToDelete) => {
    setMetaKeywords(
      metaKeywords.filter((keyword) => keyword !== keywordToDelete),
    );
  };
  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate required fields
    let validationErrors = {};
    if (!name.trim()) validationErrors.name = "Product name is required.";
    if (!selectedCategory) validationErrors.category = "Category is required.";
    if (!(thumbnailImage instanceof File)) {
      validationErrors.thumbnailImage = "Thumbnail image is required.";
    }
    if (selectedImages.length === 0) {
      validationErrors.images = "At least one image is required.";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create FormData object
    const formData = new FormData();

    // Append text fields
    formData.append("name", name);
    formData.append("shortDesc", shortDesc);
    formData.append("longDesc", longDesc);
    formData.append("sizeChart", sizeChart);
    formData.append("shippingReturn", shippingReturn);
    formData.append("productCode", productCode);
    formData.append("rewardPoints", rewardPoints);
    formData.append("videoUrl", videoUrl);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("finalPrice", finalPrice);
    formData.append("finalDiscount", finalDiscount);
    formData.append("finalStock", finalStock);
    formData.append("purchasePrice", purchasePrice);

    // Append category fields
    if (selectedCategory) formData.append("category", selectedCategory);
    if (selectedSubCategory)
      formData.append("subCategory", selectedSubCategory);
    if (selectedChildCategory)
      formData.append("childCategory", selectedChildCategory);

    // Append flags
    if (selectedFlags.length > 0) {
      selectedFlags.forEach((flag) => formData.append("flags", flag)); // Use "flags" instead of "flags[]"
    }

    // Append search tags and meta keywords
    if (searchTags.length > 0) {
      searchTags.forEach((tag) => formData.append("searchTags", tag)); // Use "searchTags" instead of "searchTags[]"
    }
    if (metaKeywords.length > 0) {
      metaKeywords.forEach((keyword) =>
        formData.append("metaKeywords", keyword),
      ); // Use "metaKeywords" instead of "metaKeywords[]"
    }

    // Append thumbnail image
    if (thumbnailImage instanceof File) {
      formData.append("thumbnailImage", thumbnailImage);
    }

    // Append multiple images
    selectedImages.forEach((image) => {
      if (image instanceof File) {
        formData.append("images", image); // Use "images" instead of "images[]"
      }
    });

    if (variants.length > 0) {
      variants.forEach((variant, index) => {
        // Check if all required fields are available for this variant
        if (!variant.size || !variant.stock || !variant.price) {
          // Skip this variant if any required field is missing
          return;
        }

        // Only append valid variants with required fields
        Object.keys(variant).forEach((key) => {
          formData.append(`variants[${index}][${key}]`, variant[key]);
        });
      });
    }

    try {
      // Send request to the server
      const response = await axios.post(`${apiUrl}/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Success: show success Snackbar
      setSnackbarMessage("Product created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Cleanup form data after successful submission
      // Reset all state values to initial states
      setName("");
      setShortDesc("");
      setLongDesc("");
      setSizeChart("");
      setShippingReturn("");
      setProductCode("");
      setRewardPoints("");
      setVideoUrl("");
      setMetaTitle("");
      setMetaDescription("");
      setFinalPrice("");
      setFinalDiscount("");
      setFinalStock("");
      setPurchasePrice("");
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedChildCategory(null);
      setSelectedFlags([]);
      setSearchTags([]);
      setMetaKeywords([]);
      setThumbnailImage(null);
      setImagePreview("");
      setSelectedImages([]);
      setVariants([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input
      }

      if (imagesInputRef.current) {
        imagesInputRef.current.value = "";
      }

      // Clear any validation errors
      setErrors({});
      setTimeout(() => {
        navigate("/admin/viewallproducts");
      }, 3000);
    } catch (error) {
      // Error handling: show error Snackbar
      setSnackbarMessage("Failed to create product. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);

      // Display server-side validation errors
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };
  console.log(errors);
  return (
    <div className={"shadow rounded-lg p-3"}>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Add New Product
      </h1>
      <form onSubmit={handleSubmit}>
        <div className={"md:grid grid-cols-12 gap-8 p-3"}>
          <div className={"col-span-8"}>
            {/* Product Name */}
            <TextField
              label="Product Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              margin="normal"
            />

            {/* Short Description */}
            <TextField
              label="Short Description"
              fullWidth
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />

            {/* Long Description */}
            <h1 className={"py-3 pl-1"}>Long Description</h1>
            <Editor
              value={longDesc}
              onTextChange={(e) => setLongDesc(e.htmlValue)}
              style={{ height: "260px" }}
            />
            {/*/!* Size Chart *!/*/}
            {/*<div>*/}
            {/*  <h1 className={"py-3 pl-1"}>Size Chart</h1>*/}

            {/*  <Editor*/}
            {/*    value={sizeChart}*/}
            {/*    onTextChange={(e) => setSizeChart(e.htmlValue)}*/}
            {/*    style={{ height: "260px" }}*/}
            {/*  />*/}
            {/*</div>*/}
            {/* Shipping and Return */}
            <div>
              <h1 className={"py-3 pl-1"}>Shipping and Return</h1>

              <Editor
                value={shippingReturn}
                onTextChange={(e) => setShippingReturn(e.htmlValue)}
                style={{ height: "260px" }}
              />
            </div>
            {/* Search Tag Input */}
            <Box mb={2}>
              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                margin="normal"
              >
                <TextField
                  label="Search Tags"
                  fullWidth
                  placeholder="Type a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: searchTags.length > 0 && (
                      <InputAdornment position="start">
                        {/* Display all the chips inside the text field */}
                        <Box gap={1}>
                          {searchTags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              onDelete={() => handleDeleteTag(tag)}
                              size="small"
                              style={{
                                margin: "2px",
                                backgroundColor: "#e0e0e0",
                              }}
                            />
                          ))}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Video URL */}
              <TextField
                label="Video URL"
                fullWidth
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                margin="normal"
              />
            </Box>
          </div>
          <div className={"col-span-4"}>
            {/* Thumbnail Image Upload */}
            <Box mb={2}>
              <Typography>
                Product Thumbnail Image{" "}
                <span style={{ color: "red", fontSize: "18px" }}>*</span>
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  display: "inline-block", // Hide the default file input
                }}
                id="thumbnail-upload"
                name="thumbnailImage"
                ref={fileInputRef} // Attach the ref here
                required={true}
              />
              <label
                htmlFor="thumbnail-upload"
                style={{
                  display: "block",
                  height: "210px",
                  marginTop: "10px",
                  border: "2px solid #aaa",
                  cursor: "pointer",
                  textAlign: "center",
                  position: "relative",
                  backgroundImage: imagePreview
                    ? `url(${imagePreview})`
                    : "none", // Use backgroundImage
                  backgroundColor: imagePreview ? "transparent" : "#f0f0f0", // Use backgroundColor
                  backgroundSize: "contain", // Changed to contain
                  backgroundRepeat: "no-repeat", // Prevent background from repeating
                  backgroundPosition: "center", // Center the image
                  color: imagePreview ? "transparent" : "#000",
                }}
              >
                {imagePreview ? (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        position: "absolute",
                        bottom: "10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      Image Selected
                    </Typography>
                    {/* Remove Button */}
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        padding: "5px 10px",
                        fontSize: "12px",
                        zIndex: 10,
                      }}
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    Click to upload an image
                  </Typography>
                )}
              </label>
            </Box>

            {!hasVariant && (
              <>
                {/* Final Price */}
                <TextField
                  label="Price (In BDT) "
                  type="number" // Make it a number input
                  fullWidth
                  value={finalPrice}
                  onChange={handleFinalPriceChange}
                  margin="normal"
                  required
                />
                {/* Final Discount Price */}
                <TextField
                  label="Discount Price"
                  type="number" // Make it a number input
                  fullWidth
                  value={finalDiscount}
                  onChange={handleDiscountChange}
                  margin="normal"
                />
                {/* Final Stock  */}
                <TextField
                  label="Stock"
                  type="number" // Make it a number input
                  fullWidth
                  value={finalStock}
                  onChange={handleFinalStockChange}
                  required
                  margin="normal"
                />
              </>
            )}

            {/* Reward Points */}
            <TextField
              label="Reward Points"
              type="number" // Make it a number input
              fullWidth
              value={rewardPoints}
              onChange={handleRewardPointsChange}
              margin="normal"
            />
            {/*/!* Purchase Price *!/*/}
            {/*<TextField*/}
            {/*  label="Purchase Price"*/}
            {/*  type="number" // Make it a number input*/}
            {/*  fullWidth*/}
            {/*  value={purchasePrice}*/}
            {/*  onChange={handlePurchasePriceChange}*/}
            {/*  margin="normal"*/}
            {/*/>*/}
            {/* Product Code */}
            <TextField
              label="Product Code"
              fullWidth
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              margin="normal"
            />
            {/* Category Selection */}
            <Box mb={2} mt={2}>
              <FormControl fullWidth error={Boolean(errors.category)}>
                {/* InputLabel added to style the label */}
                <InputLabel
                  htmlFor="category-select"
                  sx={{
                    color: "grey", // Change label color
                  }}
                  required
                >
                  Select Category
                </InputLabel>

                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  required={true}
                  displayEmpty
                  label="Select Category"
                  id="category-select" // Added id to link with InputLabel
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>

                {errors.category && (
                  <FormHelperText>{errors.category}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Subcategory Selection */}
            <Box mb={2} mt={2}>
              <FormControl fullWidth error={Boolean(errors.subCategory)}>
                {/* InputLabel added to style the label */}
                <InputLabel
                  htmlFor="subcategory-select"
                  sx={{
                    color: "grey", // Change label color
                  }}
                >
                  Select Sub Category
                </InputLabel>

                <Select
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  disabled={!selectedCategory}
                  label="Select Sub Category" // Label used in Select
                  id="subcategory-select" // Added id to link with InputLabel
                >
                  {filteredSubCategories.length > 0 ? (
                    filteredSubCategories.map((subCategory) => (
                      <MenuItem key={subCategory._id} value={subCategory._id}>
                        {subCategory.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No subcategories available</MenuItem>
                  )}
                </Select>

                {errors.subCategory && (
                  <FormHelperText>{errors.subCategory}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Child Category Selection */}
            <Box mb={2} mt={2}>
              <FormControl fullWidth error={Boolean(errors.childCategory)}>
                {/* InputLabel added to style the label */}
                <InputLabel
                  htmlFor="child-category-select"
                  sx={{
                    color: "grey", // Change label color
                  }}
                >
                  Select Child Category
                </InputLabel>

                <Select
                  value={selectedChildCategory}
                  onChange={handleChildCategoryChange}
                  displayEmpty
                  label="Select Child Category"
                  id="child-category-select" // Added id to link with InputLabel
                  disabled={!selectedSubCategory} // Disabled until a subcategory is selected
                >
                  {filteredChildCategories.length > 0 ? (
                    filteredChildCategories.map((childCategory) => (
                      <MenuItem
                        key={childCategory._id}
                        value={childCategory._id}
                      >
                        {childCategory.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No child categories available</MenuItem>
                  )}
                </Select>

                {errors.childCategory && (
                  <FormHelperText>{errors.childCategory}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Flag Selection - Dropdown with Multiple Choices */}
            <Box mb={2}>
              <Typography>Select Flags</Typography>
              <Select
                multiple
                fullWidth
                value={selectedFlags}
                onChange={handleFlagChange}
                input={<Input />}
                renderValue={(selected) => (
                  <div>
                    {selected.map((flagId) => {
                      const flag = flags.find((f) => f._id === flagId);
                      return (
                        <Chip
                          key={flag._id}
                          label={flag.name}
                          style={{ margin: 2 }}
                        />
                      );
                    })}
                  </div>
                )}
              >
                {flags.map((flag) => (
                  <MenuItem key={flag._id} value={flag._id}>
                    <Checkbox checked={selectedFlags.indexOf(flag._id) > -1} />
                    <ListItemText primary={flag.name} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </div>
        </div>

        <div className={"shadow rounded-lg p-3 mt-3"}>
          {/* Multiple Images Upload */}
          <Box mb={2}>
            <Typography>
              Product Images{" "}
              <span style={{ color: "red", fontSize: "18px" }}>*</span>
            </Typography>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleImagesChange}
              style={{ display: "block" }} // Hide the default file input
              id="multi-image-upload"
              name="images"
              ref={imagesInputRef}
              required={true}
            />

            <label
              htmlFor="multi-image-upload"
              style={{
                marginTop: "10px",
                border: "2px solid #aaa",
                cursor: "pointer",
                textAlign: "center",
                position: "relative",
                backgroundColor:
                  selectedImages.length > 0 ? "transparent" : "#f0f0f0",
                overflow: "hidden",
                padding: "10px",
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "150px", // Ensures space for images & button
              }}
            >
              {selectedImages.length > 0 ? (
                <>
                  {/* Remove All Button inside the input field */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAllImages();
                    }}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                    onMouseLeave={(e) => (e.target.style.opacity = "1")}
                  >
                    Remove All
                  </button>
                  <div
                    className={
                      "flex gap-5 flex-wrap mt-7 justify-center items-center"
                    }
                  >
                    {imagePreviews.map((image, index) => (
                      <div
                        key={index}
                        style={{
                          width: "150px",
                          height: "150px",
                          marginTop: "5px",
                          backgroundImage: `url(${image})`,
                          backgroundSize: "contain", // Improved for better fit
                          backgroundPosition: "center",
                          borderRadius: "5px",
                          position: "relative",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        {/* Remove Button on each Image */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImages(index);
                          }}
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            fontSize: "12px",
                            transition: "0.2s",
                          }}
                          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                          onMouseLeave={(e) => (e.target.style.opacity = "1")}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  Click to upload images
                </Typography>
              )}
            </label>
          </Box>
        </div>
        <div className={"shadow rounded-lg p-3 mt-3"}>
          {/*Variants Input*/}
          <Box border={1} p={2} borderRadius={2}>
            <div className="flex flex-col items-center">
              <Typography variant="h6" align="center">
                Product Has Variant?
              </Typography>
              <Switch checked={hasVariant} onChange={handleToggle} />
            </div>

            {hasVariant && (
              <>
                <Typography
                  variant="h6"
                  align="center"
                  color="error"
                  fontWeight={400}
                  sx={{ mb: 1 }}
                >
                  Product Variant (Insert the Base Variant First)
                </Typography>

                {/* Responsive Table Wrapper */}
                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Size</TableCell>
                        <TableCell>Stock *</TableCell>
                        <TableCell>Price *</TableCell>
                        <TableCell>Disc. Price *</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {variants.map((variant, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              select
                              fullWidth
                              value={variant.size}
                              required={true}
                              onChange={(e) => {
                                const updatedVariants = [...variants];
                                updatedVariants[index].size = e.target.value;
                                setVariants(updatedVariants);
                              }}
                              sx={{ width: "150px" }}
                            >
                              {productSizes
                                .filter((size) => size.isActive) // Filter only active sizes
                                .map((size) => (
                                  <MenuItem key={size._id} value={size._id}>
                                    {size.name}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              fullWidth
                              value={variant.stock}
                              required={true}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Prevent negative values
                                if (value >= 0 || value === "") {
                                  const updatedVariants = [...variants];
                                  updatedVariants[index].stock = value;
                                  setVariants(updatedVariants);
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              fullWidth
                              value={variant.price}
                              required={true}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Prevent negative values
                                if (value >= 0 || value === "") {
                                  const updatedVariants = [...variants];
                                  updatedVariants[index].price = value;
                                  setVariants(updatedVariants);
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              fullWidth
                              value={variant.discount}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Prevent negative values
                                if (value >= 0 || value === "") {
                                  const updatedVariants = [...variants];
                                  updatedVariants[index].discount = value;
                                  setVariants(updatedVariants);
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              color="error"
                              fullWidth
                              onClick={() => handleRemoveVariant(index)}
                            >
                              <DeleteIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>

                {/* Centered Button */}
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddVariant}
                  >
                    + Add Another Variant
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </div>

        <div className={"shadow rounded-lg p-3 mt-3"}>
          <h1>
            Product SEO Information{" "}
            <span className={"text-red-500"}>(Optional)</span>{" "}
          </h1>
          <div className={"grid grid-cols-2 gap-4"}>
            {/* Meta Title */}
            <TextField
              label="Meta Title"
              fullWidth
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              margin="normal"
            />
            {/* Meta Keywords Input */}
            <Box mb={2}>
              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                margin="normal"
              >
                <TextField
                  label="Met Keywords"
                  fullWidth
                  placeholder="Type a keyword and press Enter"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: metaKeywords.length > 0 && (
                      <InputAdornment position="start">
                        {/* Display all the chips inside the text field */}
                        <Box gap={1}>
                          {metaKeywords.map((keyword, index) => (
                            <Chip
                              key={index}
                              label={keyword}
                              onDelete={() => handleDeleteKeyword(keyword)}
                              size="small"
                              style={{
                                margin: "2px",
                                backgroundColor: "#e0e0e0",
                              }}
                            />
                          ))}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </div>

          {/* Meta Description */}
          <TextField
            label="Meta Description"
            fullWidth
            multiline
            rows={4}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            margin="none"
            InputProps={{
              style: { resize: "vertical", overflow: "auto" }, // This makes it resizable
            }}
          />
        </div>

        {/* Submit Button */}
        <div className={"flex justify-center items-center m-8"}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            className="mt-4"
          >
            Add Product
          </Button>
        </div>
        {/* Snackbar for success/error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position it at the top-right
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </form>
    </div>
  );
};

export default AddProduct;
