import React, { useEffect, useState } from "react";
import ProductList from "./ProductList.jsx";

const RecentlyViewedProducts = ({ currentProductId, products = [] }) => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    // Exclude the currently viewed product
    const filtered = products.filter((item) => item._id !== currentProductId);

    setRecentProducts(filtered);
  }, [currentProductId, products]);

  if (recentProducts.length === 0) return null;

  return (
    <div className={"px-2 py-4  rounded-lg"}>
      <h1
        className={"text-2xl bg-gray-100 py-2  text-center secondaryTextColor"}
      >
        Recently Viewed
      </h1>

      <ProductList products={recentProducts} productPage={true} />
    </div>
  );
};

export default RecentlyViewedProducts;
