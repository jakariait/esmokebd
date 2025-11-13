import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaChartPie,
  FaBoxOpen,
} from "react-icons/fa";

const CourierStats = ({ phone }) => {
  const [courierData, setCourierData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(() => {
    if (!phone) return;

    const fetchCourierStats = async () => {
      setLoading(true);
      setError("");
      setCourierData(null);

      try {
        const response = await axios.post(
          `${apiUrl}/courier-check`,
          { phone }
        );

        if (response.data.status === "success") {
          setCourierData(response.data.courierData);
        } else {
          setError("No data found.");
        }
      } catch (err) {
        setError("Error fetching data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourierStats();
  }, [phone]);

  const StatCard = ({ name, data }) => (
    <div className="bg-white rounded shadow p-5 hover:shadow-md transition duration-300 ">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold capitalize text-gray-800 flex items-center gap-2">
          <FaTruck className="text-blue-500" />
          {name}
        </h3>
        <span
          className={`text-sm font-semibold px-2 py-1 rounded-full ${
            data.success_ratio >= 80
              ? "bg-green-100 text-green-700"
              : data.success_ratio >= 50
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {data.success_ratio}% Success
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-700">
        <p className="flex items-center gap-2">
          <FaBoxOpen className="text-gray-500" />
          <span>Total Parcel:</span> {data.total_parcel}
        </p>
        <p className="flex items-center gap-2 text-green-600">
          <FaCheckCircle /> Success: {data.success_parcel}
        </p>
        <p className="flex items-center gap-2 text-red-500">
          <FaTimesCircle /> Cancelled: {data.cancelled_parcel}
        </p>
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className={`h-2 rounded-full ${
              data.success_ratio >= 80
                ? "bg-green-500"
                : data.success_ratio >= 50
                  ? "bg-yellow-400"
                  : "bg-red-400"
            }`}
            style={{ width: `${data.success_ratio}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 rounded-lg shadow bg-white">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Courier Performance Dashboard
      </h1>
      {loading && <p className="text-center text-blue-600">Loading data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {courierData && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(courierData)
              .filter(([key]) => key !== "summary")
              .map(([key, value]) => (
                <StatCard key={key} name={key} data={value} />
              ))}
          </div>

          {/* Summary Section */}
          <div className="mt-10 bg-white  rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
              <FaChartPie className="text-indigo-500" /> Overall Summary
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-gray-700 font-medium">
              <div className="bg-gray-100 p-4 rounded">
                <p>Total Parcel</p>
                <p className="text-xl font-bold">
                  {courierData.summary.total_parcel}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded">
                <p>Success Parcel</p>
                <p className="text-xl font-bold text-green-700">
                  {courierData.summary.success_parcel}
                </p>
              </div>
              <div className="bg-red-100 p-4 rounded">
                <p>Cancelled Parcel</p>
                <p className="text-xl font-bold text-red-600">
                  {courierData.summary.cancelled_parcel}
                </p>
              </div>
              <div className="bg-indigo-100 p-4 rounded">
                <p>Success Ratio</p>
                <p className="text-xl font-bold text-indigo-700">
                  {courierData.summary.success_ratio}%
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mt-6 mx-auto max-w-3xl">
              <div
                className="h-3 rounded-full bg-indigo-500"
                style={{ width: `${courierData.summary.success_ratio}%` }}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CourierStats;
