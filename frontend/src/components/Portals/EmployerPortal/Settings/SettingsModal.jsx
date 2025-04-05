import { useState } from "react";
import PropTypes from "prop-types";
import "./SettingsModal.css";
import { useNavigate } from "react-router-dom";

const SettingsModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const correctEmail = "admin@example.com";
    const correctPassword = "password123";

    if (email === correctEmail && password === correctPassword) {
      onClose();
      navigate("/Employer-Portal/settings");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="settings-modal">
      <div className="modal-content">
        <h2>Enter Password</h2>
        {error && <p className="error-text">{error}</p>}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
SettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SettingsModal;
