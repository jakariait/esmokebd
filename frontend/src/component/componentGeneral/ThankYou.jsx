import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import axios from "axios";

const ThankYou = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${apiUrl}/order-no/${orderId}`);
        if (res.data.success) {
          const order = res.data.order;
          setOrder(order);

          window.dataLayer = window.dataLayer || [];

          // 🕒 Delay the push to allow GTM to be ready
          setTimeout(() => {
            window.dataLayer.push({
              event: "purchase",
              ecommerce: {
                transaction_id: order.orderNo,
                currency: "BDT",
                value: order.totalAmount,
                tax: order.vat,
                shipping: order.deliveryCharge,
                coupon: order.promoCode || "",
                items: order.items.map((item) => ({
                  item_name: item.productId?.name || "Unknown Product",
                  item_id: item.productId?.productId || "N/A",
                  price: item.price,
                  quantity: item.quantity,
                  item_variant: item.variantId || "Default",
                  item_category: item.productId?.category?.name || "N/A",
                  item_image: item.productId?.thumbnailImage || "",
                  item_size:
                    item.productId?.variants?.find(
                      (variant) => variant._id === item.variantId,
                    )?.sizeName || "N/A",
                })),
              },
            });
          }, 200); // Wait 200ms
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    };

    fetchOrder();
  }, [orderId, apiUrl]);

  return (
    <div className="flex items-center justify-center p-14">
      <div className="p-8 rounded-lg shadow text-center">
        <PackageCheck className="primaryTextColor mx-auto mb-4" size={120} />
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Order Successful!
        </h1>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Thank You!
        </h1>
        <p className="text-gray-600 mb-4">
          We received your order. We will be in touch and contact you soon.
        </p>
        <div className="bg-gray-200 p-4 rounded-md mb-6">
          <p className={"primaryTextColor text-lg"}>
            Order NO: {order?.orderNo || orderId}
          </p>
        </div>
        <div className={"flex flex-row gap-6 justify-center items-center"}>
          <Link
            to="/track-order"
            className="w-42 inline-block primaryBgColor accentTextColor px-6 py-2 rounded-lg"
          >
            Track My Order
          </Link>
          <Link
            to="/"
            className="w-42 inline-block primaryBgColor accentTextColor px-6 py-2 rounded-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
