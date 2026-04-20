import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Sidebar from "./components/Sidebar.jsx";
import "./app.css";
import { useState, useEffect } from "react";
import Login from "./components/Login.jsx";
import FeaturesPage from "./components/FeaturesPage.jsx";
import AboutPage from "./components/AboutPage.jsx";
import Faq from "./components/Faq.jsx";
import UploadVideo from "./components/UploadVideo.jsx";
import Signup from "./components/Signup.jsx";

import PastGenerations from "./components/PastGenerations.jsx";

function App() {
  const [currTab, setCurrTab] = useState("Home");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    setCurrTab("Home");
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrTab("Login");
  };

  function changeTab(selectedTab) {
    setCurrTab(selectedTab);
    setSearchTerm(""); // Reset search on tab change
  }

  // Conditional content area
  let content;
  
  // Protected tabs
  const protectedTabs = ["Past Generations"];

  if (!user && protectedTabs.includes(currTab)) {
    content = <Login changeTab={changeTab} onLogin={handleLogin} />;
  } else if (currTab === "Home") {
    content = <UploadVideo token={token} user={user} changeTab={changeTab} />;
  } else if (currTab === "Past Generations") {
    content = <PastGenerations token={token} searchTerm={searchTerm} />;
  } else if (currTab === "Login") {
    content = <Login changeTab={changeTab} onLogin={handleLogin} />;
  } else if (currTab === "Features") {
    content = <FeaturesPage />;
  } else if (currTab === "About") {
    content = <AboutPage />;
  } else if (currTab === "Faq") {
    content = <Faq></Faq>;
  } else if (currTab === "Signup") {
    content = <Signup changeTab={changeTab} />;
  } else {
    content = (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Under Development Phase
      </h2>
    );
  }

  return (
    <div className="appContainor">
      <Sidebar changeTab={changeTab} currTab={currTab} user={user} onLogout={handleLogout} />
      <div className="content">
        <Header changeTab={changeTab} user={user} onLogout={handleLogout} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Render based on selected tab */}
        {content}

        <Footer changeTab={changeTab} />
      </div>
    </div>
  );
}

export default App;
