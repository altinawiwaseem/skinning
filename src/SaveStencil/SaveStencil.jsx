import React, { useState } from "react";
import "./SaveStencil.css";

const SaveStencil = ({ stencil }) => {
  const [label, setLabel] = useState("");
  const [screenSize, setScreenSize] = useState("12.9");
  const [itemName, setItemName] = useState("");
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  console.log("screen", screenSize);
  const handleSave = () => {
    if (!label || !screenSize || !itemName) {
      // Set the flag to show validation errors
      setIsSaveClicked(true);
      return;
    }
    const savedData = {
      label,
      screenSize,
      itemName,
      items: stencil,
    };

    let existingData = localStorage.getItem("savedData");

    if (existingData) {
      existingData = JSON.parse(localStorage.getItem("savedData"));
    } else {
      existingData = [];
    }

    // Update the existing data with the new entry
    const updatedData = [...existingData, savedData];

    // Save the updated data back to localStorage
    localStorage.setItem("savedStencil", JSON.stringify(updatedData));

    // Reset the form fields after saving
    setLabel("");
    setItemName("");
    setIsSaveClicked(false);
  };

  return (
    <div className="save-container">
      <h2>Save Data</h2>
      <div className="save-input-container">
        <label className="input-label">
          Label:
          <input
            className="save-input-field"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required={isSaveClicked}
          />
        </label>
        <label className="input-label">
          Screen Size:
          <select
            className="select-field"
            value={screenSize}
            onChange={(e) => setScreenSize(e.target.value)}
            required={isSaveClicked}
          >
            <option value="12.9">12.9</option>
            <option value="10.4">10.4</option>
            <option value="10">10</option>
          </select>
        </label>
        <label className="input-label">
          Item Name:
          <input
            className="save-input-field"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required={isSaveClicked}
          />
        </label>
      </div>
      {isSaveClicked && (
        <p className="warning-message">Please fill in all required fields...</p>
      )}
      <button className="btn-add-stencil" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default SaveStencil;
