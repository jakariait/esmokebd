import React, { useEffect, useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import useAuthAdminStore from "../../store/AuthAdminStore.js";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AdminMetaForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    keywords: [],
    description: "",
  });

  const { token } = useAuthAdminStore();

  const [newKeyword, setNewKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success", // 'error' or 'success'
    message: "",
  });

  const apiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const { data } = await axios.get(`${apiURL}/meta`);
        setFormData({
          title: data.data.title,
          keywords: data.data.keywords,
          description: data.data.description,
        });
      } catch (err) {
        console.error("Failed to fetch meta", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeta();
  }, [apiURL]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addKeyword = () => {
    if (newKeyword && !formData.keywords.includes(newKeyword)) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, newKeyword],
      });
      setNewKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((kw) => kw !== keywordToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${apiURL}/meta`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSnackbar({
        open: true,
        severity: "success",
        message: "Meta information updated successfully!",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to update meta info.",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <p>Loading meta data...</p>;

  return (
    <>
      <div className=" p-4 bg-white shadow rounded">
        <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
          Search Engine Optimization for HomePage
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-100 focus:outline-none px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-100 focus:outline-none px-3 py-2 rounded"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Keywords</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1 bg-gray-100 focus:outline-none px-3 py-2 rounded"
                placeholder="Add keyword"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-3 py-2 primaryBgColor accentTextColor rounded cursor-pointer"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {formData.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="bg-gray-200 px-2 py-1 rounded-full flex items-center  gap-1"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => removeKeyword(kw)}
                    className="text-red-500 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className={"flex items-center justify-center"}>
            <button
              type="submit"
              className=" primaryBgColor accentTextColor text-white px-4 py-2 rounded cursor-pointer"
            >
              Update Meta Info
            </button>
          </div>

        </form>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminMetaForm;
