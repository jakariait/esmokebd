const express = require("express");
const multer = require("multer");
const path = require("path");
const generalInfoController = require("../controllers/GeneralInfoController");
const newsletterController = require("../controllers/NewsLetterController");
const CarouselController = require("../controllers/CarouselController");
const featureImageController = require("../controllers/FeatureImageController");
const colorController = require("../controllers/ColorController");
const socialMediaLinkController = require("../controllers/SocialMediaLinkController");
const contactController = require("../controllers/ContactController");
const AdminController = require("../controllers/AdminController");
const categoryController = require("../controllers/categoryController");
const subCategoryController = require("../controllers/subCategoryController");
const childCategoryController = require("../controllers/childCategoryController");
const productSizeController = require("../controllers/productSizeController");
const flagController = require("../controllers/flagController");
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController");
const shippingController = require("../controllers/ShippingController");
const freeDeliveryController = require("../controllers/FreeDeliveryController");
const couponController = require("../controllers/CouponController");
const VatPercentageController = require("../controllers/VatPercentageController");
const orderController = require("../controllers/orderController");
const bkashController = require("../controllers/bkashController");
const PageContentController = require("../controllers/PageContentController");
const FaqController = require("../controllers/FaqController");
const MarqueeController = require("../controllers/MarqueeController");
const metaController = require("../controllers/metaController");
const abandonedCartController = require("../controllers/abandonedCartController");
const GoogleTagManagerController = require("../controllers/GoogleTagManagerController");
const bkashConfigController = require("../controllers/bkashConfigController");
const SteadfastConfigController = require("../controllers/SteadfastConfigController");
const blogController = require("../controllers/BlogController");
const PassWordResetController = require("../controllers/PassWordResetController");


const { handleCourierCheck } = require("../controllers/courierController");
const {
  createSteadfastOrder,
  getSteadfastOrderStatusByInvoice,
} = require("../controllers/steadfastController");

// Admin
const { adminProtect } = require("../middlewares/authAdminMiddleware");
const checkPermission = require("../middlewares/checkPermissionMiddleware");

const { authenticateToken } = require("../middlewares/authenticateToken");

// User
const { userProtect } = require("../middlewares/authUserMiddleware");
const {
  authenticateUserToken,
} = require("../middlewares/authinticateUserToken");

require("dotenv").config();

const router = express.Router();

// Set Up Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Ensure files are saved in the 'uploads' folder
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)), // Naming files uniquely
});

const upload = multer({ storage }).fields([
  {
    name: "PrimaryLogo",
    maxCount: 1,
  },
  {
    name: "SecondaryLogo",
    maxCount: 1,
  },
  {
    name: "Favicon",
    maxCount: 1,
  },
  {
    name: "imgSrc",
    maxCount: 1,
  },
  {
    name: "categoryIcon",
    maxCount: 1,
  },
  {
    name: "categoryBanner",
    maxCount: 1,
  },
  {
    name: "thumbnailImage",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 10,
  },
  {
    name: "userImage",
    maxCount: 1,
  },
]);

// Serve images from the 'uploads' folder as static files
router.use("/uploads", express.static(path.join(__dirname, "uploads")));

//   Routes for General Information
router.get("/getGeneralInfo", generalInfoController.getGeneralInfo);

router.post(
  "/updateGeneralInfo",
  adminProtect,
  checkPermission("general_info"),
  upload,
  generalInfoController.generalInfoUpdate,
);

router.delete(
  "/deleteGeneralInfo",
  adminProtect,
  checkPermission("general_info"),

  generalInfoController.deleteGeneralInfo,
);

//   Routes for Newsletter Subscription
router.post("/subscribe", newsletterController.subscribe);
router.get(
  "/subscribers",
  adminProtect,
  checkPermission("subscribed_users"),
  newsletterController.getSubscription,
);
router.delete(
  "/delete-subscriber",
  adminProtect,
  checkPermission("subscribed_users"),
  newsletterController.deleteSubscriber,
);

//  Routes for Carousel
router.post(
  "/createcarousel",
  upload,
  adminProtect,
  checkPermission("sliders-banners"),
  CarouselController.createCarousel,
);
router.get("/getallcarousel", CarouselController.getAllCarousel);
router.delete(
  "/deletebyidcarousel/:id",
  adminProtect,
  checkPermission("sliders-banners"),
  CarouselController.deleteByIdCarousel,
);

// Routes for Feature Images
router.post(
  "/feature-images/create",
  upload,
  adminProtect,
  checkPermission("sliders-banners"),
  featureImageController.createFeatureImage,
);
router.get("/feature-images", featureImageController.getAllFeatureImages);
router.get(
  "/feature-images/:id",
  adminProtect,
  checkPermission("sliders-banners"),
  featureImageController.getFeatureImageById,
);
router.put(
  "/feature-images/:id",
  upload,
  adminProtect,
  checkPermission("sliders-banners"),
  featureImageController.updateFeatureImage,
);
router.delete(
  "/feature-images/:id",
  adminProtect,
  checkPermission("sliders-banners"),
  featureImageController.deleteFeatureImage,
);

