// ShippingOptions.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ShippingOptions = ({ onShippingChange }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [shipping, setShipping] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch shipping options
  useEffect(() => {
    const fetchShipping = async () => {
      try {
        const res = await axios.get(`${apiUrl}/getAllShipping`);
        if (res.data.success) {
          setShipping(res.data.data);
          setMessage(res.data.message);
        } else {
          setMessage("Failed to fetch shipping options.");
        }
      } catch (err) {
        setMessage("An error occurred while fetching shipping options.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipping();
  }, []);

  // Set default shipping option
  useEffect(() => {
    if (shipping.length > 0) {
      const defaultOption = shipping[0];
      setSelectedShipping(defaultOption.value);
      onShippingChange({
        name: defaultOption.name,
        value: defaultOption.value,
        id: defaultOption._id,
      });
    }
  }, [shipping]);


  const handleChange = (option) => {
    setSelectedShipping(option.value);
    onShippingChange({ name: option.name, value: option.value, id: option._id }); // Send both
  };


  return (
    <div className={"flex flex-col gap-4"}>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor pl-2 text-lg font-semibold">
        Select Shipping Option
      </h1>

      {loading ? (
        <div className="text-gray-500">Loading shipping options...</div>
      ) : message && shipping.length === 0 ? (
        <div className="text-red-500">{message}</div>
      ) : (
        shipping.map((option, index) => (
          <label
            key={index}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer transition duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  value={option.value}
                  checked={selectedShipping === option.value}
                  onChange={() => handleChange(option)}
                  className="primaryAccentColor w-5 h-5"
                />
                {option.name}
              </div>
              <div>Tk. {option.value}</div>
            </div>
          </label>
        ))
      )}
    </div>
  );
};

export default ShippingOptions;
