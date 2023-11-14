import React, { useState } from "react";
import "./ImageUploader.css";
import Stencil from "../Stencil/Stencil";

function ImageUploader() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [imageName, setImageName] = useState("");
  const [rowsNumber, setRowsNumber] = useState(20);
  const [colsNumber, setColsNumber] = useState(25);

  const handleImageUpload = (event, setImage) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    setImageName(file.name);
    reader.onload = (e) => {
      setImage(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  const handleRowsNum = (e) => {
    setRowsNumber(Number(e.target.value));
  };

  const handleColsNum = (e) => {
    setColsNumber(Number(e.target.value));
  };

  return (
    <div>
      <form className="images-upload-form">
        <div className="form-group">
          <input
            type="file"
            className="input-file"
            onChange={(e) => handleImageUpload(e, setImage1)}
          />
          <input
            type="file"
            className="input-file"
            onChange={(e) => handleImageUpload(e, setImage2)}
          />
        </div>
        <div className="form-cells-group">
          <div className="input-cells">
            <label htmlFor="rows">Rows No. </label>
            <input
              id="rows"
              type="number"
              value={rowsNumber}
              onChange={(e) => handleRowsNum(e)}
              placeholder="Rows Number"
            />
          </div>
          <div className="input-cells">
            <label htmlFor="columns"> Col No. </label>
            <input
              id="columns"
              type="number"
              value={colsNumber}
              onChange={(e) => handleColsNum(e)}
              placeholder="Cols Number"
            />
          </div>
        </div>
      </form>
      <div className="image-container"></div>
      {image1 && image2 && (
        <Stencil
          image1={image1}
          image2={image2}
          imageName={imageName}
          rows={rowsNumber}
          cols={colsNumber}
        />
      )}
    </div>
  );
}

export default ImageUploader;