// Routes for Colors
router.get("/colors", colorController.getColors);
router.put(
  "/colors",
  adminProtect,
  checkPermission("website_theme_color"),
  colorController.updateColor,
);

// Routes for Social Media Link
router.get("/socialmedia", socialMediaLinkController.getSocialMedia);
router.put(
  "/socialmedia",
  adminProtect,
  checkPermission("social_media_link"),
  socialMediaLinkController.updateSocialMedia,
);

// Routes for Contact Us Form
router.post("/contacts", contactController.createContact);
router.get(
  "/contacts",
  adminProtect,
  checkPermission("contact_request"),
  contactController.getAllContacts,
);
router.get(
  "/contacts/:id",
  adminProtect,
  checkPermission("contact_request"),
  contactController.getContactById,
);
router.put(
  "/contacts/:id",
  adminProtect,
  checkPermission("contact_request"),
  contactController.updateContact,
);
router.delete(
  "/contacts/:id",
  adminProtect,
  checkPermission("contact_request"),
  contactController.deleteContact,
);

// Admin Login route
router.post("/admin/login", AdminController.loginAdmin);
router.get("/admin/me", authenticateToken, AdminController.getLoggedInAdmin);

// CRUD routes for Admin User
router.post(
  "/admin/create",
  adminProtect,
  checkPermission("admin-users"),
  AdminController.createAdmin,
);
router.get(
  "/admin/getall",
  adminProtect,
  checkPermission("admin-users"),
  AdminController.getAllAdmins,
);
router.get(
  "/admin/:id",
  adminProtect,
  checkPermission("admin-users"),
  AdminController.getAdminById,
);
router.put(
  "/admin/:id",
  adminProtect,
  checkPermission("admin-users"),
  AdminController.updateAdmin,
);
router.delete(
  "/admin/:id",
  adminProtect,
  checkPermission("admin-users"),
  AdminController.deleteAdmin,
);

// User Login Route

// 🚀 Public Routes
router.post("/login", userController.loginUser); // User login (email/phone and password)
router.post("/register", userController.createUser); // Create a new user

// 🚀 Protected Routes (Requires Authentication)
router.get("/profile", userProtect, userController.getLoggedInUser); // Get logged-in user's profile
router.put("/updateUser/:id", upload, userController.updateUser);
router.put(
  "/request-deletion",
  userProtect,
  userController.requestAccountDeletion,
);
router.patch("/change-password", userProtect, userController.changePassword);

// Admin Protected Routes
router.get(
  "/getAllUsers",
  adminProtect,
  checkPermission("view_customers"),
  userController.getAllUsers,
);
router.get(
  "/getUserById/:id",
  adminProtect,
  checkPermission("view_customers"),
  userController.getUserById,
);
router.delete(
  "/deleteUser/:id",
  adminProtect,
  checkPermission("delete_customers"),
  userController.deleteUser,
);

// CRUD routes for Products Category
router.get("/category", categoryController.getCategories);
router.get("/category/:id", categoryController.getCategoryById);
router.post(
  "/category/",
  adminProtect,
  checkPermission("category"),
  categoryController.createCategory,
);
router.put(
  "/category/:id",
  adminProtect,
  checkPermission("category"),
  categoryController.updateCategory,
);
router.delete(
  "/category/:id",
  adminProtect,
  checkPermission("category"),
  categoryController.deleteCategory,
);

// Define routes for subcategories
router.get("/sub-category", subCategoryController.getAllSubCategories);
router.get("/sub-category/:id", subCategoryController.getSubCategoryById);
router.post(
  "/sub-category",
  adminProtect,
  checkPermission("sub_category"),
  subCategoryController.createSubCategory,
);
router.put(
  "/sub-category/:id",
  adminProtect,
  checkPermission("sub_category"),
  subCategoryController.updateSubCategory,
);
router.delete(
  "/sub-category/:id",
  adminProtect,
  checkPermission("sub_category"),
  subCategoryController.deleteSubCategory,
);

// Define routes for Child Categories
router.get("/child-category", childCategoryController.getAllChildCategories);
router.get("/child-category/:id", childCategoryController.getChildCategoryById);
router.post(
  "/child-category",
  adminProtect,
  checkPermission("child_category"),
  childCategoryController.createChildCategory,
);
router.put(
  "/child-category/:id",
  adminProtect,
  checkPermission("child_category"),
  childCategoryController.updateChildCategory,
);
router.delete(
  "/child-category/:id",
  adminProtect,
  checkPermission("child_category"),
  childCategoryController.deleteChildCategory,
);

