require("dotenv").config(); // ✅ Load environment variables

// External dependencies
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const compression = require("compression");

// Routes
const router = require("./routes/api");

// Create the Express app
const app = express();

// MongoDB connection
const URL = process.env.MONGO_URI; // Use environment variable for Mongo URI
if (!URL || !process.env.CLIENT_URL) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

mongoose
  .connect(URL, { autoIndex: true }) // Optional auto-indexing
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("DB Connection Error:", err));

// Client URL for CORS setup
const clientUrl = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.replace(/\/$/, ""))
  : [];

// CORS setup
const corsOptions = {
  origin: clientUrl,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-Favicon"],
};

// Middleware setup

// Trust proxy to handle X-Forwarded-For header in reverse proxies (e.g., Render)
app.set("trust proxy", 1); // Trust first proxy

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Compression middleware for better performance
app.use(compression());

// Cookie parsing middleware
app.use(cookieParser());

// CORS setup to allow cross-origin requests
app.use(cors(corsOptions));

// Helmet for setting security-related HTTP headers
app.use(helmet());

// Security middleware to sanitize data and prevent common attacks
app.use(mongoSanitize()); // MongoDB query injection prevention
app.use(hpp()); // HTTP Parameter Pollution protection

// Body parsers for handling large payloads and URL-encoded data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiter setup
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2000, // Limit each IP to 2000 requests per window
});
app.use(limiter);

// Route handling
app.use("/api/", router); // All routes under /api

// Export the app for use in the server file
module.exports = app;
