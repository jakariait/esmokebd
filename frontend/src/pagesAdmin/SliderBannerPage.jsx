import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import CarouselUpload from "../component/componentAdmin/CarouselUpload.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import FeatureImageAdmin from "../component/componentAdmin/FeatureImageAdmin.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

// Create a QueryClient instance
const queryClient = new QueryClient();

const SliderBannerPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb
        title={"View All Sliders and Banners"}
        pageDetails={"WEBSITE CONFIG"}
      />
      <RequirePermission permission="sliders-banners">
        <CarouselUpload />
        <FeatureImageAdmin />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default SliderBannerPage;
