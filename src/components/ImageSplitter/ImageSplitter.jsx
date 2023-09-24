import React, { useEffect, useState, useCallback } from "react";
import resemble from "resemblejs";
import "./ImageSplitter.css";

const ImageSplitter = ({ img1, img2, img3, img4, rows, cols }) => {
  const [chunkedImages, setChunkedImages] = useState([]);
  const [mismatchedImages, setMismatchedImages] = useState([]);
  const [mismatchedTable, setMismatchedTable] = useState([]);
  const [processing, setProcessing] = useState(false);

  const splitImageIntoCells = useCallback(
    async (imageSrc) => {
      if (!imageSrc) return [];

      try {
        const image = await loadImage(imageSrc);
        const cellWidth = image.width / cols;
        const cellHeight = image.height / rows;

        const newCells = [];

        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            const xPosition = (x * cellWidth).toFixed(2);
            const yPosition = (y * cellHeight).toFixed(2);

            const canvas = document.createElement("canvas");
            canvas.width = cellWidth;
            canvas.height = cellHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(
              image,
              xPosition,
              yPosition,
              cellWidth,
              cellHeight,
              0,
              0,
              cellWidth,
              cellHeight
            );

            const cellId = `cell-${String(y).padStart(3, "0")}-${String(
              x
            ).padStart(3, "0")}`;
            const imageDataUrl = canvas.toDataURL("image/jpeg");

            newCells.push({
              id: cellId,
              x: xPosition,
              y: yPosition,
              imageDataUrl,
            });
          }
        }

        return newCells;
      } catch (error) {
        console.error("Image loading or splitting failed", error);
        return [];
      }
    },
    [cols, rows]
  );

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
      image.src = src;
    });
  };

  useEffect(() => {
    const loadAndSplitImages = async () => {
      try {
        // Set processing to true before starting image processing
        setProcessing(true);

        const chunkedImages = await Promise.all([
          splitImageIntoCells(img1),
          splitImageIntoCells(img2),
          splitImageIntoCells(img3),
          splitImageIntoCells(img4),
        ]);
        setChunkedImages(chunkedImages);
        setProcessing(false);
      } catch (error) {
        console.error("Image processing failed", error);
        setProcessing(false);
      }
    };

    loadAndSplitImages();
  }, [img1, img2, img3, img4, splitImageIntoCells]);

  const compareImages = async (gridCells1, gridCells2) => {
    if (!Array.isArray(gridCells1) || !Array.isArray(gridCells2)) {
      console.error("Please provide valid cell arrays.");
      return [];
    }

    const img = new Image();
    img.src = gridCells1[0]?.imageDataUrl;
    await new Promise((res) => (img.onload = res));

    const cellWidth = Math.round(img.width / cols);
    const cellHeight = Math.round(img.height / rows);

    const mismatches = [];

    for (let i = 0; i < gridCells1.length; i++) {
      const cell1 = gridCells1[i];
      const cell2 = gridCells2[i];

      const comparisonResult = await compareCellImages(cell1, cell2);

      if (comparisonResult.rawMisMatchPercentage > 0) {
        mismatches.push({
          id: cell1.id,
          x: cell1.x,
          y: cell1.y,
          width: cellWidth,
          height: cellHeight,
        });
      }
    }

    return mismatches;
  };

  const generateMismatchedImagesWithHighlight = async (
    gridCells1,
    gridCells2,
    mismatches
  ) => {
    const mismatchedImagesResult = await Promise.all(
      gridCells1.map(async (cell, index) => {
        const isMismatched = mismatches.some(
          (mismatch) => mismatch.id === cell.id
        );
        const cell1Image = isMismatched
          ? await highlightMismatchedCell(cell.imageDataUrl)
          : cell.imageDataUrl;
        const cell2Image = isMismatched
          ? await highlightMismatchedCell(gridCells2[index].imageDataUrl)
          : gridCells2[index].imageDataUrl;

        return {
          cell1: cell1Image,
          cell2: cell2Image,
          id: cell.id,
          isMismatched, // Include a flag to indicate if the cell is mismatched
        };
      })
    );

    return mismatchedImagesResult;
  };

  const highlightMismatchedCell = (imageDataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageDataUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");

        context.drawImage(img, 0, 0);
        context.strokeStyle = "red";
        context.lineWidth = 2;
        context.strokeRect(0, 0, img.width, img.height);

        const highlightedImage = canvas.toDataURL("image/png");
        resolve(highlightedImage);
      };
    });
  };

  const compareCellImages = async (cell1, cell2) => {
    return new Promise((resolve) => {
      resemble(cell1.imageDataUrl)
        .compareTo(cell2.imageDataUrl)
        .ignoreAntialiasing()
        .onComplete((comparison) => {
          resolve(comparison);
        });
    });
  };

  const compareAndGenerateMismatchedData = async () => {
    try {
      // Check if images are still processing
      if (processing) {
        alert("Please wait until the images finish processing.");
        return;
      }
      if (chunkedImages.some((images) => images.some((image) => !image))) {
        alert("Images have not finished loading. Please wait.");
        return;
      }
      setProcessing(true);
      setMismatchedImages([]);
      setMismatchedTable([]);

      // Compare cells from both pairs of images
      const mismatches1 = await compareImages(
        chunkedImages[0],
        chunkedImages[1]
      );
      const mismatches2 = await compareImages(
        chunkedImages[2],
        chunkedImages[3]
      );

      console.log("Mismatches1:", mismatches1);
      console.log("Mismatches2:", mismatches2);

      // Generate mismatched table data and set the state for both pairs of images
      const mismatchedTableData1 = mismatches1.map((mismatch) => ({
        id: mismatch.id,
        x: mismatch.x,
        y: mismatch.y,
      }));
      const mismatchedTableData2 = mismatches2.map((mismatch) => ({
        id: mismatch.id,
        x: mismatch.x,
        y: mismatch.y,
      }));
      setMismatchedTable([mismatchedTableData1, mismatchedTableData2]);

      const mismatchedImagesResult1 =
        await generateMismatchedImagesWithHighlight(
          chunkedImages[0],
          chunkedImages[1],
          mismatches1
        );
      const mismatchedImagesResult2 =
        await generateMismatchedImagesWithHighlight(
          chunkedImages[2],
          chunkedImages[3],
          mismatches2
        );

      console.log("Mismatched Images Result 1:", mismatchedImagesResult1);
      console.log("Mismatched Images Result 2:", mismatchedImagesResult2);

      setMismatchedImages([mismatchedImagesResult1, mismatchedImagesResult2]);
      setProcessing(false);
    } catch (error) {
      console.error("Error in compareAndGenerateMismatchedData:", error);
    }
  };

  const saveMismatchedImage = async (
    imageSet,
    filename,
    cols,
    rows,
    tableData
  ) => {
    if (!imageSet || imageSet.length === 0 || !cols || !rows) {
      console.error("Invalid input data.");
      return;
    }

    // Sort the imageSet based on the id
    imageSet.sort((a, b) => {
      const aIdParts = a.id.split("-");
      const bIdParts = b.id.split("-");
      const aRow = parseInt(aIdParts[1], 10);
      const bRow = parseInt(bIdParts[1], 10);
      const aCol = parseInt(aIdParts[2], 10);
      const bCol = parseInt(bIdParts[2], 10);

      if (aRow === bRow) {
        return aCol - bCol;
      }
      return aRow - bRow;
    });

    // Preload all images and store them in an array
    const loadedImages = await Promise.all(
      imageSet.map(async (imageData) => {
        return new Promise((resolve) => {
          const image = new Image();
          image.src = imageData?.cell1 || ""; // Assuming cell1 is the main image to be displayed
          image.onload = () => resolve(image);
        });
      })
    );

    // Get the dimensions of an individual cell from the first preloaded image
    const cellWidth = loadedImages[0].width;
    const cellHeight = loadedImages[0].height;

    if (!cellWidth || !cellHeight) {
      console.error("Unable to get cell dimensions.");
      return;
    }

    // Create a canvas to merge cells
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Calculate the total width and height based on the number of columns and rows
    const totalWidth = cols * cellWidth;
    const totalHeight = rows * cellHeight;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Draw each cell onto the canvas in the correct order
    let col = 0;
    let row = 0;

    for (const image of loadedImages) {
      const x = col * cellWidth;
      const y = row * cellHeight;

      // Draw the image onto the canvas
      ctx.drawImage(image, x, y, cellWidth, cellHeight);

      // Update the column and row
      col++;
      if (col >= cols) {
        col = 0;
        row++;
      }
    }

    // Convert the canvas to a data URL
    const imageDataUrl = canvas.toDataURL("image/png");

    // Generate the HTML content with the image data and table data
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Mismatched Image and Table</title>
        <style>
          /* CSS for table styling */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
  
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
  
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
  
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
  
          tr:hover {
            background-color: #ddd;
          }
        </style>
      </head>
      <body>
        <h1>Mismatched Image and Table</h1>
        <img src="${imageDataUrl}" alt="Mismatched Image" />
        <h2>Mismatched Table</h2>
        <table>
          <thead>
            <tr>
              <th>X</th>
              <th>Y</th>
            </tr>
          </thead>
          <tbody>
            ${tableData
              .map(
                (cell) => `
              <tr>
                <td>${cell.x}</td>
                <td>${cell.y}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: "text/html" });

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename + ".html"; // Set the filename with .html extension
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveMismatchedTable = (tableData, filename) => {
    const csv = tableData.map((cell) => `${cell.x}, ${cell.y}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <button
        className="btn-add-stencil"
        onClick={compareAndGenerateMismatchedData}
        disabled={processing}
      >
        Compare Images Cells
      </button>
      {processing && (
        <p className="warning-message">
          Please wait while images are processing...
        </p>
      )}
      {/*  {chunkedImages.map((images, imageIndex) => (
        <div key={imageIndex} className="image-row">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid-row"
              style={{ display: "flex" }}
            >
              {Array.from({ length: cols }).map((_, colIndex) => {
                const cellId = `cell-${rowIndex
                  .toString()
                  .padStart(3, "0")}-${colIndex.toString().padStart(3, "0")}`;
                const cell = images.find((cell) => cell.id === cellId);
                return (
                  <img
                    className="grid-cell"
                    key={cellId}
                    src={cell?.imageDataUrl}
                    alt={`Cell ${cellId}`}
                    style={{
                      boxSizing: "border-box",
                      width: `${100 / cols}%`,
                      height: `${100 / rows}%`,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      ))} */}
      {mismatchedImages.map(
        (imageSet, index) =>
          imageSet.some((image) => image?.isMismatched) && (
            <div key={index} className="image-row">
              <button
                onClick={() =>
                  saveMismatchedImage(
                    mismatchedImages[index],
                    `MismatchedCells_Image_${index}.png`,
                    cols,
                    rows,
                    mismatchedTable[index]
                  )
                }
              >
                Save Mismatched Image {index + 1}
              </button>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid-row"
                  style={{ display: "flex" }}
                >
                  {Array.from({ length: cols }).map((_, colIndex) => {
                    const cellId = `cell-${String(rowIndex).padStart(
                      3,
                      "0"
                    )}-${String(colIndex).padStart(3, "0")}`;
                    const image = imageSet.find((img) => img.id === cellId);
                    return (
                      <img
                        className={`grid-cell ${
                          image?.isMismatched ? "mismatched" : ""
                        }`}
                        key={cellId}
                        src={image?.cell1} // Assuming cell1 is the main image to be displayed.
                        alt={`Cell ${cellId}`}
                        style={{
                          boxSizing: "border-box",
                          width: `calc(${100 / cols}% - 1px)`,
                          border: "1px solid #ccc",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          )
      )}

      {mismatchedTable &&
        mismatchedTable.map((tableData, index) =>
          tableData.length > 0 ? (
            <div key={index} className="image-row">
              <button
                onClick={() =>
                  saveMismatchedTable(
                    tableData,
                    `MismatchedCells_Table_${index}.csv`
                  )
                }
              >
                Save Mismatched Table {index + 1}
              </button>
              <table key={index} className="mismatched-table">
                <thead>
                  <tr>
                    <th>X</th>
                    <th>Y</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((cell) => (
                    <tr key={cell.id}>
                      <td>{cell.x}</td>
                      <td>{cell.y}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            ""
          )
        )}
    </div>
  );
};

export default ImageSplitter;
