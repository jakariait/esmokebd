import React, { useEffect, useState } from "react";
import ImageComponent from "../componentGeneral/ImageComponent.jsx";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import useGeneralInfoStore from "../../store/GeneralInfoStore.js";
import { TextField, Button, Snackbar, Alert, Input } from "@mui/material";

export default function GeneralInfoForm() {
  const { token } = useAuthAdminStore();
  const { GeneralInfoList, GeneralInfoUpdate } = useGeneralInfoStore();

  const [formData, setFormData] = useState({
    CompanyName: "",
    PhoneNumber: [""],
    CompanyEmail: [""],
    ShortDescription: "",
    CompanyAddress: "",
    GoogleMapLink: "",
    PlayStoreLink: "",
    AppStoreLink: "",
    TradeLicense: "",
    TINNumber: "",
    BINNumber: "",
    FooterCopyright: "",
  });

  const [files, setFiles] = useState({
    PrimaryLogo: null,
    SecondaryLogo: null,
    Favicon: null,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (GeneralInfoList) {
      setFormData({
        ...GeneralInfoList,
        PhoneNumber: GeneralInfoList.PhoneNumber || [""],
        CompanyEmail: GeneralInfoList.CompanyEmail || [""],
      });

      setFiles({
        PrimaryLogo: GeneralInfoList.PrimaryLogo || null,
        SecondaryLogo: GeneralInfoList.SecondaryLogo || null,
        Favicon: GeneralInfoList.Favicon || null,
      });
    }
  }, [GeneralInfoList]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFiles({ ...files, [e.target.name]: file });
  };

  const handleArrayChange = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayField = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        form.append(key, formData[key].join(","));
      } else if (formData[key]) {
        form.append(key, formData[key]);
      }
    });

    Object.keys(files).forEach((key) => {
      if (files[key] && files[key] instanceof File) {
        form.append(key, files[key]);
      }
    });

    const result = await GeneralInfoUpdate(form, token);

    if (result.success) {
      setSnackbarMessage("General information updated successfully!");
      setSnackbarSeverity("success");
    } else {
      if (result.status === 403) {
        setSnackbarMessage(
          "You do not have permission to perform this action. (403 Forbidden)",
        );
        setSnackbarSeverity("warning");
      } else {
        setSnackbarMessage("Failed to update general information.");
        setSnackbarSeverity("error");
      }
    }

    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="bg-white shadow p-4 rounded-xl">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        General Information Form
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4  mt-8">
          <ImageComponent
            imageName={formData.PrimaryLogo}
            className={"w-40"}
            altName={formData.CompanyName}
            skeletonHeight={200}
          />
          <ImageComponent
            imageName={formData.SecondaryLogo}
            className={"w-40"}
            altName={formData.CompanyName}
            skeletonHeight={200}
          />
          <ImageComponent
            imageName={formData.Favicon}
            className={"w-40"}
            altName={formData.CompanyName}
            skeletonHeight={200}
          />
        </div>

        {/* Image Upload Section */}
        <div className={"grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"}>
          <div>
            <label className="block font-medium">Primary Logo</label>
            <Input
              type="file"
              name="PrimaryLogo"
              onChange={handleFileChange}
              accept="image/*"
              fullWidth
              margin="dense"
            />
          </div>

          <div>
            <label className="block font-medium">Secondary Logo</label>
            <Input
              type="file"
              name="SecondaryLogo"
              onChange={handleFileChange}
              accept="image/*"
              fullWidth
              margin="dense"
            />
          </div>

          <div>
            <label className="block font-medium">Favicon</label>
            <Input
              type="file"
              name="Favicon"
              onChange={handleFileChange}
              accept="image/*"
              fullWidth
              margin="dense"
            />
          </div>
        </div>

        {/* Phone Numbers Section */}
        <div>
          <label className="block font-medium">Phone Numbers</label>
          {formData.PhoneNumber.map((num, index) => (
            <div key={index} className="flex space-x-2 mt-1">
              <TextField
                label="Phone Number"
                variant="outlined"
                value={num}
                onChange={(e) =>
                  handleArrayChange(index, "PhoneNumber", e.target.value)
                }
                fullWidth
                margin="normal"
              />
              {index > 0 && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeArrayField(index, "PhoneNumber")}
                  className="self-center"
                >
                  ✖
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={() => addArrayField("PhoneNumber")}
            className="mt-2"
          >
            + Add More
          </Button>
        </div>

        {/* Company Email Section */}
        <div>
          <label className="block font-medium">Company Email</label>
          {formData.CompanyEmail.map((email, index) => (
            <div key={index} className="flex space-x-2 mt-1">
              <TextField
                label="Company Email"
                variant="outlined"
                value={email}
                onChange={(e) =>
                  handleArrayChange(index, "CompanyEmail", e.target.value)
                }
                fullWidth
                margin="normal"
              />
              {index > 0 && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeArrayField(index, "CompanyEmail")}
                  className="self-center"
                >
                  ✖
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={() => addArrayField("CompanyEmail")}
            className="mt-2"
          >
            + Add More
          </Button>
        </div>

        {/* Other Fields (Company Name, Short Description, etc.) */}
        <TextField
          label="Company Name"
          variant="outlined"
          name="CompanyName"
          value={formData.CompanyName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Short Description"
          variant="outlined"
          name="ShortDescription"
          value={formData.ShortDescription}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Company Address"
          variant="outlined"
          name="CompanyAddress"
          value={formData.CompanyAddress}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Google Map Link"
          variant="outlined"
          name="GoogleMapLink"
          value={formData.GoogleMapLink}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {/*<TextField*/}
        {/*  label="Play Store Link"*/}
        {/*  variant="outlined"*/}
        {/*  name="PlayStoreLink"*/}
        {/*  value={formData.PlayStoreLink}*/}
        {/*  onChange={handleChange}*/}
        {/*  fullWidth*/}
        {/*  margin="normal"*/}
        {/*/>*/}
        {/*<TextField*/}
        {/*  label="App Store Link"*/}
        {/*  variant="outlined"*/}
        {/*  name="AppStoreLink"*/}
        {/*  value={formData.AppStoreLink}*/}
        {/*  onChange={handleChange}*/}
        {/*  fullWidth*/}
        {/*  margin="normal"*/}
        {/*/>*/}
        {/*<TextField*/}
        {/*  label="Trade License"*/}
        {/*  variant="outlined"*/}
        {/*  name="TradeLicense"*/}
        {/*  value={formData.TradeLicense}*/}
        {/*  onChange={handleChange}*/}
        {/*  fullWidth*/}
        {/*  margin="normal"*/}
        {/*/>*/}
        {/*<TextField*/}
        {/*  label="TIN Number"*/}
        {/*  variant="outlined"*/}
        {/*  name="TINNumber"*/}
        {/*  value={formData.TINNumber}*/}
        {/*  onChange={handleChange}*/}
        {/*  fullWidth*/}
        {/*  margin="normal"*/}
        {/*/>*/}
        {/*<TextField*/}
        {/*  label="BIN Number"*/}
        {/*  variant="outlined"*/}
        {/*  name="BINNumber"*/}
        {/*  value={formData.BINNumber}*/}
        {/*  onChange={handleChange}*/}
        {/*  fullWidth*/}
        {/*  margin="normal"*/}
        {/*/>*/}
        <TextField
          label="Footer Copyright"
          variant="outlined"
          name="FooterCopyright"
          value={formData.FooterCopyright}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Submit Button */}

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          className="mt-4"
        >
          Update General Info
        </Button>
      </form>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
