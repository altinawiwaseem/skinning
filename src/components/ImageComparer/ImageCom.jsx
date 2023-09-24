import React, { useState, useRef, useEffect } from "react";
import resemble from "resemblejs";

function ImageComparer({ image1, image2 }) {
  const [comparisonResult, setComparisonResult] = useState(null);

  const canvasRef = useRef(null);

  const handleCompareImages = async () => {
    if (!image1 || !image2) {
      console.error("Please select both images.");
      return;
    }

    const image1Blob = await fetch(image1).then((response) => response.blob());
    const image2Blob = await fetch(image2).then((response) => response.blob());

    const image1Data = await getImageData(image1Blob);
    const image2Data = await getImageData(image2Blob);

    resemble(image1Data)
      .compareTo(image2Data)
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
        console.log("Mismatch Percentage:", comparison.misMatchPercentage);
        console.log(
          "Are images the same dimensions?",
          comparison.isSameDimensions
        );
        setComparisonResult(comparison);

        // Render diff image on canvas
        renderDiffImage(comparison);
      });
  };

  const getImageData = (imageFile) => {
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

  const saveDiffImage = async () => {
    if (!comparisonResult) {
      console.error("No comparison result available.");
      return;
    }

    const canvas = canvasRef.current;

    // Save the diff image as a Blob
    canvas.toBlob(async (blob) => {
      // Prompt user to choose a directory for saving
      const opts = {
        types: [
          {
            description: "PNG Image",
            accept: {
              "image/png": [".png"],
            },
          },
          {
            description: "JPEG Image",
            accept: {
              "image/jpeg": [".jpg", ".jpeg"],
            },
          },
        ],
      };

      try {
        const fileHandle = await window.showSaveFilePicker(opts);

        if (fileHandle) {
          const writableStream = await fileHandle.createWritable();
          await writableStream.write(blob);
          await writableStream.close();
        } else {
          console.log("User cancelled the save operation.");
        }
      } catch (error) {
        console.error("Error saving file:", error);
      }
    }, "image/png");
  };

  const renderDiffImage = (comparison) => {
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

  return (
    <div>
      <h2>Image Comparer</h2>

      <div className="displayImages">
        {/*   {displayImage1 && <img src={displayImage1} alt="Image 1" width="400" />}
        {displayImage2 && <img src={displayImage2} alt="Image 2" width="400" />} */}
      </div>
      <button onClick={handleCompareImages}>Compare Images</button>
      <button onClick={saveDiffImage}>Save Diff Image</button>

      {comparisonResult && (
        <div>
          <h3>Comparison Result:</h3>
          <p>Mismatch Percentage: {comparisonResult.misMatchPercentage}</p>
          <canvas
            ref={canvasRef}
            style={{ border: "1px solid black" }}
            width={comparisonResult.dimensionDifference.width}
            height={comparisonResult.dimensionDifference.height}
          />
        </div>
      )}
    </div>
  );
}

export default ImageComparer;
