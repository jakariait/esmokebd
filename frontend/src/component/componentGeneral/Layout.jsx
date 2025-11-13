import Headers from "./Headers.jsx";
import MenuBar from "./MenuBar.jsx";
import Footer from "./Footer.jsx";
import MarqueeModern from "./MarqueeModern.jsx";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <MarqueeModern/>
      {/* Header Section */}
      <Headers />
      
      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Layout;
