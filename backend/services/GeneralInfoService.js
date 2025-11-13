const GeneralInfoModel = require("../models/GeneralInfoModel");
const mongoose = require("mongoose");
const path = require("path");

// Get General Info (Only One Entry)
const getGeneralInfo = async (req, res) => {
  return GeneralInfoModel.findOne({});
};

// Create or Update General Info

const updateGeneralInfo = async (data, files) => {
  try {
    let generalInfo = await GeneralInfoModel.findOne({});

    const PrimaryLogo = files?.PrimaryLogo?.[0]?.filename || generalInfo?.PrimaryLogo;
    const SecondaryLogo = files?.SecondaryLogo?.[0]?.filename || generalInfo?.SecondaryLogo;
    const Favicon = files?.Favicon?.[0]?.filename || generalInfo?.Favicon;

    if (!generalInfo) {
      generalInfo = new GeneralInfoModel({
        PrimaryLogo,
        SecondaryLogo,
        Favicon,
        ...data,
        PhoneNumber: Array.isArray(data.PhoneNumber) ? data.PhoneNumber : data.PhoneNumber.split(","),
        CompanyEmail: Array.isArray(data.CompanyEmail) ? data.CompanyEmail : data.CompanyEmail.split(","),
      });
    } else {
      generalInfo.PrimaryLogo = PrimaryLogo;
      generalInfo.SecondaryLogo = SecondaryLogo;
      generalInfo.Favicon = Favicon;
      generalInfo.CompanyName = data.CompanyName;
      generalInfo.PhoneNumber = Array.isArray(data.PhoneNumber) ? data.PhoneNumber : data.PhoneNumber.split(",");
      generalInfo.CompanyEmail = Array.isArray(data.CompanyEmail) ? data.CompanyEmail : data.CompanyEmail.split(",");
      generalInfo.ShortDescription = data.ShortDescription;
      generalInfo.CompanyAddress = data.CompanyAddress;
      generalInfo.GoogleMapLink = data.GoogleMapLink;
      generalInfo.PlayStoreLink = data.PlayStoreLink;
      generalInfo.AppStoreLink = data.AppStoreLink;
      generalInfo.TradeLicense = data.TradeLicense;
      generalInfo.TINNumber = data.TINNumber;
      generalInfo.BINNumber = data.BINNumber;
      generalInfo.FooterCopyright = data.FooterCopyright;
    }

    await generalInfo.save();
    return generalInfo;
  } catch (error) {
    console.error("Error updating General Info:", error);
    throw new Error("Failed to update General Info: " + error.message);
  }
};

// Delete General Info
const deleteGeneralInfo = async (req, res) => {
  return GeneralInfoModel.deleteMany({});
};

// Export service functions
module.exports = {
  getGeneralInfo,
  updateGeneralInfo,
  deleteGeneralInfo,
};
