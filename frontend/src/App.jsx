import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GeneralInfoPage from "./pagesAdmin/GeneralInfoPage.jsx";
import HomePage from "./pagesUser/HomePage.jsx";
import SubscribedUsersPage from "./pagesAdmin/SubscribedUsersPage.jsx";
import SliderBannerPage from "./pagesAdmin/SliderBannerPage.jsx";
import useColorStore from "./store/ColorStore.js";
import { useEffect } from "react";
import ColorUpdaterPage from "./pagesAdmin/ColorUpdaterPage.jsx";
import SocialLinkUpdaterPage from "./pagesAdmin/SocialLinkUpdaterPage.jsx";
import ContactUsPage from "./pagesUser/ContactUsPage.jsx";
import GeneralInfoStore from "./store/GeneralInfoStore.js";
import CarouselStore from "./store/CarouselStore.js";
import FeatureStore from "./store/FeatureStore.js";
import CategoryStore from "./store/useCategoryStore.js";
import SubCategoryStore from "./store/useSubCategoryStore.js";
import useSocialMediaLinkStore from "./store/SocialMediaLinkStore.js";
import useProductSizeStore from "./store/useProductSizeStore.js";
import useFlagStore from "./store/useFlagStore.js";
import useChildCategoryStore from "./store/useChildCategoryStore.js";
import useProductStore from "./store/useProductStore.js";
import useAuthUserStore from "./store/AuthUserStore.js";
import ContactRequestPage from "./pagesAdmin/ContactRequestPage.jsx";
import AdminLogin from "./component/componentAdmin/AdminLogin.jsx";
import ProtectedRoute from "./component/componentAdmin/ProtectedRoute.jsx";
import NotFoundPage from "./pagesUser/NotFoundPage.jsx";
import AddNewCategoryPage from "./pagesAdmin/AddNewCategoryPage.jsx";
import CategoryListPage from "./pagesAdmin/CategoryListPage.jsx";
import EditCategoryPage from "./pagesAdmin/EditCategoryPage.jsx";
import AddNewSubCategoryPage from "./pagesAdmin/AddNewSubCategoryPage.jsx";
import SubCategoryListPage from "./pagesAdmin/SubCategoryListPage.jsx";
import EditSubCategoryPage from "./pagesAdmin/EditSubCategoryPage.jsx";
import ChildCategoryListPage from "./pagesAdmin/ChildCategoryListPage.jsx";
import AddNewChildCategoryPage from "./pagesAdmin/AddNewChildCategoryPage.jsx";
import EditChildCategoryPage from "./pagesAdmin/EditChildCategoryPage.jsx";
import AddNewProductSizePage from "./pagesAdmin/AddNewProductSizePage.jsx";
import ProductSizeListPage from "./pagesAdmin/ProductSizeListPage.jsx";
import EditProductSizePage from "./pagesAdmin/EditProductSizePage.jsx";
import ProductFlagPage from "./pagesAdmin/ProductFlagPage.jsx";
import ShopPage from "./pagesUser/ShopPage.jsx";
import AddNewProductPage from "./pagesAdmin/AddNewProductPage.jsx";
import ProductDetailsPage from "./pagesUser/ProductDetailsPage.jsx";
import ViewAllProductPage from "./pagesAdmin/ViewAllProductPage.jsx";
import EditProductPage from "./pagesAdmin/EditProductPage.jsx";
import LoginPage from "./pagesUser/LoginPage.jsx";
import RegisterPage from "./pagesUser/RegisterPage.jsx";
import CustomerListPage from "./pagesAdmin/CustomerListPage.jsx";
import UserProtectedRoute from "./component/componentGeneral/UserProtectedRoute.jsx";
import UserHomePage from "./pagesUser/UserHomePage.jsx";
import CheckoutPage from "./pagesUser/CheckoutPage.jsx";
import DeliveryChargePage from "./pagesAdmin/DeliveryChargePage.jsx";
import ConfigSetupPage from "./pagesAdmin/ConfigSetupPage.jsx";
import ThankYouPage from "./pagesUser/ThankYouPage.jsx";
import AllOrdersPage from "./pagesAdmin/AllOrdersPage.jsx";
import PendingOrdersPage from "./pagesAdmin/PendingOrdersPage.jsx";
import ApprovedOrdersPage from "./pagesAdmin/ApprovedOrdersPage.jsx";
import InTransitOrdersPage from "./pagesAdmin/InTransitOrdersPage.jsx";
import DeliveredOrdersPage from "./pagesAdmin/DeliveredOrdersPage.jsx";
import ReturnedOrdersPage from "./pagesAdmin/ReturnedOrdersPage.jsx";
import CancelledOrdersPage from "./pagesAdmin/CancelledOrdersPage.jsx";
import ViewOrderPage from "./pagesAdmin/ViewOrderPage.jsx";
import BkashCallbackPage from "./pagesUser/BkashCallbackPage.jsx";
import CouponPage from "./pagesAdmin/CouponPage.jsx";
import ScrollToTop from "./component/componentGeneral/ScrollToTop.jsx";
import AboutUsPage from "./pagesAdmin/AboutUsPage.jsx";
import TermsPage from "./pagesAdmin/TermsPage.jsx";
import AboutUsPageUser from "./pagesUser/AboutUsPageUser.jsx";
import TosPage from "./pagesUser/TosPage.jsx";
import PrivacyPolicyPage from "./pagesUser/PrivacyPolicyPage.jsx";
import RefundPolicyPage from "./pagesUser/RefundPolicyPage.jsx";
import ShippingPolicyPage from "./pagesUser/ShippingPolicyPage.jsx";
import FAQPage from "./pagesUser/FAQPage.jsx";
import AdminFAQSPage from "./pagesAdmin/AdminFAQSPage.jsx";
import MarqueeAdminPage from "./pagesAdmin/MarqueeAdminPage.jsx";
import AdminMetaPage from "./pagesAdmin/AdminMetaPage.jsx";
import MetaProvider from "./component/componentGeneral/MetaProvider.jsx";
import BKashConfigPage from "./pagesAdmin/BKashConfigPage.jsx";
import SteadFastConfigPag from "./pagesAdmin/SteadFastConfigPag.jsx";
import ScrollToTopButton from "./component/componentGeneral/ScrollToTopButton.jsx";
import DashboardPage from "./pagesAdmin/DashboardPage.jsx";
import UserAllOrdersPage from "./pagesUser/UserAllOrdersPage.jsx";
import UserOrderDetailsPage from "./pagesUser/UserOrderDetailsPage.jsx";
import UpdateUserPage from "./pagesUser/UpdateUserPage.jsx";
import ChangePasswordPage from "./pagesUser/ChangePasswordPage.jsx";
import AbandonedCartPage from "./pagesAdmin/AbandonedCartPage.jsx";
import TrackOrderPage from "./pagesUser/TrackOrderPage.jsx";
import AdminListPage from "./pagesAdmin/AdminListPage.jsx";
import CreateAdminPage from "./pagesAdmin/CreateAdminPage.jsx";
import EditAdminPage from "./pagesAdmin/EditAdminPage.jsx";
import { setFaviconFromApi } from "./utils/setFavicon.js";
import CreateBlogPage from "./pagesAdmin/CreateBlogPage.jsx";
import BlogsListPage from "./pagesAdmin/BlogsListPage.jsx";
import EditBlogPage from "./pagesAdmin/EditBlogPage.jsx";
import BlogsPage from "./pagesUser/BlogsPage.jsx";
import BlogDetailsPage from "./pagesUser/BlogDetailsPage.jsx";
import ForgetPasswordPage from "./pagesUser/ForgetPasswordPage.jsx";
import ResetPasswordPage from "./pagesUser/ResetPasswordPage.jsx";

