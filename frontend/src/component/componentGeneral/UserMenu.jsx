import React, { useEffect } from "react";
import useAuthUserStore from "../../store/AuthUserStore";
import ImageComponent from "./ImageComponent.jsx";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  FaSignOutAlt,
  FaTachometerAlt,
  FaShoppingCart,
  FaHeart,
  FaTicketAlt,
  FaMapMarkedAlt,
  FaCreditCard,
  FaStar,
  FaLifeRing,
  FaUserCog,
  FaKey,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

const menuItems = [
  {
    icon: <FaTachometerAlt />,
    label: "Dashboard",
    path: "/user/home",
    active: true,
  },
  {
    icon: <FaShoppingCart />,
    label: "My orders",
    path: "/user/orders",
  },
  { icon: <FaTicketAlt />, label: "Promo/ Coupon", path: "/coupons" },
  {
    icon: <FaUserCog />,
    label: "Manage profile",
    path: "/user/manage-profile",
  },
  { icon: <FaKey />, label: "Change password", path: "/user/change-password" },
];
const UserMenu = () => {
  const { initialize, user, loading, error, logout } = useAuthUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect to login page after logout
  };

  if (error) {
    return <div className="p-10 text-red-500 text-center">{error}</div>;
  }
  return (
    <div>
      <div className="bg-white md:shadow-md rounded-xl p-4">
        {loading ? (
          <div className={"grid gap-2"}>
            <Skeleton height={200} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
          </div>
        ) : (
          <div>
            {/* Profile Box */}
            <div className="primaryBgColor accentTextColor rounded-xl p-2 py-5 flex flex-col items-center">
              {user?.userImage ? (
                <ImageComponent
                  imageName={user?.userImage}
                  className={
                    "w-24 h-24 rounded-full object-cover border-white border-4"
                  }
                />
              ) : (
                <span className="accentTextColor text-xl font-semibold w-24 h-24 rounded-full border-4 border-white flex items-center justify-center text-center">
                  {user?.fullName || "User"}
                </span>
              )}
              <h2 className="text-xl font-bold mt-2">
                {user?.fullName || "User"}
              </h2>
              <p className="text-sm mt-1">{user?.phone || user?.email}</p>
              <p className="text-sm">Reward Points: {user?.rewardPoints}</p>

              <button
                onClick={handleLogout}
                className="mt-4 accentBgColor primaryTextColor rounded-full py-2 px-5 flex items-center cursor-pointer gap-2"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>

            {/* Menu */}
            <nav className="mt-6 space-y-2">
              {menuItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer ${
                    item.active
                      ? "primaryBgColor accentTextColor"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.active && <span className="text-xl">→</span>}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu;
