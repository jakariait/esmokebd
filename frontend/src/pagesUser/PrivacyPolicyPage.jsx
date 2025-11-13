import React from "react";
import Layout from "../component/componentGeneral/Layout.jsx";

import PublicContentViewer from "../component/componentGeneral/PublicContentViewer.jsx";

const HomePage = () => {
  return (
    <Layout>
      <PublicContentViewer
        title="Privacy Policy"
        endpoint="privacy"
      />
    </Layout>
  );
};

export default HomePage;
