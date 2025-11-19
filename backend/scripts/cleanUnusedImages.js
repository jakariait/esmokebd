import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";

// Models
import CarouselModel from "../models/CarouselModel.js";
import FeatureImageModel from "../models/FeatureImageModel.js";
import GeneralInfoModel from "../models/GeneralInfoModel.js";
import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";
import BlogModel from "../models/BlogModel.js";


// Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

// Collect used images
const usedImages = new Set();
const addImage = (img) => {
  if (img && typeof img === "string") {
    usedImages.add(img);
  }
};

const collectUsedImages = async () => {
  const carousels = await CarouselModel.find({}, "imgSrc");
  carousels.forEach((item) => addImage(item.imgSrc));

  const features = await FeatureImageModel.find({}, "imgSrc");
  features.forEach((item) => addImage(item.imgSrc));

  const infos = await GeneralInfoModel.find({}, "PrimaryLogo SecondaryLogo Favicon");
  infos.forEach((item) => {
    addImage(item.PrimaryLogo);
    addImage(item.SecondaryLogo);
    addImage(item.Favicon);
  });

  const products = await ProductModel.find({}, "thumbnailImage images");
  products.forEach((product) => {
    addImage(product.thumbnailImage);
    product.images?.forEach(addImage);
  });

  const users = await UserModel.find({}, "userImage");
  users.forEach((user) => addImage(user.userImage));

  const blogs = await BlogModel.find({}, "thumbnailImage");
  blogs.forEach((user) => addImage(user.userImage));
};

await collectUsedImages();

// Delete unused images
const uploadsDir = path.join(__dirname, "../uploads");

fs.readdir(uploadsDir, (err, allFiles) => {
  if (err) {
    console.error("❌ Failed to read uploads directory:", err);
    process.exit(1);
  }

  const unusedFiles = allFiles.filter((file) => !usedImages.has(file));
  let deletedCount = 0;

  unusedFiles.forEach((file) => {
    const fullPath = path.join(uploadsDir, file);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`❌ Failed to delete ${file}:`, err);
      } else {
        deletedCount++;
        if (deletedCount === unusedFiles.length) {
          console.log(`✅ Cleanup complete. ${deletedCount} unused image(s) deleted.`);
          process.exit();
        }
      }
    });
  });

  if (unusedFiles.length === 0) {
    console.log("✅ No unused images to delete. Uploads folder is clean.");
    process.exit();
  }
});
