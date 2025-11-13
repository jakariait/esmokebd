import React from "react";
import useCartStore from "../../store/useCartStore.js";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import ImageComponent from "./ImageComponent.jsx";
import { FiMinus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import emptyCart from "../../assets/empty_cart.png";

const Cart = ({ onCloseCartMenu }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  // Calculate the total price of all items in the cart
  const totalAmount = cart.reduce((total, item) => {
    const price =
      item.discountPrice > 0 ? item.discountPrice : item.originalPrice;
    return total + price * item.quantity;
  }, 0);

  // Format the totalAmount with commas for better readability
  const formattedTotalAmount = (amount) => {
    return Number(amount).toLocaleString();
  };



  // console.table(cart);

  return (
    <div className="py-3">
      {cart.length === 0 ? (
        <div className="flex items-center justify-center h-[800px] p-4">
          <div className="flex flex-col items-center text-center">
            <img src={emptyCart} alt="Empty Cart" className="w-48 h-auto" />
            <p>There are no more items in your cart!</p>

            <button
              className="primaryBgColor accentTextColor px-6 py-2 rounded mt-4 cursor-pointer"
              onClick={onCloseCartMenu}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {cart.map((item) => (
            <div
              key={`${item.id || item.productId || index}-${item.variant}`}
              className="grid grid-cols-2 gap-3 border-t border-dashed py-2"
            >
              {/*Product Thumbnail*/}

              <Link to={`/product/${item.slug}`}>
                <ImageComponent
                  imageName={item.thumbnail}
                  altName={item.name}
                  className="object-cover"
                />
              </Link>

              <div className="flex-1">
                <div className="flex flex-col gap-2">
                  <Link to={`/product/${item.slug}`}>
                    <h3 className="line-clamp-2 overflow-hidden text-ellipsis hover:underline">
                      {item.name}
                    </h3>
                  </Link>

                  {/*Original Price*/}
                  <p>
                    Price: Tk.{" "}
                    {formattedTotalAmount(item.originalPrice * item.quantity)}
                  </p>
                  {/*Discount Price*/}
                  {item.discountPrice > 0 && (
                    <p className={"text-red-800"}>
                      Offer Price: Tk.{" "}
                      {formattedTotalAmount(item.discountPrice * item.quantity)}
                    </p>
                  )}
                  {/*Discount Amount*/}
                  {item.discountPrice > 0 && (
                    <p>
                      You Save: Tk.{" "}
                      {formattedTotalAmount(
                        item.originalPrice - item.discountPrice,
                      )}
                    </p>
                  )}
                  {item.variant !== "Default" && <p>Size: {item.variant}</p>}
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center">
                      {/*Decrease Button*/}
                      <button
                        className="primaryBgColor accentTextColor px-2 py-2 rounded-l cursor-pointer"
                        onClick={() =>
                          updateQuantity(
                            item.productId, // <-- FIXED
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
                      {/*Increase Button*/}
                      <button
                        className="primaryBgColor accentTextColor px-2 py-2 rounded-r cursor-pointer"
                        onClick={() =>
                          updateQuantity(
                            item.productId, // <-- FIXED
                            item.variant,
                            item.quantity + 1,
                          )
                        }
                        disabled={item.quantity >= 5}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    {/*Delete Button*/}
                    <div>
                      <button
                        onClick={() =>
                          removeFromCart(item.productId, item.variant)
                        } // <-- FIXED
                        className="text-red-500 text-lg cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between py-4 items-center gap-2 border-b border-t border-dashed">
            <h1 className="text-center">Totals</h1>
            <span className="text-center">
              Tk {formattedTotalAmount(totalAmount)}
            </span>
          </div>

          <button
            onClick={clearCart}
            className="bg-red-500 text-white py-2 px-4 rounded cursor-pointer"
          >
            Clear Cart
          </button>
          <Link
            to="/checkout"
            className="primaryBgColor accentTextColor text-center py-2 px-4 rounded"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