function App() {
  const { GeneralInfoListRequest, GeneralInfoList } = GeneralInfoStore();
  const { CarouselStoreListRequest } = CarouselStore();
  const { FeatureStoreListRequest } = FeatureStore();
  const { fetchColors, colors } = useColorStore(); // ✅ Extract colors
  const { fetchSocialMediaLinks } = useSocialMediaLinkStore();
  const { fetchCategories } = CategoryStore();
  const { fetchSubCategories } = SubCategoryStore();
  const { fetchProductSizes } = useProductSizeStore();
  const { fetchFlags } = useFlagStore();
  const { fetchChildCategories } = useChildCategoryStore();
  const { fetchProducts, fetchProductsAdmin, fetchHomeProducts } =
    useProductStore();
  const { initialize } = useAuthUserStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          GeneralInfoListRequest(),
          CarouselStoreListRequest(),
          FeatureStoreListRequest(),
          fetchColors(),
          fetchSocialMediaLinks(),
          fetchCategories(),
          fetchSubCategories(),
          fetchProductSizes(),
          fetchFlags(),
          fetchChildCategories(),
          fetchProducts(),
          fetchProductsAdmin(),
          initialize(),
          fetchHomeProducts(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // ✅ Empty dependency array to prevent unnecessary re-renders

  useEffect(() => {
    if (colors) {
      document.documentElement.style.setProperty(
        "--primaryColor",
        colors.primaryColor,
      );
      document.documentElement.style.setProperty(
        "--secondaryColor",
        colors.secondaryColor,
      );
      document.documentElement.style.setProperty(
        "--tertiaryColor",
        colors.tertiaryColor,
      );
      document.documentElement.style.setProperty(
        "--accentColor",
        colors.accentColor,
      );
    }
  }, [colors]); // ✅ This effect will run only when colors change

  setFaviconFromApi(GeneralInfoList?.Favicon); // Favicon

  return (
    <Router>
      <MetaProvider />
      <ScrollToTop />
      <ScrollToTopButton />
      <Routes>
        {/* General User Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductDetailsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/thank-you/:orderId" element={<ThankYouPage />} />
        <Route path="/bkash-callback" element={<BkashCallbackPage />} />
        <Route path="/about" element={<AboutUsPageUser />} />
        <Route path="/termofservice" element={<TosPage />} />
        <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
        <Route path="/refundpolicy" element={<RefundPolicyPage />} />
        <Route path="/shippinpolicy" element={<ShippingPolicyPage />} />
        <Route path="/faqs" element={<FAQPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/blog" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailsPage />} />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/*Admin Login Page*/}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected User Routes */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/user/home" element={<UserHomePage />} />
          <Route path="/user/orders" element={<UserAllOrdersPage />} />
          <Route
            path="/user/orders/:orderNo"
            element={<UserOrderDetailsPage />}
          />
          <Route path="/user/manage-profile" element={<UpdateUserPage />} />
          <Route
            path="/user/change-password"
            element={<ChangePasswordPage />}
          />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/general-info" element={<GeneralInfoPage />} />
          <Route
            path="/admin/subscribed-users"
            element={<SubscribedUsersPage />}
          />
          <Route path="/admin/color-updater" element={<ColorUpdaterPage />} />
          <Route
            path="/admin/social-link-updater"
            element={<SocialLinkUpdaterPage />}
          />
          <Route path="/admin/sliders-banners" element={<SliderBannerPage />} />
          <Route
            path="/admin/contact-request"
            element={<ContactRequestPage />}
          />

          {/* Category Routes */}
          <Route
            path="/admin/addnewcategory"
            element={<AddNewCategoryPage />}
          />
          <Route path="/admin/categorylist" element={<CategoryListPage />} />
          <Route
            path="/admin/edit-category/:id"
            element={<EditCategoryPage />}
          />

          {/* SubCategory Routes */}
          <Route
            path="/admin/addnewsubcategory"
            element={<AddNewSubCategoryPage />}
          />
          <Route
            path="/admin/edit-subcategory/:id"
            element={<EditSubCategoryPage />}
          />
          <Route
            path="/admin/subcategorylist"
            element={<SubCategoryListPage />}
          />

          {/* Child Category Routes */}
          <Route
            path="/admin/childcategorylist"
            element={<ChildCategoryListPage />}
          />
          <Route
            path="/admin/addnewchildcategory"
            element={<AddNewChildCategoryPage />}
          />
          <Route
            path="/admin/edit-child-category/:id"
            element={<EditChildCategoryPage />}
          />

          {/* Product Size Routes */}
          <Route
            path="/admin/add-product-size"
            element={<AddNewProductSizePage />}
          />
          <Route
            path="/admin/product-sizes"
            element={<ProductSizeListPage />}
          />
          <Route
            path="/admin/edit-product-size/:id"
            element={<EditProductSizePage />}
          />

          {/* Product Flag Routes */}
          <Route path="/admin/product-flags" element={<ProductFlagPage />} />

          {/* Product Routes */}
          <Route path="/admin/addnewproduct" element={<AddNewProductPage />} />
          <Route
            path="/admin/viewallproducts"
            element={<ViewAllProductPage />}
          />
          <Route
            path="/admin/edit-product/:slug"
            element={<EditProductPage />}
          />

          <Route path="/admin/customers" element={<CustomerListPage />} />
          {/*Delivery Charges Routes*/}
          <Route
            path="/admin/deliverycharge"
            element={<DeliveryChargePage />}
          />

          <Route path="/admin/configsetup" element={<ConfigSetupPage />} />

          {/*Orders Routes*/}
          <Route path="/admin/allorders" element={<AllOrdersPage />} />
          <Route path="/admin/pendingorders" element={<PendingOrdersPage />} />
          <Route
            path="/admin/approvedorders"
            element={<ApprovedOrdersPage />}
          />
          <Route
            path="/admin/intransitorders"
            element={<InTransitOrdersPage />}
          />

          <Route
            path="/admin/deliveredorders"
            element={<DeliveredOrdersPage />}
          />
          <Route
            path="/admin/returnedorders"
            element={<ReturnedOrdersPage />}
          />
          <Route
            path="/admin/cancelledorders"
            element={<CancelledOrdersPage />}
          />

          <Route path="/admin/orders/:orderId" element={<ViewOrderPage />} />

          <Route path="/admin/coupon" element={<CouponPage />} />
          <Route path="/admin/about-us" element={<AboutUsPage />} />
          <Route path="/admin/terms-policies" element={<TermsPage />} />
          <Route path="/admin/faqs" element={<AdminFAQSPage />} />
          <Route path="/admin/scroll-text" element={<MarqueeAdminPage />} />
          <Route path="/admin/homepage-seo" element={<AdminMetaPage />} />
          <Route path="/admin/bkash-config" element={<BKashConfigPage />} />
          <Route
            path="/admin/steadfast-config"
            element={<SteadFastConfigPag />}
          />

          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/adminlist" element={<AdminListPage />} />
          <Route path="/admin/createadmin" element={<CreateAdminPage />} />
          <Route path="/admin/edit/:id" element={<EditAdminPage />} />

          <Route
            path="/admin/incomplete-order"
            element={<AbandonedCartPage />}
          />
          <Route path="/admin/create-blog" element={<CreateBlogPage />} />

          <Route path="/admin/blogs" element={<BlogsListPage />} />

          <Route path="/admin/blogs/:id" element={<EditBlogPage />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
