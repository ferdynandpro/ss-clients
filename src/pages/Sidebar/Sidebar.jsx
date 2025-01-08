import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdOutlineSpaceDashboard, MdOutlinePayment } from "react-icons/md";
import { FaBars, FaTimes } from 'react-icons/fa';
import ConfirmationModal from '../../components/Alert/ConfirmationModal'; // Import ConfirmationModal
import '../../assets/styles/components/sidebar.css';
import Logo from '../../assets/images/sumber-sari.png'

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState('');

  // Get role from localStorage when component mounts
  useEffect(() => {
    const userRole = localStorage.getItem('role'); // Assuming 'role' is saved in localStorage
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <>
      {/* Burger Button */}
      {!isSidebarOpen && (
        <div className='burger-button' onClick={() => setIsSidebarOpen(true)}>
          <FaBars />
        </div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar--logo">
          <img src={Logo} alt="sumber-sari-logo" />
          <a href="/admin/dashboard/dashboard" className="nav--logo">SUMBER LANCAR</a>
        </div>

        <div className="sidebar--comp">
          <NavLink to="dashboard" className={({ isActive }) => (isActive ? 'sb active-link' : 'sb')}>
            <MdOutlineSpaceDashboard className='sidebar--icon' />
            <span className='sidebar-link'>Menu Utama</span>
          </NavLink>

          <NavLink to="/admin/dashboard/data-pelanggan" className={({ isActive }) => (isActive ? 'sb active-link' : 'sb')}>
            <MdOutlinePayment className='sidebar--icon' />
            <span className='sidebar-link'>Data Pelanggan</span>
          </NavLink>

          <NavLink to="/admin/dashboard/product-list" className={({ isActive }) => (isActive ? 'sb active-link' : 'sb')}>
            <MdOutlinePayment className='sidebar--icon' />
            <span className='sidebar-link'>Data Produk</span>
          </NavLink>

          <NavLink to="/admin/dashboard/discount-page" className={({ isActive }) => (isActive ? 'sb active-link' : 'sb')}>
            <MdOutlinePayment className='sidebar--icon' />
            <span className='sidebar-link'>Diskon Pelanggan</span>
          </NavLink>

          {/* Show this link only if role is owner */}
          {role === 'owner' && (
            <NavLink to="/admin/dashboard/auth-list" className={({ isActive }) => (isActive ? 'sb active-link' : 'sb')}>
              <MdOutlinePayment className='sidebar--icon' />
              <span className='sidebar-link'>Data User</span>
            </NavLink>
          )}

          <NavLink to="/admin/dashboard/logs" className={({ isActive }) => (isActive ? 'sb active-link' : 'sb')}>
            <MdOutlinePayment className='sidebar--icon' />
            <span className='sidebar-link'>Logs</span>
          </NavLink>

          {/* Logout */}
          <button onClick={() => setShowLogoutConfirmation(true)} className="logout-btn">Logout</button>
        </div>

        {/* Close Button */}
        <div className='close-button' onClick={() => setIsSidebarOpen(false)}>
          <FaTimes className='close--logo' />
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirmation}
        message="Apakah Anda yakin ingin logout?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirmation(false)}
      />
    </>
  );
};

export default Sidebar;
