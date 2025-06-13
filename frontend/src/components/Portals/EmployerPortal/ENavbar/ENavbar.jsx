import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";
import "./ENavbar.css";
import logo from "../../../../assets/images/EmployerPortalLogo.png";

const EmployerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const closeMenu = () => setIsOpen(false);

  const handleSettingsClick = () => {
    navigate("/Employer-Portal/settings");
  };

  return (
    <nav className="bg-[#1E1E1E] text-white shadow-lg relative z-50 flex items-center justify-between px-4 py-2 navbar-container-main" style={{ display: "flex", justifyContent: "space-between" }}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button
          className="md:hidden text-white focus:outline-none z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logo */}
        <Link
          to="/Employer-Portal"
          className="flex items-center space-x-2"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="Employer Portal Logo"
            className="employer-logo"
          />
        </Link>
      </div>

      {isOpen && <div className="mobile-menu-overlay" onClick={closeMenu}></div>}

      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <div className="mobile-menu-container">
          {menuItems.map(({ path, label }) => (
            <NavItem key={path} to={path} mobile onClick={closeMenu}>
              {label}
            </NavItem>
          ))}
        </div>
      </div>

      <button className="settings-icon" onClick={handleSettingsClick}>
        <Settings size={24} />
      </button>
    </nav>
  );
};

const menuItems = [
  { path: "/", label: "Home" },
  { path: "/Employer-Portal", label: "Dashboard" },
  { path: "/Employer-Portal/settings", label: "Settings" },
];

const NavItem = ({ to, children, mobile = false, onClick }) => (
  <Link
    to={to}
    className={`flex px-4 py-2 rounded-lg ${
      mobile
        ? "text-white hover:bg-[#3A7DFF] transition duration-300"
        : "hover:text-[#5A9BFF] transition duration-300"
    }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  mobile: PropTypes.bool,
  onClick: PropTypes.func,
};

export default EmployerNavbar;
