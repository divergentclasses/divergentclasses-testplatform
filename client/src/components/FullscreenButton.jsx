// FullscreenButton.js
import React, { useState } from "react";

const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Request full-screen mode
      const elem = document.getElementById("fullscreen-container"); // Fullscreen the entire document
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        // Chrome, Safari, Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        // IE/Edge
        elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit full-screen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari, Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <button onClick={toggleFullscreen}>
      {isFullscreen ? "Exit Full-Screen" : "Enter Full-Screen"}
    </button>
  );
};

export default FullscreenButton;
