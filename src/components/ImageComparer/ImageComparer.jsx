import React, { useState, useRef } from "react";
import resemble from "resemblejs";
import "./ImageComparer.css";

function ImageComparer({ image1, image2, image3, image4, imageName }) {
  const [comparisonResult1, setComparisonResult1] = useState(null);
  const [comparisonResult2, setComparisonResult2] = useState(null);

  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);

  const handleCompareImages = async () => {
    if (!image1 || !image2 || !image3 || !image4) {
      console.error("Please provide all four images.");
      return;
    }

    const image1Blob = await fetch(image1).then((response) => response.blob());
    const image2Blob = await fetch(image2).then((response) => response.blob());
    const image3Blob = await fetch(image3).then((response) => response.blob());
    const image4Blob = await fetch(image4).then((response) => response.blob());

    const image1Data = await getImageData(image1Blob);
    const image2Data = await getImageData(image2Blob);
    const image3Data = await getImageData(image3Blob);
    const image4Data = await getImageData(image4Blob);

    const comparison1 = await compareImages(image1Data, image2Data);
    const comparison2 = await compareImages(image3Data, image4Data);

    setComparisonResult1(comparison1);
    setComparisonResult2(comparison2);

    renderDiffImage(comparison1, canvasRef1);
    renderDiffImage(comparison2, canvasRef2);
  };

  const getImageData = async (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        resolve(imageData);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  };

  const compareImages = (imageData1, imageData2) => {
    return new Promise((resolve, reject) => {
      resemble(imageData1)
        .compareTo(imageData2)
        .scaleToSameSize()
        .outputSettings({
          errorColor: {
            red: 255,
            green: 0,
            blue: 255,
          },
          errorType: "movement",
          transparency: 0.7,
        })
        .onComplete((comparison) => {
          resolve(comparison);
        });
    });
  };

  const renderDiffImage = (comparison, canvasRef) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      // Highlight differences
      ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
      for (const key in comparison.diffBounds) {
        if (comparison.diffBounds.hasOwnProperty(key)) {
          const bounds = comparison.diffBounds[key];
          ctx.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
        }
      }
    };

    image.src = comparison.getImageDataUrl();
  };

  const saveDiffImage = async (canvas, filename, mismatchPercentage) => {
    if (!canvas) {
      console.error("No canvas provided.");
      return;
    }

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    // Set the dimensions of the temp canvas to accommodate the original canvas and the text
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height + 50; // Adjust the additional height for text

    // Draw the original canvas content on the temp canvas
    tempCtx.drawImage(canvas, 0, 50);

    // Clear a region above the image for the text background
    tempCtx.clearRect(0, 0, tempCanvas.width, 50);

    // Set font and text properties for the percentage display
    tempCtx.font = "20px Arial";
    tempCtx.fillStyle = "#333"; //background color for the text
    tempCtx.textAlign = "center";

    // Draw the background for the text
    tempCtx.fillRect(0, 0, tempCanvas.width, 50);

    // Draw the percentage text above the image in white color
    tempCtx.fillStyle = "white"; // text color
    tempCtx.fillText(
      `Mismatch Percentage: ${mismatchPercentage}%`,
      tempCanvas.width / 2,
      30
    );

    // Save the temp canvas as a Blob
    tempCanvas.toBlob(async (blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    }, "image/png");
  };

  return (
    <div className="display-images">
      <h2>Image Comparer</h2>

      <div className="display-images"></div>
      <div className="comparison-buttons">
        <button onClick={handleCompareImages}>Compare Images</button>
      </div>
      {comparisonResult2 && (
        <div className="comparison-outcome">
          {/*   {displayImage1 && <img src={displayImage1} alt="Image 1" width="400" />}
        {displayImage2 && <img src={displayImage2} alt="Image 2" width="400" />} */}
          <h3>Comparison Result:</h3>
          <p>Mismatch Percentage: {comparisonResult2.misMatchPercentage}</p>
          <canvas
            className="canvas-image"
            ref={canvasRef2}
            style={{ border: "1px solid black" }}
            width={comparisonResult2.dimensionDifference.width}
            height={comparisonResult2.dimensionDifference.height}
          />
          <div className="comparison-buttons">
            <button
              onClick={() =>
                saveDiffImage(
                  canvasRef2.current,
                  imageName,
                  comparisonResult2.misMatchPercentage
                )
              }
            >
              Save Diff Image
            </button>
          </div>
        </div>
      )}
      {comparisonResult1 && (
        <div className="comparison-outcome">
          <h3>Comparison Result 1:</h3>
          <p>Mismatch Percentage: {comparisonResult1.misMatchPercentage}</p>
          <canvas
            className="canvas-image"
            ref={canvasRef1}
            style={{ border: "1px solid black" }}
            width={comparisonResult1.dimensionDifference.width}
            height={comparisonResult1.dimensionDifference.height}
          />
          <div className="comparison-buttons">
            <button
              className="comparison-buttons"
              onClick={() =>
                saveDiffImage(
                  canvasRef1.current,
                  imageName,
                  comparisonResult1.misMatchPercentage
                )
              }
            >
              Save Diff Image 2
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageComparer;
