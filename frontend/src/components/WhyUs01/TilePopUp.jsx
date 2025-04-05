import "react";
import PropTypes from "prop-types";

const TilePopup = ({ item }) => {
  return (
    <div className="tile-popup">
      <p>{item.description}</p>
    </div>
  );
};
TilePopup.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default TilePopup;
