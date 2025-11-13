import React, { useRef, useState } from "react";
import AuthAdminStore from "../../store/AuthAdminStore.js";
import { Editor } from "primereact/editor";
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const AddBlog = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = AuthAdminStore();

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [searchTags, setSearchTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fileInputRef = useRef(null);
  const imagesInputRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("author", author);
    formData.append("longDesc", longDesc);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    searchTags.forEach((tag) => formData.append("searchTags", tag));
    metaKeywords.forEach((keyword) => formData.append("metaKeywords", keyword));
    if (thumbnailImage instanceof File) {
      formData.append("thumbnailImage", thumbnailImage);
    }

    try {
      await axios.post(`${apiUrl}/blog`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSnackbarMessage("Blog created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Reset all fields
      setName("");
      setAuthor("");
      setLongDesc("");
      setMetaTitle("");
      setMetaDescription("");
      setSearchTags([]);
      setMetaKeywords([]);
      setThumbnailImage(null);
      setImagePreview("");
      setSelectedImages([]);

      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imagesInputRef.current) imagesInputRef.current.value = "";
    } catch (error) {
      setSnackbarMessage("Failed to create blog. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="shadow rounded-lg p-3">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Add New Blog
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="md:grid grid-cols-12 gap-8 p-3">
          <div className="col-span-8">
            <TextField
              label="Blog Title"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              margin="normal"
            />

            <TextField
              label="Author"
              fullWidth
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              margin="normal"
            />

            <h1 className="py-3 pl-1">Blog Content</h1>
            <Editor
              value={longDesc}
              onTextChange={(e) => setLongDesc(e.htmlValue)}
              style={{ height: "260px" }}
            />

            <Box mb={2}>
              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                margin="normal"
              >
                <TextField
                  label="Tags"
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
            </Box>
          </div>
          <div className="col-span-4">
            {/* Thumbnail Image Upload */}
            <Box mb={2}>
              <Typography>
                Blog Thumbnail Image{" "}
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
          </div>
        </div>

        <div className={"shadow rounded-lg p-3 mt-3"}>
          <h1>
            Blog SEO Information{" "}
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

        <div className={"flex justify-center mt-10 mb-10"}>
          <Button variant="contained" type="submit" color="primary">
            Create Blog
          </Button>
        </div>

      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          onClose={handleSnackbarClose}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddBlog;