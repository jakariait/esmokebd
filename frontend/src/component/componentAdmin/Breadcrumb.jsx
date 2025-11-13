import React, { useEffect, useRef, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import SidebarMenu from "./SidebarMenu.jsx";
import { IoIosLogOut } from "react-icons/io";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import { useNavigate } from "react-router-dom";

const Breadcrumb = ({ pageDetails, title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null); // Use ref for the button

  // Function to handle click outside the menu
  const handleClickOutside = (event) => {
    // Check if click is outside menu
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !hamburgerRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }

    // Check if click is outside the dropdown and button
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  };

  // Add event listener to detect outside clicks when menu or dropdown is open
  useEffect(() => {
    if (isMenuOpen || isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isDropdownOpen]);

  // Function to toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
  const { admin, logout, initialize } = useAuthAdminStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize the admin data when the component mounts
    initialize();
  }, [initialize]);

  // Logout function to clear the admin state and navigate to login
  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };
  return (
    <div className="bg-white shadow rounded-lg mb-5 p-2 lg:p-5 mt-1 flex justify-between items-center">
      <div className={"lg:hidden"} ref={hamburgerRef}>
        <GiHamburgerMenu
          className="text-2xl cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Background Overlay */}
        <div
          className="absolute inset-0 bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          ref={menuRef}
          className="relative bg-white w-fit h-full shadow-lg transform transition-transform duration-400 ease-in-out"
          style={{
            transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <div className={"primaryBgColor accentTextColor flex flex-col "}>
            <SidebarMenu />
          </div>
        </div>
      </div>

      <div>
        <div className="lg:flex items-center gap-2 mb-2 hidden ">
          <span className="text-sm font-medium">PAGES</span>
          <span className="text-xl font-bold">
            <AiOutlineArrowRight />
          </span>
          <span className="text-sm font-medium">{pageDetails}</span>
        </div>
        <span className="lg:text-lg font-medium">{title}</span>
      </div>

      <div className="flex items-center gap-2 lg:gap-6 mb-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#2C3A4D] px-1 lg:px-4 py-2 rounded-md text-white flex items-center justify-center lg:gap-2 gap-1"
        >
          <IoIosSend className="text-2xl" />
          <span>Visit Website</span>
        </a>

        <div className="items-center gap-2 mb-2 relative">
          <button
            ref={buttonRef} // Attach ref here
            onClick={toggleDropdown} // Use toggleDropdown to control dropdown state
            className={"flex items-center gap-2 cursor-pointer"}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLwzhli3UiGlUsTtOAoxA_f4dKRDG9DGa99w&s"
              alt=""
              className={"w-10 h-10 rounded-full"}
              id="button"
            />
            <div className={"hidden lg:flex items-center"}>
              <span>{admin?.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-200 ${
                  isDropdownOpen ? "transform rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full right-0 mt-5 bg-white shadow-lg z-100 rounded-md p-2"
            >
              <div className={"flex items-center justify-around gap-1 p-3"}>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 w-42 text-white px-2 py-2 rounded flex items-center justify-center lg:gap-2 cursor-pointer"
                >
                  <IoIosLogOut className="text-2xl" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
