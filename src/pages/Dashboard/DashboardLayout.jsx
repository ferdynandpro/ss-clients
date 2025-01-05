import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import '../../assets/styles/components/dashboard-layout.css';
import CurrentDateTime from '../../components/additional/CurrentDateTime';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="outlet">
      <CurrentDateTime/>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
