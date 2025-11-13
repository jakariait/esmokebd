import React, { useEffect, useState } from "react";
import { Editor } from "primereact/editor";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import useAuthAdminStore from "../../store/AuthAdminStore.js";


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/**
 * Reusable page editor for CMS-like editable pages
 *
 * @param {string} title - Title of the section (e.g. "About Us")
 * @param {string} endpoint - API endpoint to GET and PATCH content
 */
const PageEditor = ({ title, endpoint }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarError, setSnackbarError] = useState("");

  const { token } = useAuthAdminStore();



  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/pagecontent/${endpoint}`,
        );
        if (res.data?.content) {
          setContent(res.data.content);
        }
      } catch (err) {
        console.error(`Error fetching ${title} content:`, err);
      }
    };
    fetchContent();
  }, [endpoint, title]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/pagecontent/${endpoint}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token here
          },
        }
      );
      setSnackbarError("");
      setSnackbarOpen(true);
    } catch (err) {
      console.error(`Update error for ${title}:`, err);
      setSnackbarError("Update failed.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };


  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <div className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Edit {title}
      </h1>
      <Editor
        value={content}
        onTextChange={(e) => setContent(e.htmlValue)}
        style={{ height: "500px" }}
        readOnly={loading}
      />
      <div className={"flex justify-center items-center"}>
        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-4 primaryBgColor accentTextColor cursor-pointer  px-4 py-2 rounded w-96 items-center disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarError ? "error" : "success"}
        >
          {snackbarError || `${title} updated successfully!`}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PageEditor;
