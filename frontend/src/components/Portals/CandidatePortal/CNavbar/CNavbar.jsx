import './CNavbar.css';
import { useNavigate } from "react-router-dom";
import logoImage from "../../../../assets/images/candidate-logo.png";
import { useState } from 'react';

function CNavbar() {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleClickLogo = () => {
    navigate("/Candidate-Portal");
  };

  const handleProfileClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleActivityPage = () => {
    console.log("Navigating to Activity Page...");
    navigate("/Candidate-Portal/activity");
  };

  const handleProfilePage = () => {
    console.log("Navigating to Profile Page...");
    navigate("/Candidate-Portal/profile");
  };

  const handleHomePage = () => {
    console.log("Navigating to Profile Page...");
    navigate("/");
  };

  return (
    <header className="navbar-candidate">
      <div className="logo-container-candidate" onClick={handleClickLogo} style={{ cursor: "pointer" }}>
        <img src={logoImage} alt="Logo" className="logo-candidate" />
      </div>

      <nav>
        <ul className="nav-links-candidate">
          <li><a href="#">Jobs</a></li>
          <li><a href="#">Salaries</a></li>
          <li><a href="#">Interviews</a></li>
        </ul>
      </nav>

      <div className="actions-candidate">
        {/* Profile Logo Icon */}
        <div className="profile-logo" onClick={handleProfileClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
          </svg>
        </div>

        {/* Dropdown Menu */}
        {dropdownVisible && (
          <div className="dropdown-menu">
            <button onClick={handleHomePage}>Home</button>
            <button onClick={handleProfilePage}>Profile</button>
            <button onClick={handleActivityPage}>Your Activity</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default CNavbar;
