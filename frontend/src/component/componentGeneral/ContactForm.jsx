import React, { useEffect, useState } from "react";
import SocialMedia from "./SocialMedia.jsx";
import GeneralInfoStore from "../../store/GeneralInfoStore.js";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdEmail, MdOutlinePhoneInTalk } from "react-icons/md";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const ContactForm = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { GeneralInfoList, GeneralInfoListLoading, GeneralInfoListError } =
    GeneralInfoStore();
  // State to manage form data
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    message: "",
  });
  // State to manage form submission status
  const [status, setStatus] = useState("");
  const [isStatusVisible, setIsStatusVisible] = useState(true);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Modified handleSubmit to reset visibility
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsStatusVisible(true); // Reset visibility on new submission
    setStatus("Submitting...");
    try {
      const response = await axios.post(`${apiUrl}/contacts`, formData);
      if (response.status >= 200 && response.status < 300) {
        setStatus(
          "Thank you for reaching out! Your message has been received.",
        );
        setFormData({
          fullName: "",
          phoneNumber: "",
          emailAddress: "",
          message: "",
        });
      } else {
        setStatus("Submission failed. Please try again.");
      }
    } catch (error) {
      setStatus("Submission failed. Please try again.");
    }
  };

  // Update useEffect to handle status visibility properly
  useEffect(() => {
    if (status) {
      setIsStatusVisible(true);
      const timer = setTimeout(() => {
        setIsStatusVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);
  if (GeneralInfoListError) {
    return (
      <div className="primaryTextColor  container md:mx-auto text-center p-3">
        <h1 className={"p-40"}>
          Something went wrong! Please try again later.
        </h1>
      </div>
    ); // Display error message
  }
  return (
    <div className="container mx-auto mb-3 mt-3 shadow rounded-lg">
      {GeneralInfoListLoading ? (
        <>
          <Skeleton height={150} width={"100%"} />
          <div className={"grid grid-rows-1 md:grid-cols-2 gap-3"}>
            <Skeleton height={350} width={"100%"} />
            <Skeleton height={350} width={"100%"} />
          </div>
          <Skeleton height={300} width={"100%"} />
        </>
      ) : (
        <>
          {/* Breadcrumb Section */}
          <div className="flex flex-col items-center justify-center p-6 md:p-10 gap-3">
            <h1 className="text-2xl">Contact Us</h1>
            <Breadcrumbs aria-label="breadcrumb">
              <Link component={RouterLink} to="/" color="inherit">
                Home
              </Link>
              <Typography color="text.primary">Contact Us</Typography>
            </Breadcrumbs>
          </div>

          <div className="p-3">
            {/* Title Section */}
            <div className="pb-6">
              <h1 className="text-3xl relative pb-2">
                Get In Touch
                <span className="absolute left-0 bottom-0 w-16 border-b-2 border-black"></span>
              </h1>
            </div>

            {/* Contact Details + Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
              {/* Contact Details Section */}
              <div className="primaryBgColor accentTextColor rounded-lg p-6 md:p-10 flex flex-col gap-4 w-full h-full">
                <h1 className="text-xl pb-2">Contact Us</h1>
                <div className="flex items-center gap-2">
                  <MdOutlinePhoneInTalk className="text-2xl md:text-3xl" />
                  <div className="flex flex-col text-sm">
                    {GeneralInfoList?.PhoneNumber.map((number, index) => (
                      <a key={index} href={`tel:${number}`} className="mr-2">
                        {number}
                      </a>
                    ))}
                  </div>
                </div>

                <h1 className="text-xl pb-2 mt-4">Email Address</h1>
                <div className="flex items-center gap-2">
                  <MdEmail className="text-2xl md:text-3xl" />
                  <div className="flex flex-col text-sm">
                    {GeneralInfoList?.CompanyEmail.map((email, index) => (
                      <a key={index} href={`mailto:${email}`} className="mr-2">
                        {email}
                      </a>
                    ))}
                  </div>
                </div>

                <h1 className="text-xl pb-2 mt-4">Office Location</h1>
                <div className="flex items-center gap-2">
                  <HiOutlineBuildingOffice2 className="text-2xl md:text-3xl" />
                  <span className="text-sm">
                    {GeneralInfoList?.CompanyAddress}
                  </span>
                </div>

                <h1 className="text-xl pb-2 mt-4">Follow Us</h1>
                <SocialMedia />
              </div>

              {/* Contact Form Section */}
              <div className="rounded-lg bg-white shadow p-6 md:p-10 w-full h-full flex flex-col">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                  Contact Me
                </h1>
                <form className="space-y-6 flex-grow" onSubmit={handleSubmit}>
                  {/* Full Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your Full Name"
                      required={true}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone Number Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+880*******"
                        required={true}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleInputChange}
                        placeholder="demo@email.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Write Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                      placeholder="Type your message here..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="primaryBgColor accentTextColor py-2 px-4 w-full md:w-auto rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Submit Now
                  </button>
                </form>
                {/* Status Message */}
                {isStatusVisible && (
                  <div className="mt-4 text-center">
                    <p
                      className={`text-lg ${status.includes("failed") ? "text-red-500" : "primaryTextColor"}`}
                    >
                      {status}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Google Map Section */}
          {GeneralInfoList?.GoogleMapLink && (
            <div className="w-full h-60 md:h-96">
              <iframe
                className="w-full h-full border-0"
                src={GeneralInfoList?.GoogleMapLink}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContactForm;
