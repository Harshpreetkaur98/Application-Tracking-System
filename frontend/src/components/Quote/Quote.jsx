import "react";
import "./quote.css";
import QuoteImage from "../../assets/images/QuoteImage.png";

const Quote = () => {
  return (
    <div className="quote-container">
      <img src={QuoteImage} alt="Quote" className="quote-image" />
    </div>
  );
};

export default Quote;
