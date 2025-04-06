import "./whyus.css";
import data from "./data";

const WhyUs = () => {
  return (
    <div id="whyus" className="why-us-page">
      <div className="why-us-content">
        <h1>Why Us?</h1>
        <p>We offer the best applicant tracking system, making your job search easier!</p>
      </div>

      <div className="tiles-container">
        {data.map((item) => (
          <div key={item.id} className="tile">
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyUs;
