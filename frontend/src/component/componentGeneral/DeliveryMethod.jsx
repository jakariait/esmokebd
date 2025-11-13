import React from "react";

const DeliveryMethod = ({ freeDelivery, formattedTotalAmount }) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor pl-2 text-lg font-semibold">
        Delivery Method
      </h1>

      <div className="flex flex-col gap-2">
        <label className=" border border-gray-300 rounded-lg px-4 py-2 cursor-pointer transition duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                className="primaryAccentColor w-5 h-5"
                checked
                readOnly
              />
              <span>
                Home Delivery{" "}
                {freeDelivery > 0 && (
                  <span className="text-sm text-gray-600">
                    (Enjoy free delivery on purchases of{" "}
                    <span className="text-red-500">
                      Tk. {formattedTotalAmount(freeDelivery)}
                    </span>{" "}
                    or more!)
                  </span>
                )}
              </span>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default DeliveryMethod;
