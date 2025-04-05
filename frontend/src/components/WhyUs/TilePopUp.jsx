
import './tilepopup.css';
import PropTypes from 'prop-types';

function TilePopUp({ title, description }) {
  return (
    <div className="popup-container">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
TilePopUp.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default TilePopUp;
