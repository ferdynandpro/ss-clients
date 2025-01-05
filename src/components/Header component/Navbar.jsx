import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPopup from "../login/LoginPopup";
import '../../assest/styles/components/navbar.css'

const Navbar = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  const toggleLoginPopup = () => {
    setShowLoginPopup(!showLoginPopup);
  };

  const handleLoginSuccess = () => {
    // Redirect ke dashboard admin setelah login berhasil
    navigate('/admin/dashboard/dashboard');
  };

  // Toogle Menu
  const [Toggle, showMenu] = useState(false);

  return (
    <header className="header">
      <nav className="nav container">
        {/* Isi menu */}
        <div className = {Toggle ? "nav__menu show-menu" : "nav__menu"}>
            <ul className="nav__list grid">
              
              <li className="nav__item">
                <a href="/" className="nav__link active-link">
                  <i className="uil uil-estate nav__icon"></i>
                  Home
                </a>
              </li>

              <li className="nav__item">
                <a href="/about" className="nav__link">
                  <i className="uil uil-user nav__icon"></i>
                  About Us
                </a>
              </li>

              <li className="nav__item">
                <a href="products" className="nav__link">
                  <i className="uil uil-estate nav__icon"></i>
                  Product
                </a>
              </li>

            </ul>
            <i className="uil uil-times nav__close" onClick={() => showMenu (!Toggle)}></i>
        </div>
        
        <a href="/" className="nav-logo">fydotstore</a>

        {/* Tombol Login */}
        <div className="nav--btn">
          <button className="btn--login" onClick={toggleLoginPopup}>Login</button>
          <button className="btn--sign">Sign In</button>
          <button className="btn--login">Support</button>
        </div>
      </nav>

      {/* Tampilkan popup login jika showLoginPopup true */}
      {showLoginPopup && <LoginPopup onClose={toggleLoginPopup} onLoginSuccess={handleLoginSuccess} />}
    </header>
  );
};

export default Navbar;
