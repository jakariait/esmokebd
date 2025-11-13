import React from "react";
import { Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";

const CheckoutHeader = ({ user }) => {
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col justify-between items-center gap-2 mb-6">
        <h1 className="text-2xl">Checkout</h1>

        {/* Breadcrumbs for navigation */}
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Typography color="text.primary">Checkout</Typography>
        </Breadcrumbs>

        {/* Login/Register prompt */}
        {!user && (
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-2 bg-yellow-100 p-3 rounded-lg">
            <div>Have an account? Please Login or Register</div>
            <div className="flex gap-6">
              <Link to="/login">
                <button className="primaryBgColor accentTextColor px-6 rounded-lg py-2 cursor-pointer">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="primaryBgColor accentTextColor px-6 rounded-lg py-2 cursor-pointer">
                  Register
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutHeader;
