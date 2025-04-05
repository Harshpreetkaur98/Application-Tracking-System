import "react";
import "./subscribe.css";

const Subscribe = () => {
  return (
    <div className="newsletter-container">
      <input
        type="email"
        className="newsletter-input"
        placeholder="Subscribe to our Newsletter"
      />
      <button className="subscribe-button">Subscribe</button>
    </div>
  );
};

export default Subscribe;
