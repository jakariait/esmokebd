import React from "react";

const OrderSummary = ({
	totalItems,
	totalAmount,
	rewardPointsUsed,
	actualShippingCost,
	grandTotal,
	formattedTotalAmount,
	showRewardPoints,
	discount,
	appliedCoupon,
	vatAmount,
	vatPercentage,
}) => {
	return (
		<div className="shadow bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg p-4 flex flex-col justify-between">
			<h3 className="font-medium text-lg text-center">Order Summary</h3>

			<div className="flex flex-col w-full gap-1">
				<div className="flex justify-between">
					<div>Total Items:</div>
					<div>{totalItems}</div>
				</div>

				<div className="flex justify-between">
					<div>Total Amount:</div>
					<div>Tk. {formattedTotalAmount(totalAmount)}</div>
				</div>

				{showRewardPoints && rewardPointsUsed > 0 && (
					<div className="flex justify-between">
						<div>Reward Points Used:</div>
						<div>{rewardPointsUsed}</div>
					</div>
				)}

				{discount > 0 && (
					<div className="flex justify-between">
						<span>
							Coupon Discount{" "}
							<span className={"text-xs"}>({appliedCoupon.code})</span>
						</span>
						<span className="text-green-600">
							-Tk. {formattedTotalAmount(discount)}
						</span>
					</div>
				)}

				<div className="flex justify-between">
					<div>Shipping:</div>
					<div>Tk. {formattedTotalAmount(actualShippingCost)}</div>
				</div>

				{vatPercentage > 0 && (
					<div className="flex justify-between">
						<span>Tax/VAT ({vatPercentage}%)</span>
						<span>Tk. {formattedTotalAmount(vatAmount)}</span>
					</div>
				)}

				<div className="flex justify-between font-semibold">
					<div>Grand Total:</div>
					<div>Tk. {formattedTotalAmount(grandTotal)}</div>
				</div>
			</div>
		</div>
	);
};

export default OrderSummary;
