import React from "react";
import "./ImageDisplay.css";

function ImageDisplay({ src, alt }) {
  return (
    <div className="image-container">
      {src && <img src={src} alt={alt} className="uploaded-image" />}
    </div>
  );
}

export default ImageDisplay;