// Product Size Routes
router.get("/product-sizes", productSizeController.getAllProductSizes);
router.get("/product-sizes/:id", productSizeController.getProductSizeById);
router.post(
  "/product-sizes",
  adminProtect,
  checkPermission("product_size"),
  productSizeController.createProductSize,
);
router.put(
  "/product-sizes/:id",
  adminProtect,
  checkPermission("product_size"),
  productSizeController.updateProductSize,
);
router.delete(
  "/product-sizes/:id",
  adminProtect,
  checkPermission("product_size"),
  productSizeController.deleteProductSize,
);

// Routes for Flags
router.get("/flags", flagController.getAllFlags);
router.get("/flags/:id", flagController.getFlagById);
router.post(
  "/flags",
  adminProtect,
  checkPermission("product_flag"),
  flagController.createFlag,
);
router.put(
  "/flags/rearrange",
  adminProtect,
  checkPermission("product_flag"),
  flagController.updateFlagPositions,
);
router.put(
  "/flags/:id",
  adminProtect,
  checkPermission("product_flag"),
  flagController.updateFlag,
);

router.delete(
  "/flags/:id",
  adminProtect,
  checkPermission("product_flag"),
  flagController.deleteFlag,
);

// Routes for Products
router.get("/products", productController.getProducts); // All Products Without Sorting
router.get("/getAllProducts", productController.getAllProducts); // All Products With Sorting
router.get("/getAllProductsAdmin", productController.getAllProductsAdmin);
router.get("/products/:id", productController.getProductById);
router.get("/products/slug/:slug", productController.getProductBySlug);

router.post(
  "/products",
  adminProtect,
  checkPermission("add_products"),
  upload,
  productController.createProduct,
);

router.put(
  "/products/:id",
  adminProtect,
  checkPermission("edit_products"),
  upload,
  productController.updateProduct,
);
router.delete(
  "/products/:id",
  adminProtect,
  checkPermission("delete_products"),
  productController.deleteProduct,
);

router.get(
  "/similar/:category/:productId",
  productController.getSimilarProductsController,
);

router.get("/getProductDetails", productController.getProductDetails); // With Product ID and variants ID

router.get("/homepageproducts", productController.homePageProducts); // Home Page Products By Flag

// Cart Routes
router.get("/getCart", userProtect, cartController.getCart);
router.post("/addToCart", userProtect, cartController.addToCart);
router.patch("/updateCartItem", userProtect, cartController.updateCartItem);
router.delete("/removeCartItem", userProtect, cartController.removeCartItem);
router.delete("/clearCart", userProtect, cartController.clearCart);

// Shipping Option Routes
router.get("/getAllShipping", shippingController.getAllShipping);
router.post(
  "/createShipping",
  adminProtect,
  checkPermission("delivery_charges"),
  shippingController.createShipping,
);
router.get(
  "/getShippingById/:id",
  adminProtect,
  checkPermission("delivery_charges"),
  shippingController.getShippingById,
);
router.patch(
  "/updateShipping/:id",
  adminProtect,
  checkPermission("delivery_charges"),
  shippingController.updateShipping,
);
router.delete(
  "/deleteShipping/:id",
  adminProtect,
  checkPermission("delivery_charges"),
  shippingController.deleteShipping,
);

// Free Delivery Routes
router.get(
  "/getFreeDeliveryAmount",
  freeDeliveryController.getFreeDeliveryAmount,
);
router.patch(
  "/updateFreeDeliveryAmount",
  adminProtect,
  checkPermission("setup_config"),
  freeDeliveryController.updateFreeDeliveryAmount,
);

// Coupon Routes
router.post("/applyCoupon", couponController.applyCoupon);

router.post(
  "/createCoupon",
  adminProtect,
  checkPermission("manage_coupons"),
  couponController.createCoupon,
);
router.get(
  "/getAllCoupons",
  adminProtect,
  checkPermission("manage_coupons"),
  couponController.getAllCoupons,
);
router.patch(
  "/updateCoupon/:id",
  adminProtect,
  checkPermission("manage_coupons"),
  couponController.updateCoupon,
);
router.delete(
  "/deleteCoupon/:id",
  adminProtect,
  checkPermission("manage_coupons"),
  couponController.deleteCoupon,
);

// VAT Percentage Routes
router.get("/getVatPercentage", VatPercentageController.getVatPercentage);
router.patch(
  "/updateVatPercentage",
  adminProtect,
  checkPermission("setup_config"),
  VatPercentageController.updateVatPercentage,
);

// Order routes
router.post("/orders", orderController.createOrder);

