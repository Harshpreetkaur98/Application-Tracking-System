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
    const whyUsSection = document.getElementById("whyus");

    if (window.location.pathname === "/") {
      if (whyUsSection) {
        window.scrollTo({
          top: whyUsSection.offsetTop,
          behavior: "smooth",
        });
      }
    } else {
      navigate("/");
    }
  };

  const handleClickLogin = () => {
    navigate("/Login");
  };

  const handleClickSignUp = () => {
    navigate("/SignUp");
  };

  const handleClickHowToUse = () => {
    navigate("/how-to-use");
  };

  return (
    <header className="header">
      <nav className="navbar">
        <ul className="navbar-menu">
          <li className="menu-item" onClick={handleClickWhyUs}>Why us?</li>
          <li className="menu-item" onClick={handleClickHowToUse}>How to Use</li>
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
