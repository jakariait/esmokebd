import {
  FaClock,
  FaCheckCircle,
  FaShippingFast,
  FaShoppingBag,
} from "react-icons/fa";

const OrderProgress = ({ status }) => {
  const steps = ["pending", "approved", "intransit", "delivered"];
  const currentIndex = steps.indexOf(status);

  const getIcon = (step) => {
    switch (step) {
      case "pending":
        return <FaClock className="text-lg" />;
      case "approved":
        return <FaCheckCircle className="text-lg" />;
      case "intransit":
        return <FaShippingFast className="text-lg" />;
      case "delivered":
        return <FaShoppingBag className="text-lg" />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-4">Order Progress</h4>
      <div className="flex justify-between items-center w-full">
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;

          return (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                  isActive ? "primaryBgColor accentTextColor" : "bg-gray-200 text-gray-400"
                }`}
              >
                {getIcon(step)}
              </div>
              <p
                className={`mt-1 text-sm capitalize transition ${
                  isActive ? "secondaryTextColor font-semibold" : "text-gray-400"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgress;