router.get(
  "/orders",
  adminProtect,
  checkPermission("view_orders"),
  orderController.getAllOrders,
);
router.get(
  "/orders/:orderId",
  adminProtect,
  checkPermission("view_orders"),
  orderController.getOrderById,
);

router.put(
  "/orders/:orderId",
  adminProtect,
  checkPermission("edit_orders"),
  orderController.updateOrder,
);

router.delete(
  "/orders/:orderId",
  adminProtect,
  checkPermission("delete_orders"),
  orderController.deleteOrder,
);
router.get("/order-no/:orderNo", orderController.getOrderByOrderNo);
router.get(
  "/ordersbyUser/:userId",
  userProtect,
  orderController.getOrdersForUser,
);

// // Order Tracking
router.post("/track-order", orderController.trackOrderByOrderNoAndPhone);

// bKash Payment Gateway Routes
router.post("/bkashcreate", bkashController.createPayment);
router.post("/bkashexecute", bkashController.executePayment);
router.post("/queryPaymentStatus", bkashController.queryPaymentStatus);

// Page Content Routes
router.get("/pagecontent/:page", PageContentController.getPageContent);
router.patch(
  "/pagecontent/:page",
  adminProtect,
  checkPermission("about_terms-policies"),
  PageContentController.updatePageContent,
);

// FAQ's Routes
router.get("/faq", FaqController.getAllFAQs);
router.get("/faq/:id", FaqController.getSingleFAQ);
router.patch(
  "/faq/:id",
  adminProtect,
  checkPermission("faqs"),
  FaqController.updateFAQ,
);
router.delete(
  "/faq/:id",
  adminProtect,
  checkPermission("faqs"),
  FaqController.deleteFAQ,
);
router.post(
  "/faq",
  adminProtect,
  checkPermission("faqs"),
  FaqController.createFAQ,
);

// Marquee Routes
router.get("/marquee", MarqueeController.getMessages);
router.patch(
  "/marquee",
  adminProtect,
  checkPermission("scroll_text"),
  MarqueeController.updateMessageSet,
);

// Meta Routes
router.get("/meta", metaController.getMeta);
router.patch(
  "/meta",
  adminProtect,
  checkPermission("home_page_seo"),
  metaController.updateMeta,
);

// Courier Check Routs
router.post("/courier-check", handleCourierCheck);

// Steadfast Courier Routes
router.post("/steadfast/create-order", adminProtect, createSteadfastOrder);
router.get(
  "/steadfast/get-order-status",
  adminProtect,
  getSteadfastOrderStatusByInvoice,
);

// Abandoned Cart Routes
router.post("/abandoned-cart", abandonedCartController.createAbandonedCart);

router.get(
  "/abandoned-cart",
  adminProtect,
  checkPermission("incomplete_orders"),
  abandonedCartController.getAllAbandonedCarts,
);
router.delete(
  "/abandoned-cart/:id",
  adminProtect,
  checkPermission("delete_incomplete_orders"),
  abandonedCartController.deleteAbandonedCart,
);

// Google Tag Manager Routes
router.get("/getGTM", GoogleTagManagerController.getGTM);
router.post(
  "/updateGTM",
  adminProtect,
  checkPermission("setup_config"),
  GoogleTagManagerController.updateGTM,
);

// bKash Config Routes
router.get(
  "/bkash-config",
  adminProtect,
  checkPermission("bkash_api"),
  bkashConfigController.getBkashConfig,
);
router.patch(
  "/bkash-config",
  adminProtect,
  checkPermission("bkash_api"),
  bkashConfigController.updateBkashConfig,
);

router.get("/bkash-is-active", bkashConfigController.getBkashIsActive);

// SteadFast Config Routes
router.get(
  "/steadfast-config",
  adminProtect,
  checkPermission("steadfast_api"),
  SteadfastConfigController.getConfig,
);
router.patch(
  "/steadfast-config",
  adminProtect,
  checkPermission("steadfast_api"),
  SteadfastConfigController.updateConfig,
);

// Routes for Blogs
router.post(
  "/blog",
  upload,
  adminProtect,
  checkPermission("blogs"),
  blogController.createBlog,
);
router.patch(
  "/blog/:id",
  upload,
  adminProtect,
  checkPermission("blogs"),
  blogController.updateBlog,
);
router.delete(
  "/blog/:id",
  adminProtect,
  checkPermission("blogs"),
  blogController.deleteBlog,
);
router.get("/blog", blogController.getAllBlogs);
router.get("/activeblog", blogController.getActiveBlogs);
router.get("/blog/slug/:slug", blogController.getBlogBySlug);
router.get("/blog/:id", blogController.getBlogById);



// Password Reset Routes
router.post("/request-reset", PassWordResetController.requestPasswordReset);
router.post("/reset-password", PassWordResetController.resetPasswordWithOTP);



module.exports = router;
