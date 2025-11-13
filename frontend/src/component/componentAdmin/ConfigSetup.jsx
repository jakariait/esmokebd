import React from "react";
import UpdateFreeDeliveryAmount from "./UpdateFreeDeliveryAmount.jsx";
import UpdateTaxPercentage from "./UpdateTaxPercentage.jsx";
import UpdateGTM from "./UpdateGTM.jsx";

const ConfigSetup = () => {
  return (
    <div className={"shadow rounded-lg p-4"}>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6  pl-2 text-lg font-semibold">
        Update Setup Config
      </h1>
      <div className={"grid md:grid-cols-2 gap-6"}>
        <UpdateFreeDeliveryAmount />
        <UpdateTaxPercentage />
        <UpdateGTM/>
      </div>
    </div>
  );
};

export default ConfigSetup;
