import React, { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import useTitle from "../hooks/useTitle";

const Dashboard = () => {
  useTitle("Dashboard | TodoList");

  const [isState, setIsState] = useState("pending");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile toggle

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          setIsState={setIsState}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <MainContent isState={isState} />
      </div>
    </div>
  );
};

export default Dashboard;
