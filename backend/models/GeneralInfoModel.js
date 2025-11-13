const mongoose = require("mongoose");

const DataSchema = mongoose.Schema(
  {
    PrimaryLogo: { type: String},
    SecondaryLogo: { type: String},
    Favicon: { type: String},
    CompanyName: { type: String },
    PhoneNumber: { type: [String] },
    CompanyEmail: { type: [String] },
    ShortDescription: { type: String },
    CompanyAddress: { type: String },
    GoogleMapLink: { type: String },
    PlayStoreLink: { type: String },
    AppStoreLink: { type: String },
    TradeLicense: { type: String },
    TINNumber: { type: Number },
    BINNumber: { type: Number },
    FooterCopyright: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const GeneralInfoModel = mongoose.model("GeneralInfo", DataSchema);

module.exports = GeneralInfoModel;

