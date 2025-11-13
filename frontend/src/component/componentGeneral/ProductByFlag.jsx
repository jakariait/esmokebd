import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useProductStore from "../../store/useProductStore.js";
import useFlagStore from "../../store/useFlagStore.js";
import ProductList from "./ProductList.jsx";
import Skeleton from "react-loading-skeleton";
import { FaArrowRight } from "react-icons/fa";

const ProductByFlag = () => {
  const { homeProducts, loading: productsLoading } = useProductStore();
  const { flags, fetchFlags, loading: flagsLoading } = useFlagStore();

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  if (productsLoading || flagsLoading)
    return (
      <div className="xl:container xl:mx-auto p-4 justify-center md:justify-start">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          <Skeleton height={250} width="100%" />
          <Skeleton height={250} width="100%" />
          <Skeleton height={250} width="100%" />
          <Skeleton height={250} width="100%" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          <Skeleton height={250} width="100%" />
          <Skeleton height={250} width="100%" />
          <Skeleton height={250} width="100%" />
          <Skeleton height={250} width="100%" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          <Skeleton height={250} width="100%" />
          <Skeleton height={250} width="100%" />
          <Skeleton height={250} width="100%" />
          <Skeleton height={250} width="100%" />
        </div>
      </div>
    );

  return (
    <div className="xl:container xl:mx-auto p-4 justify-center md:justify-start">
      {flags.map((flag) => {
        const products = homeProducts[flag.name] || [];
        if (products.length === 0) return null; // Skip if no products for this flag

        const encodedFlag = encodeURIComponent(flag.name); // for URL safety
        const viewAllLink = `/shop?page=1&limit=20&flags=${encodedFlag}`;

        const slicedProducts = products.slice(0, 8); // Show max 8

        return (
          <div key={flag._id} className={"mb-5"}>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-grow h-px bg-gray-400"></div>
              <h2 className="text-lg pl-10 pr-10 font-bold secondaryTextColor whitespace-nowrap uppercase tracking-widest">
                {flag.name}
              </h2>
              <div className="flex-grow h-px bg-gray-400"></div>
            </div>

            {/* ✅ Render once with sliced products */}
            <ProductList products={slicedProducts} />
            <div className={"flex flex-wrap justify-center mt-5"}>
              {products.length > 8 && (
                <Link
                  to={viewAllLink}
                  className="primaryTextColor primaryBorderColor border-1 px-4 py-2 rounded"
                >
                  <div className="flex gap-6 justify-center items-center">
                    View All <FaArrowRight />
                  </div>
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductByFlag;