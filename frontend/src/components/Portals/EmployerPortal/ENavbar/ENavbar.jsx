import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";
import "./Enavbar.css";
import logo from "../../../../assets/images/EmployerPortalLogo.png";
import SettingsModal from "../Settings/SettingsModal";


const EmployerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-[#1E1E1E] text-white shadow-lg relative z-50 flex items-center justify-between px-4 py-2 navbar-container-main" style={{display: "flex", justifyContent: "space-between"}} >
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
              src={logo}  // Replace with the actual path to your logo image
              alt="Employer Portal Logo"
              className="employer-logo"  // Adjust the height of the logo as needed
            />
        </Link>

        

        {/* Desktop Menu - Visible Only on Larger Screens */}
        {/* <div className="hidden md:flex space-x-6">
          {menuItems.map(({ path, label }) => (
            <NavItem key={path} to={path} onClick={closeMenu}>
              {label}
            </NavItem>
          ))} */}
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        
      {/* </div> */}

      {/* Mobile Menu Overlay (Backdrop to close menu when clicked outside) */}
      {isOpen && <div className="mobile-menu-overlay" onClick={closeMenu}></div>}

      {/* Mobile Menu Dropdown - Appears Only When Hamburger is Clicked */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <div className="mobile-menu-container">
          {menuItems.map(({ path, label }) => (
            <NavItem key={path} to={path} mobile onClick={closeMenu}>
              {label}
            </NavItem>
          ))}
        </div>
      </div>

      <button
          className="settings-icon"
          onClick={() => setShowSettingsModal(true)}
        >
          <Settings size={24} />
        </button>


      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
    </nav>
  );
};

// Define menu items for reusability
const menuItems = [
  { path: "/Employer-Portal/dashboard", label: "Dashboard" },
  { path: "/Employer-Portal/post-job", label: "Post a Job" },
  { path: "/Employer-Portal/manage-jobs", label: "Manage Jobs" },
  { path: "/Employer-Portal/applications", label: "Applications" },
  { path: "/Employer-Portal/feedback-ats", label: "ATS Reports" },
  { path: "/Employer-Portal/company-profile", label: "Profile" },
  { path: "/Employer-Portal/settings", label: "Settings" },
];

// Reusable NavItem Component
const NavItem = ({ to, children, mobile = false, onClick }) => (
  <Link
    to={to}
    className={`flex px-4 py-2 rounded-lg ${
      mobile
        ? "text-white hover:bg-[#3A7DFF] transition duration-300"
        : "hover:text-[#5A9BFF] transition duration-300"
    }`}
    onClick={onClick} // Close the menu when a link is clicked
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