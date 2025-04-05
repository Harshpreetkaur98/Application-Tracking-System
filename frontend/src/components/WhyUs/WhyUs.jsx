import { useState } from "react";
import "./whyus.css";
import data from "./data";
import TilePopup from "./TilePopUp";

const WhyUs = () => {
  const [selectedTile, setSelectedTile] = useState(null);

  const handleClick = (id) => {
    setSelectedTile(selectedTile === id ? null : id);
  };

  return (
    <div className="why-us-page">
      <div className={`overlay ${selectedTile ? "active" : ""}`} onClick={() => setSelectedTile(null)}></div>
      
      <div className="why-us-content">
        <h1>Why Us?</h1>
        <p>We offer the best applicant tracking system, making your job search easier!</p>
      </div>

      <div className="tiles-container">
        {data.map((item) => (
          <div
            key={item.id}
            className={`tile ${selectedTile === item.id ? "expanded rotate" : ""}`}
            onClick={() => handleClick(item.id)}
          >
            <h3>{item.title}</h3>
            {selectedTile === item.id && <TilePopup item={item} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyUs;
