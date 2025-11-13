import React, {useCallback, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import ImageComponent from "./ImageComponent.jsx";
import {FaEye} from "react-icons/fa";
import ProductGallery from "./ProductGallery.jsx";
import ProductAddToCart from "./ProductAddToCart.jsx";

// Memoize the formatted price function
const formatPrice = (price) => {
  if (isNaN(price)) return price;
  return price.toLocaleString();
};

const ProductList = ( {products}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleOpen = (product) => {
    setSelectedProduct(product);
  };

  const handleClose = () => {
    setSelectedProduct(null);
  };
  const calculateDiscountPercentage = (
    priceBeforeDiscount,
    priceAfterDiscount,
  ) => {
    if (
      !priceBeforeDiscount ||
      !priceAfterDiscount ||
      priceBeforeDiscount <= priceAfterDiscount
    )
      return 0;
    const discountAmount = priceBeforeDiscount - priceAfterDiscount;
    return Math.ceil((discountAmount / priceBeforeDiscount) * 100);
  };
  return (

    <div>
      {products.filter((product) => product.isActive).length === 0 ? (
        <Typography
          variant="body1"
          className="text-center text-gray-500 p-20 md:p-70 shadow rounded-lg"
        >
          No products found. Please check back later!
        </Typography>
      ) : (
        <div
          className={
            "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4"
          }
        >
          {/*Product Display Section*/}
          {products
            .map((product) => (
              <div key={product.slug} className="relative">
                <Link to={`/product/${product.slug}`}>
                  <ImageComponent
                    imageName={product.thumbnailImage}
                    altName={product.name}
                    skeletonHeight={250}
                  />
                </Link>
                <Link to={`/product/${product.slug}`}>
                  <div className="text-center mt-2 mb-1 hover:underline">
                    {product.name}
                  </div>
                </Link>

                <div className="flex gap-2 justify-center">
                  {/*Base Price*/}
                  {product.variants?.length ? (
                    product.variants[0].discount > 0 ? (
                      <div className="line-through">
                        Tk. {formatPrice(Number(product.variants[0].price))}
                      </div>
                    ) : (
                      <div>
                        Tk. {formatPrice(Number(product.variants[0].price))}
                      </div>
                    )
                  ) : product.finalDiscount > 0 ? (
                    <div className="line-through">
                      Tk. {formatPrice(Number(product.finalPrice))}
                    </div>
                  ) : (
                    <div>Tk. {formatPrice(Number(product.finalPrice))}</div>
                  )}

                  {/*Discount Price*/}
                  {product.variants?.length
                    ? product.variants[0].discount > 0 && (
                    <div className="text-red-800">
                      Tk.{" "}
                      {formatPrice(
                        Number(product.variants[0].discount),
                      )}
                    </div>
                  )
                    : product.finalDiscount > 0 && (
                    <div className="text-red-800">
                      Tk. {formatPrice(Number(product.finalDiscount))}
                    </div>
                  )}
                </div>

                {/* Discount Percentage */}
                <div className="absolute top-1 z-10">
                  {product.variants?.length > 0
                    ? product.variants[0].discount > 0 && (
                    <span className="bg-red-400 px-2 py-1 text-white">
                              -
                      {calculateDiscountPercentage(
                        product.variants[0].price,
                        product.variants[0].discount,
                      )}
                      %
                            </span>
                  )
                    : product.finalDiscount > 0 && (
                    <span className="bg-red-400 px-2 py-1 text-white">
                              -
                      {calculateDiscountPercentage(
                        product.finalPrice,
                        product.finalDiscount,
                      )}
                      %
                            </span>
                  )}
                </div>

                {/* Quick View Button */}
                <div className="absolute top-1 right-0 z-10 bg-white rounded-full flex justify-center items-center">
                  <button
                    onClick={() => handleOpen(product)} // Pass the product to set the state
                    className="p-2 cursor-pointer"
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}

          {/* Quick View Modal */}
          {selectedProduct && (
            <Dialog
              open={Boolean(selectedProduct)}
              onClose={handleClose}
              maxWidth="md"
              fullWidth
            >
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
              <DialogContent>
                <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                  <ProductGallery
                    images={selectedProduct.images}
                    discount={calculateDiscountPercentage(
                      selectedProduct.finalPrice,
                      selectedProduct.finalDiscount,
                    )}
                    zoom={false}
                  />
                  <div>
                    <ProductAddToCart product={selectedProduct} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;