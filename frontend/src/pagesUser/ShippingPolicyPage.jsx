import React from "react";
import Layout from "../component/componentGeneral/Layout.jsx";

import PublicContentViewer from "../component/componentGeneral/PublicContentViewer.jsx";

const HomePage = () => {
  return (
    <Layout>
      <PublicContentViewer
        title="Shipping Policy"
        endpoint="shipping"
      />
    </Layout>
  );
};

export default HomePage;
