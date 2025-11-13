// OrderReview.jsx
import React from "react";
import {FaPlus, FaTrash} from "react-icons/fa";
import ImageComponent from "./ImageComponent.jsx";
import { Link } from "react-router-dom";
import {FiMinus} from "react-icons/fi";

const OrderReview = ({ cart, removeFromCart, updateQuantity, formattedTotalAmount }) => {
  return (
    <div>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Order Review
      </h1>
      <div className="grid gap-4">
        {cart.map((item, index) => (
          <div
            key={`${item.id || item.productId || index}-${item.variant}`}
            className="grid grid-cols-3 gap-3 items-center shadow rounded-lg p-3 "
          >
            <div className="flex items-center justify-baseline gap-2">
              <button
                onClick={() => removeFromCart(item.productId, item.variant)}
                className="text-red-500 text-lg cursor-pointer"
              >
                <FaTrash />
              </button>
              <Link to={`/product/${item.slug}`}>
                <ImageComponent
                  imageName={item.thumbnail}
                  altName={item.name}
                  className="object-cover"
                  skeletonHeight={"100"}
                />
              </Link>
            </div>
            <div className="flex flex-col items-center justify-baseline gap-4">
              <Link to={`/product/${item.slug}`}>
                <h3 className="line-clamp-2 overflow-hidden text-ellipsis">
                  {item.name}
                </h3>
              </Link>
              {item.variant !== "Default" && <p>Size: {item.variant}</p>}
            </div>
            <div className="flex flex-col items-center justify-baseline gap-4">
              <div>
                {item.discountPrice > 0 ? (
                  <p>
                    Price: Tk.{" "}
                    {formattedTotalAmount(
                      item.discountPrice * item.quantity,
                    )}
                  </p>
                ) : (
                  <p>
                    Price: Tk.{" "}
                    {formattedTotalAmount(
                      item.originalPrice * item.quantity,
                    )}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center">
                  <button
                    className="primaryBgColor accentTextColor px-2 py-2 rounded-l cursor-pointer"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.variant,
                        item.quantity - 1,
                      )
                    }
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className={"px-3 py-1 bg-gray-200"}>
                    {item.quantity}
                  </span>
                  <button
                    className="primaryBgColor accentTextColor px-2 py-2 rounded-r cursor-pointer"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.variant,
                        item.quantity + 1,
                      )
                    }
                    disabled={item.quantity >= 5}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderReview;
