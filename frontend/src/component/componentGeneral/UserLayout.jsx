import React, { useRef, useState } from "react";
import Layout from "./Layout.jsx";
import UserMenu from "./UserMenu.jsx";
import { FaUser } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const UserLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  return (
    <Layout>
      <div className={"xl:container xl:mx-auto p-3 flex gap-4 relative"}>
        {/*User Menu*/}
        <div className={"w-[350px] hidden lg:block"}>
          <UserMenu />
        </div>
        {/*User Menu Icon*/}
        <div className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-50 secondaryBgColor accentTextColor p-3 rounded-r-lg cursor-pointer">
          <FaUser
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={"text-2xl"}
          />
        </div>
        {/* Mobile Menu Overlay for User Menu */}
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
            className="relative bg-white w-64 h-full shadow-lg transform transition-transform duration-400 ease-in-out"
            style={{
              transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <button
              className={
                "absolute z-50 right-5 top-5 bg-white p-2 rounded-full"
              }
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MdClose className={"w-4 h-4"} />
            </button>
            <UserMenu />
          </div>
        </div>
        {/*Children Component Append Here*/}
        <main className="w-full">{children}</main>
      </div>
    </Layout>
  );
};

export default UserLayout;
