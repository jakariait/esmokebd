import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import CarouselStore from "../../store/CarouselStore.js";
import ImageComponent from "./ImageComponent.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GeneralInfoStore from "../../store/GeneralInfoStore.js";

const ProductCarousel = () => {
  const {
    CarouselStoreList,
    CarouselStoreListLoading,
    CarouselStoreListError,
  } = CarouselStore();

  const { GeneralInfoList } = GeneralInfoStore();

  const [products, setProducts] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(CarouselStoreList) && CarouselStoreList.length > 0) {
      setProducts(CarouselStoreList);
    }
  }, [CarouselStoreList]);

  const settings = {
    dots: false, // Disable dots
    infinite: products.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: products.length > 1,
    autoplaySpeed: 6000,
    pauseOnHover: false,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  useEffect(() => {
    if (sliderRef.current && products.length > 1) {
      sliderRef.current.slickPlay();
    }
  }, [products]);

  if (CarouselStoreListError) {
    return (
      <div className="primaryTextColor  container md:mx-auto text-center p-3">
        <h1 className={"p-44"}>
          Something went wrong! Please try again later.
        </h1>
      </div>
    ); // Display error message
  }
  return (
    <div className="product-carousel xl:container xl:mx-auto pb-4 px-3 relative">
      {CarouselStoreListLoading ? (
        <>
          <Skeleton height={400} width={"100%"} />
        </>
      ) : (
        <>
          <Slider ref={sliderRef} {...settings}>
            {products.map((product, index) => (
              <div key={index} className="relative">
                <ImageComponent
                  imageName={product.imgSrc}
                  className="w-full h-full object-cover"
                  skeletonHeight={400}
                  altName={GeneralInfoList?.CompanyEmail}
                />
              </div>
            ))}
          </Slider>
        </>
      )}
    </div>
  );
};

// Custom Arrow Components
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white p-2 rounded-full z-10"
  >
    <ChevronLeft size={30} />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white p-2 rounded-full z-10"
  >
    <ChevronRight size={30} />
  </button>
);

export default ProductCarousel;
