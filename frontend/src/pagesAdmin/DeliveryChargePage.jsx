import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import DeliveryCharge from "../component/componentAdmin/DeliveryCharge.jsx";
import CreateShippingDialog from "../component/componentAdmin/CreateShipping.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const DeliveryChargePage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb
        pageDetails="DELIVERY CHARGE"
        title="View All Deivery Charges"
      />
      <RequirePermission permission="delivery_charges">
        <div className="flex flex-col gap-16">
          <CreateShippingDialog />
          <DeliveryCharge />
        </div>
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default DeliveryChargePage;
