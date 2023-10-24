import React, { useState, useEffect, useMemo } from "react";
import "./Stencil.css";
import StencilSettings from "./StencilSettings";
import ImageDisplay from "../ImageDisplay/ImageDisplay";
import ImageComparer from "../ImageComparer/ImageComparer";
import ImageSplitter from "../ImageSplitter/ImageSplitter";
import Sidebar from "../Sidebar/StencilsListSidebar";

function Stencil({ image1, image2, rows, cols, description }) {
  const [headlines, setHeadlines] = useState([]);
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(null);
  const [headlineName, setHeadlineName] = useState("");
  const [headlineDescription, setHeadlineDescription] = useState("");

  const [stencils, setStencils] = useState([
    { width: 100, height: 100, top: 20, left: 20 },
  ]);

  const [pendingStencils, setPendingStencils] = useState([]);
  const [imageWithStencil1, setImageWithStencil1] = useState(null);
  const [imageWithStencil2, setImageWithStencil2] = useState(null);
  const [imageStencilOnly1, setImageStencilOnly1] = useState(null);
  const [imageStencilOnly2, setImageStencilOnly2] = useState(null);

  useEffect(() => {
    // Load headlines from local storage
    const storedHeadlines = JSON.parse(localStorage.getItem("headlines")) || [];
    setHeadlines(storedHeadlines);
  }, []);

  useEffect(() => {
    // Load selected headline's stencils and description
    if (currentHeadlineIndex !== null) {
      setStencils(headlines[currentHeadlineIndex].stencils);
      setHeadlineDescription(headlines[currentHeadlineIndex].description);
    }
  }, [currentHeadlineIndex, headlines]);

  const handleHeadlineAdd = () => {
    // Check if headlineName and headlineDescription are filled
    if (headlineName && headlineDescription) {
      const newHeadline = {
        name: headlineName,
        description: headlineDescription,
        stencils: stencils,
      };
      setHeadlines([...headlines, newHeadline]);

      // Save headlines to local storage
      localStorage.setItem(
        "headlines",
        JSON.stringify([...headlines, newHeadline])
      );

      // Reset inputs and stencils
      setHeadlineName("");
      setHeadlineDescription("");
      setStencils([{ width: 100, height: 100, top: 20, left: 20 }]);
    } else {
      alert("Please provide a headline name and description.");
    }
  };

  useEffect(() => {
    const loadImageAndGenerateStencil = (
      imageSrc,
      setImageStencilOnly,
      setImageWithStencil
    ) => {
      const originalImage = new Image();
      originalImage.src = imageSrc;

      originalImage.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        const ctx = canvas.getContext("2d");

        // Create a transparent canvas for the stencil-only image
        const stencilOnlyCanvas = document.createElement("canvas");
        stencilOnlyCanvas.width = canvas.width;
        stencilOnlyCanvas.height = canvas.height;
        const stencilOnlyCtx = stencilOnlyCanvas.getContext("2d");

        // Draw the stencil on the stencil-only canvas with a black fill
        stencilOnlyCtx.fillStyle = "black";
        stencils.forEach((stencil) => {
          stencilOnlyCtx.fillRect(
            stencil.left,
            stencil.top,
            stencil.width,
            stencil.height
          );
        });

        // Use the stencil as a mask for the original image
        stencilOnlyCtx.globalCompositeOperation = "source-in";
        stencilOnlyCtx.drawImage(originalImage, 0, 0);

        // Get the generated stencil-only image
        const stencilOnlyImage = stencilOnlyCanvas.toDataURL("image/jpeg");
        setImageStencilOnly(stencilOnlyImage);

        // Draw the original image on the canvas
        ctx.drawImage(originalImage, 0, 0);

        // Draw the stencil on the canvas
        ctx.fillStyle = "black";
        stencils.forEach((stencil) => {
          ctx.fillRect(
            stencil.left,
            stencil.top,
            stencil.width,
            stencil.height
          );
        });

        // Get the generated image with stencil
        const imageWithStencilURL = canvas.toDataURL("image/jpeg");
        setImageWithStencil(imageWithStencilURL);
      };
    };

    loadImageAndGenerateStencil(
      image1,
      setImageStencilOnly1,
      setImageWithStencil1
    );
    loadImageAndGenerateStencil(
      image2,
      setImageStencilOnly2,
      setImageWithStencil2
    );
  }, [image1, image2, stencils, pendingStencils]);

  const handleStencilAdd = () => {
    const newStencil = { width: 100, height: 100, top: 20, left: 20 };
    setPendingStencils([...pendingStencils, newStencil]);
    setStencils([...stencils, newStencil]);
  };
  const handleStencilChange = (index, property, value) => {
    setStencils((prevStencils) => {
      const updatedStencils = [...prevStencils];
      updatedStencils[index] = {
        ...updatedStencils[index],
        [property]: value,
      };
      return updatedStencils;
    });
  };
  const handleStencilRemove = (index) => {
    setPendingStencils((prevStencils) => {
      const updatedStencils = [...prevStencils];
      updatedStencils.splice(index, 1);
      return updatedStencils;
    });

    // Update the stencils state to reflect the removal
    setStencils((prevStencils) => {
      const updatedStencils = [...prevStencils];
      updatedStencils.splice(index, 1);
      return updatedStencils;
    });
  };

  const handleStencilSubmit = () => {
    setStencils([...pendingStencils]);
  };

  const imageWithStencilMemo1 = useMemo(
    () => imageWithStencil1,
    [imageWithStencil1]
  );
  const imageWithStencilMemo2 = useMemo(
    () => imageWithStencil2,
    [imageWithStencil2]
  );
  const imageStencilOnlyMemo1 = useMemo(
    () => imageStencilOnly1,
    [imageStencilOnly1]
  );
  const imageStencilOnlyMemo2 = useMemo(
    () => imageStencilOnly2,
    [imageStencilOnly2]
  );

  return (
    <div className="main-container">
      <div>
        <button className="btn-add-stencil" onClick={handleStencilAdd}>
          Add Stencil
        </button>
      </div>
      <div className="headline-inputs">
        <input
          type="text"
          placeholder="Headline Name"
          value={headlineName}
          onChange={(e) => setHeadlineName(e.target.value)}
        />
        <textarea
          placeholder="Headline Description"
          value={headlineDescription}
          onChange={(e) => setHeadlineDescription(e.target.value)}
        />
        <button className="btn-add-headline" onClick={handleHeadlineAdd}>
          Add Headline
        </button>
      </div>
      <div className="sidebar">
        <h2>Headlines</h2>
        <ul>
          {headlines.map((headline, index) => (
            <li key={index} onClick={() => setCurrentHeadlineIndex(index)}>
              {headline.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="settings-container">
        <h2 className="stencil-header">Stencil Settings</h2>
        {stencils.map((stencil, index) => (
          <div className="settings" key={index}>
            <button onClick={() => handleStencilRemove(index)}>Delete</button>
            <h3>{`Stencil ${index + 1}`}</h3>
            <StencilSettings
              stencil={stencil}
              onStencilChange={(property, value) =>
                handleStencilChange(index, property, value)
              }
            />
          </div>
        ))}
      </div>
      <div className="stencil-container">
        <div className="images-con">
          <ImageDisplay
            src={imageWithStencilMemo1}
            alt="Image 1 with stencil"
          />
          <ImageDisplay
            src={imageStencilOnlyMemo1}
            alt="Image 1 stencil only"
          />
          <ImageDisplay
            src={imageWithStencilMemo2}
            alt="Image 2 with stencil"
          />
          <ImageDisplay
            src={imageStencilOnlyMemo2}
            alt="Image 2 stencil only"
          />
        </div>
        <div>
          <ImageComparer
            description={description}
            image1={imageStencilOnlyMemo1}
            image2={imageStencilOnlyMemo2}
            image3={imageWithStencilMemo1}
            image4={imageWithStencilMemo2}
          />
        </div>

        <div>
          <ImageSplitter
            img1={imageStencilOnlyMemo1}
            img2={imageStencilOnlyMemo2}
            img3={imageWithStencilMemo1}
            img4={imageWithStencilMemo2}
            rows={rows}
            cols={cols}
          />
        </div>
      </div>
    </div>
  );
}

export default Stencil;
