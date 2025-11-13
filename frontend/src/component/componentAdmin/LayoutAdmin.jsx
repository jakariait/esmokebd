import React from "react";
import SidebarMenu from "./SidebarMenu.jsx";
import Footer from "./footer.jsx";

const LayoutAdmin = ({ children, breadcrumbData }) => {
	return (
		<div className="flex flex-col min-h-screen xl:container xl:mx-auto">
			{/* Sidebar */}
			<div className="primaryBgColor accentTextColor hidden lg:block fixed h-screen overflow-y-auto">
				<SidebarMenu />
			</div>

			{/* Main Content */}
			<div className="flex-1 lg:ml-65 p-2 lg:p-4">
				<main>{children}</main>
			</div>
			<div className="mb-3 lg:ml-65 mr-3">
				<Footer />
			</div>
		</div>
	);
};

export default LayoutAdmin;
