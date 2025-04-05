import "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import LogoImage from "../../assets/images/logo.png";

const Logo = () => {
  const navigate = useNavigate();

  const handleClickLogo = () => {
    navigate("/");
  };

  return (
    <div className="logo-container" onClick={handleClickLogo} style={{ cursor: "pointer" }}>
      <img src={LogoImage} alt="Logo" className="logo" />
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();

  const handleClickWhyUs = () => {
    // Check if we're already on the Landing Page
    const whyUsSection = document.getElementById("whyus");

    if (window.location.pathname === "/") {
      // On Landing Page, scroll to the "Why Us" section
      if (whyUsSection) {
        window.scrollTo({
          top: whyUsSection.offsetTop,
          behavior: "smooth",
        });
      }
    } else {
      // If not on the Landing Page, navigate there first and then scroll
      navigate("/");
    }
  };

  const handleClickLogin = () => {
    navigate("/Login");
  };

  const handleClickSignUp = () => {
    navigate("/SignUp");
  };

  return (
    <header className="header">
      <nav className="navbar">
        <ul className="navbar-menu">
          <li className="menu-item" onClick={handleClickWhyUs}>Why us?</li>
        </ul>
        <div className="navbar-buttons">
          <button className="login-button" onClick={handleClickLogin}>Login</button>
          <button className="signup-button" onClick={handleClickSignUp}>Sign Up</button>
        </div>
      </nav>
      <div className="below-nav-content">
        <div>
          <Logo />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
