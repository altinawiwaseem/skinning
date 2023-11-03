import React, { useEffect, useState } from "react";
import { data } from "../../stencilsInputs";
import "./DropdownMenu.css";

function DropdownMenu({ setStencil }) {
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedScreenSize, setSelectedScreenSize] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");

  const getStencilFromLocalStorage = () => {
    const localData = localStorage.getItem("savedStencil");

    if (localData) {
      return JSON.parse(localStorage.getItem("savedStencil"));
    } else {
      return [];
    }
  };

  const [localData, setLocalData] = useState(getStencilFromLocalStorage());

  useEffect(() => {
    getStencilFromLocalStorage();
  }, [localData]);

  const allData = [...data, ...localData];

  const uniqueLabels = [...new Set(allData.map((item) => item.label))];
  const uniqueScreenSizes = [
    ...new Set(allData.map((item) => item.screenSize)),
  ];
  const uniqueItemNames = [...new Set(allData.map((item) => item.itemName))];

  const filteredData = allData.filter(
    (item) =>
      (!selectedLabel || item.label === selectedLabel) &&
      (!selectedScreenSize || item.screenSize === selectedScreenSize) &&
      (!selectedItemName || item.itemName === selectedItemName)
  );
  const handleItemClick = (items) => {
    setStencil(items);
  };

  return (
    <div className="select">
      <label>Select Label:</label>
      <select
        value={selectedLabel}
        onChange={(e) => setSelectedLabel(e.target.value)}
      >
        <option value="">-- All Labels --</option>
        {uniqueLabels.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>

      <label>Select Screen Size:</label>
      <select
        value={selectedScreenSize}
        onChange={(e) => setSelectedScreenSize(e.target.value)}
      >
        <option value="">-- All Screen Sizes --</option>
        {uniqueScreenSizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <label>Select Item Name:</label>
      <select
        value={selectedItemName}
        onChange={(e) => setSelectedItemName(e.target.value)}
      >
        <option value="">-- All Item Names --</option>
        {uniqueItemNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <ul className="scrollable-list">
        {filteredData.map((item, i) => (
          <li key={i} onClick={() => handleItemClick(item.items)}>
            Label: {item.label}, Screen Size: {item.screenSize}, Item Name:{" "}
            {item.itemName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DropdownMenu;
