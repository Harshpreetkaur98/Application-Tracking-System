import "react";
import "./quote.css";
import QuoteImage from "../../assets/images/QuoteImage.png";
import bridingImage from "../../assets/images/bridigingGap.png";

const Quote = () => {
  return (
    <div className="quote-container">
      <img src={QuoteImage} alt="Quote" className="quote-image" />
      <img src={bridingImage} alt="Quote" className="quote-image" />
    </div>
  );
};

export default Quote;
