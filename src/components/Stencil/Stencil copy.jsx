import React, { useEffect, useState } from "react";
import "./Stencil.css";
import StencilSettings from "./StencilSettings";
import ImageDisplay from "../ImageDisplay/ImageDisplay";
import ImageComparer from "../ImageComparer/ImageComparer";

function Stencil({ image1, image2 }) {
  const [stencils, setStencils] = useState([
    { width: 100, height: 100, top: 20, left: 20 },
  ]);

  const [imageWithStencil1, setImageWithStencil1] = useState(null);
  const [imageWithStencil2, setImageWithStencil2] = useState(null);
  const [imageStencilOnly1, setImageStencilOnly1] = useState(null);
  const [imageStencilOnly2, setImageStencilOnly2] = useState(null);

  useEffect(() => {
    const originalImage1 = new Image();
    originalImage1.src = image1;

    const originalImage2 = new Image();
    originalImage2.src = image2;

    const canvas1 = document.createElement("canvas");
    const ctx1 = canvas1.getContext("2d");

    const canvas2 = document.createElement("canvas");
    const ctx2 = canvas2.getContext("2d");

    const canvas3 = document.createElement("canvas");
    const ctx3 = canvas3.getContext("2d");

    const canvas4 = document.createElement("canvas");
    const ctx4 = canvas4.getContext("2d");

    originalImage1.onload = () => {
      canvas1.width = originalImage1.width;
      canvas1.height = originalImage1.height;
      canvas2.width = originalImage1.width;
      canvas2.height = originalImage1.height;

      // Create a transparent canvas for the stencil-only image
      const stencilOnlyCanvas1 = document.createElement("canvas");
      stencilOnlyCanvas1.width = canvas1.width;
      stencilOnlyCanvas1.height = canvas1.height;
      const stencilOnlyCtx1 = stencilOnlyCanvas1.getContext("2d");

      // Draw the stencil on the stencil-only canvas with a black fill
      stencilOnlyCtx1.fillStyle = "black";
      stencils.forEach((stencil) => {
        stencilOnlyCtx1.fillRect(
          stencil.left,
          stencil.top,
          stencil.width,
          stencil.height
        );
      });

      // Use the stencil as a mask for the original image
      stencilOnlyCtx1.globalCompositeOperation = "source-in";
      stencilOnlyCtx1.drawImage(originalImage1, 0, 0);

      // Get the generated stencil-only image for image1
      const stencilOnlyImage1 = stencilOnlyCanvas1.toDataURL("image/jpeg");
      setImageStencilOnly1(stencilOnlyImage1);

      // Draw the original image on canvas2
      ctx2.drawImage(originalImage1, 0, 0);

      // Draw the stencil on canvas2
      ctx2.fillStyle = "black";
      stencils.forEach((stencil) => {
        ctx2.fillRect(stencil.left, stencil.top, stencil.width, stencil.height);
      });

      // Get the generated image with stencil for image1
      const imageWithStencilURL1 = canvas2.toDataURL("image/jpeg");
      setImageWithStencil1(imageWithStencilURL1);
    };

    // When the original images load, update the canvases for image2
    originalImage2.onload = () => {
      canvas3.width = originalImage2.width;
      canvas3.height = originalImage2.height;
      canvas4.width = originalImage2.width;
      canvas4.height = originalImage2.height;

      // Create a transparent canvas for the stencil-only image
      const stencilOnlyCanvas2 = document.createElement("canvas");
      stencilOnlyCanvas2.width = canvas3.width;
      stencilOnlyCanvas2.height = canvas3.height;
      const stencilOnlyCtx2 = stencilOnlyCanvas2.getContext("2d");

      // Draw the stencil on the stencil-only canvas with a black fill
      stencilOnlyCtx2.fillStyle = "black";
      stencils.forEach((stencil) => {
        stencilOnlyCtx2.fillRect(
          stencil.left,
          stencil.top,
          stencil.width,
          stencil.height
        );
      });

      // Use the stencil as a mask for the original image
      stencilOnlyCtx2.globalCompositeOperation = "source-in";
      stencilOnlyCtx2.drawImage(originalImage2, 0, 0);

      // Get the generated stencil-only image for image2
      const stencilOnlyImage2 = stencilOnlyCanvas2.toDataURL("image/jpeg");
      setImageStencilOnly2(stencilOnlyImage2);

      // Draw the original image on canvas4
      ctx4.drawImage(originalImage2, 0, 0);

      // Draw the stencil on canvas4
      ctx4.fillStyle = "black";
      stencils.forEach((stencil) => {
        ctx4.fillRect(stencil.left, stencil.top, stencil.width, stencil.height);
      });

      // Get the generated image with stencil for image2
      const imageWithStencilURL2 = canvas4.toDataURL("image/jpeg");
      setImageWithStencil2(imageWithStencilURL2);
    };
  }, [image1, image2, stencils]);

  const handleStencilAdd = () => {
    const newStencil = { width: 100, height: 100, top: 20, left: 20 };
    setStencils([...stencils, newStencil]);
  };

  const handleStencilChange = (index, property, value) => {
    const updatedStencils = [...stencils];
    updatedStencils[index] = {
      ...updatedStencils[index],
      [property]: value,
    };
    setStencils(updatedStencils);
  };

  const handleStencilRemove = (index) => {
    const updatedStencils = [...stencils];
    updatedStencils.splice(index, 1);
    setStencils(updatedStencils);
  };

  const [selectedStencil, setSelectedStencil] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const handleStencilMouseDown = (e, index) => {
    e.preventDefault();
    setSelectedStencil(index);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Function to handle mouse move event for a selected stencil
  const handleStencilMouseMove = (e) => {
    if (selectedStencil !== null) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      const updatedStencils = [...stencils];
      updatedStencils[selectedStencil] = {
        ...stencils[selectedStencil],
        left: stencils[selectedStencil].left + dx,
        top: stencils[selectedStencil].top + dy,
      };

      setStencils(updatedStencils);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Function to handle mouse up event for a selected stencil
  const handleStencilMouseUp = () => {
    setSelectedStencil(null);
  };
  return (
    <div>
      <div>
        <button onClick={handleStencilAdd}>Add Stencil</button>
        {stencils.map((stencil, index) => (
          <div
            key={index}
            onMouseDown={(e) => handleStencilMouseDown(e, index)} // Add mouse down event listener
            onMouseMove={handleStencilMouseMove} // Add mouse move event listener
            onMouseUp={handleStencilMouseUp} // Add mouse up event listener
            style={{
              position: "absolute",
              width: stencil.width,
              height: stencil.height,
              top: stencil.top,
              left: stencil.left,
              backgroundColor: "black",
              opacity: 0.5,
            }}
          >
            <button onClick={() => handleStencilRemove(index)}>
              Remove Stencil
            </button>
          </div>
        ))}

        <ImageDisplay src={imageWithStencil1} alt="Image 1 with stencil" />
        <ImageDisplay src={imageStencilOnly1} alt="Image 1 stencil only" />
        <ImageDisplay src={imageWithStencil2} alt="Image 2 with stencil" />
        <ImageDisplay src={imageStencilOnly2} alt="Image 2 stencil only" />
        <div>
          <ImageComparer
            image1={imageStencilOnly1}
            image2={imageStencilOnly2}
          />
          <ImageComparer
            image1={imageWithStencil1}
            image2={imageWithStencil2}
          />
        </div>
      </div>
    </div>
  );
}

export default Stencil;
