import React from "react";

function StencilSettings({
  stencil,
  onStencilChange,
  onRemoveStencil,
  onSubmit,
}) {
  const { width, height, top, left } = stencil;

  const handleWidthChange = (e) => {
    onStencilChange("width", e.target.value);
  };

  const handleHeightChange = (e) => {
    onStencilChange("height", e.target.value);
  };

  const handleTopChange = (e) => {
    onStencilChange("top", e.target.value);
  };

  const handleLeftChange = (e) => {
    onStencilChange("left", e.target.value);
  };

  return (
    <div className="stencil-settings-container">
      <div className="stencil-settings-box">
        <div className="stencil-settings-header">
          <button className="delete-stencil-button" onClick={onRemoveStencil}>
            &#x2716; {/* Red X mark */}
          </button>
        </div>
        <div className="input-fields">
          <div className="input-field">
            <label>Width:</label>
            <input
              type="number"
              value={width || ""}
              onChange={handleWidthChange}
            />
            <span>px</span>
          </div>
          <div className="input-field">
            <label>Height:</label>
            <input
              type="number"
              value={height || ""}
              onChange={handleHeightChange}
            />
            <span>px</span>
          </div>
          <div className="input-field">
            <label>Top:</label>
            <input type="number" value={top || ""} onChange={handleTopChange} />
            <span>px</span>
          </div>
          <div className="input-field">
            <label>Left:</label>
            <input
              type="number"
              value={left || ""}
              onChange={handleLeftChange}
            />
            <span>px</span>
          </div>
        </div>
        <div className="submit-settings">
          <button className="btn-add-stencil" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default StencilSettings;
