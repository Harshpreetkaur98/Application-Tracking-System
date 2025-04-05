import './CNavbar.css';
import { useNavigate } from "react-router-dom";
import logoImage from "../../../../assets/images/candidate-logo.png";

function CNavbar() {
  const navigate = useNavigate();

  const handleClickLogo = () => {
    navigate("/");
  };

  return (
    <header className="navbar-candidate">
      <div className="logo-container-candidate" onClick={handleClickLogo} style={{ cursor: "pointer" }}>
        <img src={logoImage} alt="Logo" className="logo-candidate logo" />
      </div>

      <nav>
        <ul className="nav-links-candidate">
          <li><a href="#">Jobs</a></li>
          <li><a href="#">Companies</a></li>
          <li><a href="#">Salaries</a></li>
          <li><a href="#">Interviews</a></li>
        </ul>
      </nav>

      <div className="actions-candidate">
        <a href="#">Sign In</a>
      </div>
    </header>
  );
}

export default CNavbar;
