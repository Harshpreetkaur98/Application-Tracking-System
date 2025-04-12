import PropTypes from 'prop-types';

const GuideSection = ({ title, description, imageUrl, steps, tips, isReversed }) => {
  return (
    <div className={`guide-section ${isReversed ? 'reversed' : ''}`}>
      <div className="guide-section-image">
        <img src={imageUrl || "/api/placeholder/500/300"} alt={title} />
      </div>
      
      <div className="guide-section-content">
        <h2>{title}</h2>
        <p className="section-description">{description}</p>
        
        {steps && steps.length > 0 && (
          <div className="section-steps">
            <h3>How it works:</h3>
            <ol>
              {steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        
        {tips && tips.length > 0 && (
          <div className="section-tips">
            <h3>Pro Tips:</h3>
            <ul>
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

GuideSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.string),
  tips: PropTypes.arrayOf(PropTypes.string),
  isReversed: PropTypes.bool,
};

export default GuideSection;