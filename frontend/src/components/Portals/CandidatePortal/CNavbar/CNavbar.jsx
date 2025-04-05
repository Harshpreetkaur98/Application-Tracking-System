
import './CNavbar.css';

function CNavbar() {
  return (
    <header className="navbar-candidate">
      <div className="logo-candidate">h<span>Ats</span></div>
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
