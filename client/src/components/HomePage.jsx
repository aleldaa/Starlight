import React, { useState } from 'react';

function HomePage() {
  const [dimmerVisible, setDimmerVisible] = useState(false);

  const handleClick = () => {
    const popup = document.getElementById('myPopup');
    popup.classList.toggle('show');
    setDimmerVisible(!dimmerVisible);
  };

  return (
    <div className="homepage-wrapper">
      <div className="popup" onClick={handleClick}>
        <div className="popup-title">
          <h5>What fuels your ✨sparkle✨ today?</h5>
        </div>
        <span className={`popuptext ${dimmerVisible ? 'show' : ''}`} id="myPopup">
          <form>
            <textarea type="text" className="popup-input" placeholder="Write your post." />
            <button type="submit" className=""></button>
          </form>
        </span>
      </div>
    </div>
  );
}

export default HomePage;