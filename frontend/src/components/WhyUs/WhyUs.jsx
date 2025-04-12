import { useState } from "react";
import "./whyus.css";
import data from "./data";

const WhyUs = () => {
  const [expandedTile, setExpandedTile] = useState(null);

  const handleTileClick = (id) => {
    setExpandedTile(id === expandedTile ? null : id);
  };

  const handleClosePopup = () => {
    setExpandedTile(null);
  };

  return (
    <div id="whyus" className="why-us-page">
      <div className="why-us-content">
        <h1>Why Us?</h1>
        <p>We offer the best applicant tracking system, making your job search easier!</p>
        <p className="subtitle">Bridging the gap between applicants and employers</p>
      </div>
      
      <div className="tiles-container">
        {data.map((item) => (
          <div
            key={item.id}
            className={`tile ${expandedTile === item.id ? "rotate" : ""}`}
            onClick={() => handleTileClick(item.id)}
          >
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>

      {expandedTile && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleClosePopup}>×</button>
            <h2>{data.find(item => item.id === expandedTile).title}</h2>
            <div className="popup-body">
              <div className="popup-image">
                <img src={data.find(item => item.id === expandedTile).image} alt={data.find(item => item.id === expandedTile).title} />
              </div>
              <div className="popup-description">
                <p>{data.find(item => item.id === expandedTile).description}</p>
                <ul className="feature-list">
                  {data.find(item => item.id === expandedTile).features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhyUs;