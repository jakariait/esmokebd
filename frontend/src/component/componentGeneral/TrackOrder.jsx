import React, { useState } from "react";
import OrderProgress from "./OrderProgress";
import ImageComponent from "./ImageComponent";

const TrackOrder = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [orderNo, setOrderNo] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch(`${apiUrl}/track-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo, phone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to track order");
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(price);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center mt-30">
      {/*Input Form*/}
      <div className={"w-full p-4 shadow rounded-lg"}>
        <h1 className="text-3xl secondaryTextColor font-semibold mb-6 text-center">
          Track Your Order
        </h1>

        <form
          onSubmit={handleSubmit}
          className="w-full flex  items-center justify-center flex-col gap-10"
        >
          <div className={"flex flex-col md:flex-row gap-4"}>
            <input
              type="text"
              required
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              placeholder="Order Number (e.g., #123456)"
              className="  p-3 w-76 focus:outline-none bg-gray-100  rounded-md"
            />

            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
              className="p-3 w-76 focus:outline-none bg-gray-100  rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primaryBgColor px-4 py-2 accentTextColor rounded-md cursor-pointer  "
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </form>
      </div>

      {error && (
        <p className="text-red-600 mt-4 bg-red-100 p-2 rounded-md w-full text-center">
          {error}
        </p>
      )}

      {order && (
        <div className="mt-8 w-full pt-4 p-4 shadow rounded-lg">
          <h2 className="text-2xl secondaryTextColor font-semibold mb-4 flex justify-center items-center">
            Order Summary for Order No: {order.orderNo}
          </h2>

          <div
            className={
              "grid md:grid-cols-2 gap-4 items-center-center justify-center"
            }
          >
            <div className={"border-1 primaryBorderColor p-4 rounded-md "}>
              <p>Name: {order.shippingInfo?.fullName || "N/A"} </p>
              <p>Phone: {order.shippingInfo?.mobileNo || "N/A"}</p>
              <p>Address: {order.shippingInfo?.address || "N/A"}</p>
            </div>
            <div className={"border-1 primaryBorderColor p-4 rounded-md "}>
              <p>
                Order Status:{" "}
                <span
                  className={
                    "primaryBgColor accentTextColor px-2 py-1 rounded-md"
                  }
                >
                  {order.orderStatus.charAt(0).toUpperCase() +
                    order.orderStatus.slice(1)}
                </span>
              </p>
              <p>Total Items: {order.items.length}</p>
              <p>Grand Total: {formatPrice(order.totalAmount)}</p>
            </div>
          </div>

          <OrderProgress status={order.orderStatus} />

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Product Summary</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-3 rounded-lg bg-gray-50 "
                >
                  <div className="w-20 h-20 overflow-hidden rounded-md flex-shrink-0">
                    <ImageComponent
                      imageName={item.productId?.thumbnailImage}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-grow">
                    <p className="font-medium text-gray-800">
                      {item.productId?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Size: {item.productId?.variants?.[0]?.sizeName}
                    </p>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Qty: {item.quantity}</span>
                      <span>{formatPrice(item.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
