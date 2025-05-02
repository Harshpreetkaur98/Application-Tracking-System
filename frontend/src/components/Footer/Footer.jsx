import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="newsletter-section">
          <div className="newsletter-container">
          <input
              type="email"
              className="newsletter-input"
              placeholder="Subscribe to our Newsletter"
              style={{ width: "30%" }}
            />

            <button className="subscribe-button">Subscribe</button>
          </div>
        </div>
        <p>&copy; {new Date().getFullYear()} hATS. All rights reserved.</p>
        <ul className="footer-links">
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;