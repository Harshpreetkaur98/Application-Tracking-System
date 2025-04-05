import "react";
import "./scanCv.css"; 
import { useNavigate } from "react-router-dom";

const ScanCv = () => {
    const navigate = useNavigate();
  
    const handleClick = () => {
      navigate("/scan-cv");
    };

    return (
        <div className="scan-cv-container">
          <button className="scan-cv-button" onClick={handleClick}>
            Scan your CV
          </button>
        </div>
      );
    };

export default ScanCv;
