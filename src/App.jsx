import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Sidebar from "./components/Sidebar.jsx";
import "./app.css";
import { useState } from "react";
import Login from "./components/Login.jsx";
import FeaturesPage from "./components/FeaturesPage.jsx";
import AboutPage from "./components/AboutPage.jsx";
import Faq from "./components/Faq.jsx";
import UploadVideo from "./components/UploadVideo.jsx";
import Signup from "./components/SignUp.jsx";

import PastGenerations from "./components/PastGenerations.jsx";

function App() {
  let [currTab, setCurrTab] = useState("Home");

  function changeTab(selectedTab) {
    setCurrTab(selectedTab);
  }

  // Conditional content area
  let content;
  if (currTab === "Home") {
    content = <UploadVideo></UploadVideo>;
  } else if (currTab === "Past Generations") {
    content = <PastGenerations />;
  } else if (currTab === "Login") {
    content = <Login changeTab={changeTab}></Login>;
  } else if (currTab === "Features") {
    content = <FeaturesPage />;
  } else if (currTab === "About") {
    content = <AboutPage />;
  } else if (currTab === "Faq") {
    content = <Faq></Faq>;
  } else if (currTab === "Signup") {
    content = <Signup changeTab={changeTab}></Signup>;
  } else {
    content = (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Under Development Phase
      </h2>
    );
  }

  return (
    <div className="appContainor">
      <Sidebar changeTab={changeTab} currTab={currTab} />
      <div className="content">
        <Header changeTab={changeTab} />

        {/* Render based on selected tab */}
        {content}

        <Footer changeTab={changeTab} />
      </div>
    </div>
  );
}

export default App;
