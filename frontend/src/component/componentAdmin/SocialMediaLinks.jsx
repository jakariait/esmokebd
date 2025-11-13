import React, { useState, useEffect } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaFacebookMessenger,
  FaWhatsapp,
  FaTelegram,
  FaYoutube,
  FaTiktok,
  FaPinterest,
  FaViber,
} from "react-icons/fa";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import {
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SocialMediaLinks = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();

  const [links, setLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    messenger: "",
    whatsapp: "",
    telegram: "",
    youtube: "",
    tiktok: "",
    pinterest: "",
    viber: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/socialmedia`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const { _id, ...socialLinks } = data.data;
        setLinks(socialLinks);
      } catch (error) {
        setSnackbar({ open: true, message: error.message, severity: "error" });
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinks((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/socialmedia`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(links),
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      const result = await response.json();
      setLinks(result.data);
      setSnackbar({ open: true, message: result.message, severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const socialPlatforms = [
    {
      key: "facebook",
      icon: <FaFacebook color="#1877F2" />,
      label: "Facebook",
    },
    { key: "twitter", icon: <FaTwitter color="#1DA1F2" />, label: "Twitter" },
    {
      key: "instagram",
      icon: <FaInstagram color="#E1306C" />,
      label: "Instagram",
    },
    {
      key: "linkedin",
      icon: <FaLinkedin color="#0077B5" />,
      label: "LinkedIn",
    },
    {
      key: "messenger",
      icon: <FaFacebookMessenger color="#00B2FF" />,
      label: "Messenger",
    },
    {
      key: "whatsapp",
      icon: <FaWhatsapp color="#25D366" />,
      label: "WhatsApp",
    },
    {
      key: "telegram",
      icon: <FaTelegram color="#0088CC" />,
      label: "Telegram",
    },
    { key: "youtube", icon: <FaYoutube color="#FF0000" />, label: "YouTube" },
    { key: "tiktok", icon: <FaTiktok color="#000000" />, label: "TikTok" },
    {
      key: "pinterest",
      icon: <FaPinterest color="#E60023" />,
      label: "Pinterest",
    },
    { key: "viber", icon: <FaViber color="#7360F2" />, label: "Viber" },
  ];

  return (
    <Paper elevation={3} sx={{ padding: 4, position: "relative" }}>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Update Social Media Links
      </h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {socialPlatforms.map(({ key, icon, label }) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={key}
              display="flex"
              alignItems="center"
              gap={2}
            >
              {icon}
              <TextField
                fullWidth
                label={label}
                name={key}
                value={links[key]}
                onChange={handleChange}
                placeholder={`Enter ${label} link`}
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Update Info
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Paper>
  );
};

export default SocialMediaLinks;
