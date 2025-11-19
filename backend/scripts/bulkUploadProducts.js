require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ProductModel = require("../models/ProductModel");
const CategoryModel = require("../models/CategoryModel");
const FlagModel = require("../models/FlagModel"); // Import FlagModel

const productsFilePath = path.join(__dirname, "products.json");
const uploadsDir = path.join(__dirname, "../uploads");

// A simple map for common image MIME types to file extensions
const mimeTypeMap = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Function to convert Google Drive sharing URL to direct download URL
const convertToDirectGoogleDriveLink = (url) => {
  if (!url || typeof url !== 'string') {
    return url;
  }
  const googleDriveSharePattern = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/;
  const match = url.match(googleDriveSharePattern);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url; // Return original URL if not a Google Drive sharing link
};

const downloadImage = async (url) => {
  if (!url) return null;

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error(`Invalid content type: ${contentType}. URL does not point to a valid image.`);
    }

    const extension = mimeTypeMap[contentType];
    if (!extension) {
      throw new Error(`Unsupported image format: ${contentType}`);
    }

    // Generate a unique filename with the correct extension
    const filename = `${Date.now()}${extension}`;
    const imagePath = path.join(uploadsDir, filename);

    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filename));
      writer.on('error', (err) => {
        console.error(`Error writing image file for URL: ${url}`, err);
        // Clean up the partially written file
        fs.unlink(imagePath, () => reject(null));
      });
    });
  } catch (error) {
    console.error(`Failed to download image from ${url}:`, error.message);
    return null;
  }
};


const bulkUpload = async () => {
  const dbUrl = process.env.MONGO_URI;

  if (!dbUrl) {
    console.error("MONGO_URI not found in .env file. Please make sure it's set.");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUrl, { autoIndex: true });
    console.log("Database connected successfully.");

    const productsData = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    let successfulUploads = 0;
    let failedUploads = 0;

    // Pre-process product data to convert Google Drive links
    const processedProductsData = productsData.map(product => {
      const newProduct = { ...product };
      newProduct.thumbnailImage = convertToDirectGoogleDriveLink(product.thumbnailImage);
      if (newProduct.images && Array.isArray(newProduct.images)) {
        newProduct.images = newProduct.images.map(convertToDirectGoogleDriveLink);
      }
      return newProduct;
    });


    for (const productData of processedProductsData) {
      try {
        // --- Find Category ---
        const category = await CategoryModel.findOne({ name: productData.categoryName });
        if (!category) {
          console.error(`Category "${productData.categoryName}" not found for product "${productData.name}". Skipping.`);
          failedUploads++;
          continue;
        }

        // --- Find Flags ---
        let flagIds = [];
        if (productData.flagNames && Array.isArray(productData.flagNames) && productData.flagNames.length > 0) {
            const foundFlags = await FlagModel.find({ name: { $in: productData.flagNames } });
            flagIds = foundFlags.map(flag => flag._id);

            if (flagIds.length !== productData.flagNames.length) {
                const foundFlagNames = foundFlags.map(flag => flag.name);
                const notFoundFlags = productData.flagNames.filter(name => !foundFlagNames.includes(name));
                console.warn(`Warning: For product "${productData.name}", the following flags were not found: ${notFoundFlags.join(", ")}`);
            }
        }


        // --- Download Images ---
        const thumbnailImageFilename = await downloadImage(productData.thumbnailImage);
        if (!thumbnailImageFilename) {
            console.error(`Failed to download thumbnail for product "${productData.name}". Skipping.`);
            failedUploads++;
            continue;
        }

        const imageFilenames = [];
        if (productData.images && productData.images.length > 0) {
            for (const imageUrl of productData.images) {
                const filename = await downloadImage(imageUrl);
                if (filename) {
                    imageFilenames.push(filename);
                }
            }
        }
        
        if (imageFilenames.length === 0) {
            console.error(`Failed to download any image for product "${productData.name}". Skipping.`);
            failedUploads++;
            continue;
        }

        // --- Create Product ---
        const newProduct = new ProductModel({
          name: productData.name,
          category: category._id,
          flags: flagIds, // Add flags here
          finalPrice: productData.price,
          finalStock: productData.stock,
          thumbnailImage: thumbnailImageFilename,
          images: imageFilenames,
          shortDesc: productData.shortDesc,
          longDesc: productData.longDesc,
        });

        await newProduct.save();
        console.log(`Successfully uploaded product: "${productData.name}"`);
        successfulUploads++;
      } catch (error) {
        console.error(`Failed to upload product "${productData.name}":`, error.message);
        failedUploads++;
      }
    }

    console.log("\n--- Bulk Upload Summary ---");
    console.log(`Successfully uploaded: ${successfulUploads} products.`);
    console.log(`Failed to upload: ${failedUploads} products.`);
    console.log("---------------------------\n");

  } catch (error) {
    console.error("An error occurred during the bulk upload process:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
};

bulkUpload();
