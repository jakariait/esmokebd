import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useCategoryStore from "../../store/useCategoryStore.js";
import useSubCategoryStore from "../../store/useSubCategoryStore.js";
import useChildCategoryStore from "../../store/useChildCategoryStore.js";
import useFlagStore from "../../store/useFlagStore.js";
import useProductSizeStore from "../../store/useProductSizeStore.js";
import AuthAdminStore from "../../store/AuthAdminStore.js";
import useProductStore from "../../store/useProductStore.js";

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
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Editor } from "primereact/editor";

const UpdateProduct = () => {
  const { slug } = useParams();
  const { fetchProductBySlug, product } = useProductStore();

  // Fetching data from the store
  const { categories } = useCategoryStore();
  const { subCategories } = useSubCategoryStore();
  const { childCategories } = useChildCategoryStore();
  const { flags } = useFlagStore();
  const { productSizes } = useProductSizeStore();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = AuthAdminStore();
  const navigate = useNavigate();

  // Local state for form fields
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
  const [thumbnailImage, setThumbnailImage] = useState(null);
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

  const [isActive, setIsActive] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  const imageUrl = `${apiUrl.replace("/api", "")}/uploads`;

  // Load product data when component mounts or slug changes
  useEffect(() => {
    if (slug) {
      fetchProductBySlug(slug);
    }
  }, [slug, fetchProductBySlug]);

  useEffect(() => {
    if (
      product &&
      product.thumbnailImage &&
      (!imagePreview || imagePreview === "") &&
      !(thumbnailImage instanceof File)
    ) {
      setImagePreview(`${imageUrl}/${product.thumbnailImage}`);
    }
  }, [product, imagePreview, thumbnailImage]);

  // Populate form fields when product data is loaded
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setShortDesc(product.shortDesc || "");
      setLongDesc(product.longDesc || "");
      setSizeChart(product.sizeChart || "");
      setShippingReturn(product.shippingReturn || "");
      setProductCode(product.productCode || "");
      setIsActive(String(product.isActive));
      setRewardPoints(product.rewardPoints || "");
      setVideoUrl(product.videoUrl || "");
      setMetaTitle(product.metaTitle || "");
      setMetaDescription(product.metaDescription || "");
      setMetaKeywords(product.metaKeywords || []);
      setSearchTags(product.searchTags || []);
      setFinalPrice(product.finalPrice || "");
      setFinalDiscount(product.finalDiscount || "");
      setFinalStock(product.finalStock || "");
      setPurchasePrice(product.purchasePrice || "");
      setSelectedFlags(product.flags?.map((f) => f._id) || []);
      setExistingImages(product.images || []);

      // Set category hierarchy
      if (product.category) {
        setSelectedCategory(product.category._id);
        const filteredSubs = subCategories.filter(
          (sub) => sub.category._id === product.category._id,
        );
        setFilteredSubCategories(filteredSubs);

        if (product.subCategory) {
          setSelectedSubCategory(product.subCategory._id);
          const filteredChilds = childCategories.filter(
            (child) => child.subCategory._id === product.subCategory._id,
          );
          setFilteredChildCategories(filteredChilds);

          if (product.childCategory) {
            setSelectedChildCategory(product.childCategory._id);
          }
        }
      }

      // Set thumbnail preview
      if (product.thumbnailImage) {
        setImagePreview(`${imageUrl}/${product.thumbnailImage}`);
      }

      // Set variants
      if (product.variants && product.variants.length > 0) {
        setVariants(
          product.variants.map((v) => ({
            size: v.size._id,
            stock: v.stock,
            price: v.price,
            discount: v.discount || "",
          })),
        );
        setHasVariant(true);
      } else {
        setHasVariant(false);
      }
    }
  }, [product, subCategories, childCategories, apiUrl]);

  const handleMultipleImagesChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => file);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleRemoveImages = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => {
      URL.revokeObjectURL(prevPreviews[index]);
      return prevPreviews.filter((_, i) => i !== index);
    });

    if (selectedImages.length === 1) {
      document.getElementById("multi-image-upload").value = "";
    }
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAllImages = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setImagePreviews([]);

    const input = document.getElementById("multi-image-upload");
    if (input) input.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setThumbnailImage(file);
      setImagePreview(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setThumbnailImage(null);
    setImagePreview("");
    document.getElementById("thumbnail-upload").value = "";
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!searchTags.includes(tagInput.trim())) {
        setSearchTags([...searchTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setSearchTags(searchTags.filter((tag) => tag !== tagToDelete));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubCategory("");
    setSelectedChildCategory("");

    if (!categoryId) {
      setFilteredSubCategories([]);
      return;
    }

    const filteredSubs = subCategories.filter(
      (sub) => sub.category._id === categoryId,
    );
    setFilteredSubCategories(filteredSubs);
  };

  const handleSubCategoryChange = (e) => {
    const subCategoryId = e.target.value;
    setSelectedSubCategory(subCategoryId);
    setSelectedChildCategory("");

    if (!subCategoryId) {
      setFilteredChildCategories([]);
      return;
    }

    const filteredChilds = childCategories.filter(
      (child) => child.subCategory._id === subCategoryId,
    );
    setFilteredChildCategories(filteredChilds);
  };

  const handleChildCategoryChange = (e) => {
    setSelectedChildCategory(e.target.value);
  };

  const handleFlagChange = (e) => {
    const selected = e.target.value;
    setSelectedFlags(selected);
  };

  const handleFinalPriceChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    setFinalPrice(value);
  };

  const handleDiscountChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    setFinalDiscount(value);
  };

  const handleFinalStockChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    setFinalStock(value);
  };

  const handleRewardPointsChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    setRewardPoints(value);
  };

  const handlePurchasePriceChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    setPurchasePrice(value);
  };

  const handleAddKeyword = (e) => {
    if (e.key === "Enter" && keywordInput.trim() !== "") {
      e.preventDefault();
      if (!metaKeywords.includes(keywordInput.trim())) {
        setMetaKeywords([...metaKeywords, keywordInput.trim()]);
      }
      setKeywordInput("");
    }
  };

  const handleDeleteKeyword = (keywordToDelete) => {
    setMetaKeywords(
      metaKeywords.filter((keyword) => keyword !== keywordToDelete),
    );
  };

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
    if (!imagePreview && !product.thumbnailImage) {
      validationErrors.thumbnailImage = "Thumbnail image is required.";
    }
    if (existingImages.length + selectedImages.length === 0) {
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
    formData.append("isActive", isActive);

    // Append images to delete
    imagesToDelete.forEach((imageUrl) => {
      formData.append("imagesToDelete", imageUrl);
    });

    // Append category fields
    if (selectedCategory) formData.append("category", selectedCategory);
    if (selectedSubCategory)
      formData.append("subCategory", selectedSubCategory);
    if (selectedChildCategory)
      formData.append("childCategory", selectedChildCategory);

    // Append flags
    if (selectedFlags.length > 0) {
      selectedFlags.forEach((flag) => formData.append("flags", flag));
    }

    // Append search tags and meta keywords
    if (searchTags.length > 0) {
      searchTags.forEach((tag) => formData.append("searchTags", tag));
    }
    if (metaKeywords.length > 0) {
      metaKeywords.forEach((keyword) =>
        formData.append("metaKeywords", keyword),
      );
    }

    // Append thumbnail image if a new one was selected
    if (thumbnailImage instanceof File) {
      formData.append("thumbnailImage", thumbnailImage);
    }

    // Append multiple images
// 👇 Append existing image names as a *different* field
    existingImages.forEach((imageName) => {
      formData.append("existingImages", imageName);
    });

    // Append new images
    selectedImages.forEach((imageFile) => {
      formData.append("images", imageFile);
    });

    if (variants.length > 0) {
      // Add valid variants
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
    } else {
      // Append an empty array for variants if no valid variants are present
      formData.append("variants", JSON.stringify([])); // Ensure it's an empty array
    }


    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }
    try {
      // Send PATCH request to update the product

      await axios.put(`${apiUrl}/products/${product.productId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Success: show success Snackbar
      setSnackbarMessage("Product updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Set a timeout for redirection to wait until Snackbar is visible
      setTimeout(() => {
        navigate("/admin/viewallproducts"); // Example: Redirect to the products list page
      }, 3000); // Wait 3 seconds (3000 ms)

      // Refresh product data
      fetchProductBySlug(slug);

      // Reset new images state
      setSelectedImages([]);
      setImagePreviews([]);
      setThumbnailImage(null);
      setImagesToDelete([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (imagesInputRef.current) {
        imagesInputRef.current.value = "";
      }
    } catch (error) {
      // Error handling: show error Snackbar
      setSnackbarMessage("Failed to update product. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);

      // Display server-side validation errors
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
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


  if (!product) {
    return (
      <div>
        <div className={"grid grid-cols-6 gap-6"}>
          <div className={"col-span-4"}>
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={150} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={100} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
          </div>
          <div className={"col-span-2 "}>
            <Skeleton height={150} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={100} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
          </div>
        </div>
        <Skeleton height={250} width={"100%"} />
        <Skeleton height={200} width={"100%"} />
        <div className={"grid grid-cols-2 gap-6"}>
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
        </div>
        <Skeleton height={200} width={"100%"} />
      </div>
    );
  }
  return (
    <div className={"shadow rounded-lg p-3"}>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Update Product
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
            <div>
              <h1 className={"py-3 pl-1"}>Full Description</h1>

              <Editor
                value={longDesc}
                onTextChange={(e) => setLongDesc(e.htmlValue)}
                style={{ height: "260px" }}
              />
            </div>
            {/* Size Chart */}
            <div>
              <h1 className={"py-3 pl-1"}>Size Chart</h1>

              <Editor
                value={sizeChart}
                onTextChange={(e) => setSizeChart(e.htmlValue)}
                style={{ height: "260px" }}
              />
            </div>

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
                style={{ display: "inline-block" }}
                id="thumbnail-upload"
                name="thumbnailImage"
                ref={fileInputRef}
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
                    : thumbnailImage
                      ? `url(${imageUrl}/${thumbnailImage})`
                      : "",

                  backgroundColor:
                    imagePreview || product.thumbnailImage
                      ? "transparent"
                      : "#f0f0f0",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                {imagePreview || product.thumbnailImage ? (
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
                      {thumbnailImage ? "New Image Selected" : "Current Image"}
                    </Typography>
                    {thumbnailImage && (
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
                    )}
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
              {errors.thumbnailImage && (
                <FormHelperText error>{errors.thumbnailImage}</FormHelperText>
              )}
            </Box>

            {!hasVariant && (
              <>
                {/* Final Price */}
                <TextField
                  label="Price (In BDT)"
                  type="number"
                  fullWidth
                  value={finalPrice}
                  onChange={handleFinalPriceChange}
                  margin="normal"
                />
                {/* Final Discount Price */}
                <TextField
                  label="Discount Price"
                  type="number"
                  fullWidth
                  value={finalDiscount}
                  onChange={handleDiscountChange}
                  margin="normal"
                />
                {/* Final Stock Price */}
                <TextField
                  label="Stock"
                  type="number"
                  fullWidth
                  value={finalStock}
                  onChange={handleFinalStockChange}
                  margin="normal"
                />
              </>
            )}
            {/*Is Active*/}

            <Box sx={{ minWidth: 200 }}>
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={isActive}
                  label="Status"
                  onChange={(e) => setIsActive(e.target.value)}
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Reward Points */}
            <TextField
              label="Reward Points"
              type="number"
              fullWidth
              value={rewardPoints}
              onChange={handleRewardPointsChange}
              margin="normal"
            />
            {/* Purchase Price */}
            <TextField
              label="Purchase Price"
              type="number"
              fullWidth
              value={purchasePrice}
              onChange={handlePurchasePriceChange}
              margin="normal"
            />
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
                <InputLabel htmlFor="category-select" sx={{ color: "grey" }}>
                  Select Category
                </InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  required={true}
                  displayEmpty
                  label="Select Category"
                  id="category-select"
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
                <InputLabel htmlFor="subcategory-select" sx={{ color: "grey" }}>
                  Select Sub Category
                </InputLabel>
                <Select
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  disabled={!selectedCategory}
                  label="Select Sub Category"
                  id="subcategory-select"
                >
                  {filteredSubCategories.length > 0 ? (
                    filteredSubCategories.map((subCategory) => (
                      <MenuItem key={subCategory._id} value={subCategory._id}>
                        {subCategory.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      {selectedCategory
                        ? "No subcategories available"
                        : "Select a category first"}
                    </MenuItem>
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
                <InputLabel
                  htmlFor="child-category-select"
                  sx={{ color: "grey" }}
                >
                  Select Child Category
                </InputLabel>
                <Select
                  value={selectedChildCategory}
                  onChange={handleChildCategoryChange}
                  displayEmpty
                  label="Select Child Category"
                  id="child-category-select"
                  disabled={!selectedSubCategory}
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
                    <MenuItem disabled>
                      {selectedSubCategory
                        ? "No child categories available"
                        : "Select a subcategory first"}
                    </MenuItem>
                  )}
                </Select>
                {errors.childCategory && (
                  <FormHelperText>{errors.childCategory}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* Flag Selection */}
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
              style={{ display: "block" }}
              id="multi-image-upload"
              name="images"
              ref={imagesInputRef}
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
                  existingImages.length + selectedImages.length > 0
                    ? "transparent"
                    : "#f0f0f0",
                overflow: "hidden",
                padding: "10px",
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "150px",
              }}
            >
              {existingImages.length > 0 || selectedImages.length > 0 ? (
                <>
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
                    Remove New Images
                  </button>
                  <div
                    className={
                      "flex gap-5 flex-wrap mt-7 justify-center items-center"
                    }
                  >
                    {/* Existing images */}
                    {existingImages.map((image, index) => (
                      <div
                        key={`existing-${index}`}
                        style={{
                          width: "150px",
                          height: "150px",
                          marginTop: "5px",
                          backgroundImage: `url(${imageUrl}/${image})`,
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          borderRadius: "5px",
                          position: "relative",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveExistingImage(index);
                          }}
                          type={"button"}
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

                    {/* New image previews */}
                    {imagePreviews.map((image, index) => (
                      <div
                        key={`new-${index}`}
                        style={{
                          width: "150px",
                          height: "150px",
                          marginTop: "5px",
                          backgroundImage: `url(${image})`,
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          borderRadius: "5px",
                          position: "relative",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
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
            {errors.images && (
              <FormHelperText error>{errors.images}</FormHelperText>
            )}
          </Box>
        </div>

        {/* Variants Input */}
        {hasVariant && (
          <>
            <div className={"shadow rounded-lg p-3 mt-3"}>
              <Box border={1} p={2} borderRadius={2}>
                {/*<div className="flex flex-col items-center">*/}
                {/*  <Typography variant="h6" align="center">*/}
                {/*    Product Has Variant?*/}
                {/*  </Typography>*/}
                {/*  <Switch checked={hasVariant} onChange={handleToggle} />*/}
                {/*</div>*/}

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
                                    updatedVariants[index].size =
                                      e.target.value;
                                    setVariants(updatedVariants);
                                  }}
                                  sx={{ width: "150px" }}
                                >
                                  {productSizes
                                    .filter((size) => size.isActive)
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
          </>
        )}

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
                  label="Meta Keywords"
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
              style: { resize: "vertical", overflow: "auto" },
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
            Update Product
          </Button>
        </div>

        {/* Snackbar for success/error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

export default UpdateProduct;
