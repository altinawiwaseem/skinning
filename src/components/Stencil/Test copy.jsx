import React, { useEffect, useState } from "react";
import "./Stencil.css";
import StencilSettings from "./StencilSettings";
import ImageDisplay from "../ImageDisplay/ImageDisplay";
import ImageComparer from "../ImageComparer/ImageComparer";

function Stencil({ image1, image2 }) {
  const [stencilWidth, setStencilWidth] = useState(100);
  const [stencilHeight, setStencilHeight] = useState(100);
  const [stencilTop, setStencilTop] = useState(20);
  const [stencilLeft, setStencilLeft] = useState(20);

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

      // Draw the original image on canvas1
      ctx1.drawImage(originalImage1, 0, 0);

      // Draw the stencil on canvas2
      ctx2.drawImage(originalImage1, 0, 0);
      ctx2.fillStyle = "black";
      ctx2.fillRect(stencilLeft, stencilTop, stencilWidth, stencilHeight);

      // Get the generated image with stencil for image1
      const imageWithStencilURL1 = canvas2.toDataURL("image/jpeg");
      setImageWithStencil1(imageWithStencilURL1);

      // Create a copy of canvas1 for stencil-only image
      const stencilOnlyCanvas1 = document.createElement("canvas");
      const stencilOnlyCtx1 = stencilOnlyCanvas1.getContext("2d");
      stencilOnlyCanvas1.width = canvas1.width;
      stencilOnlyCanvas1.height = canvas1.height;

      stencilOnlyCtx1.fillStyle = "white";
      stencilOnlyCtx1.fillRect(0, 0, canvas1.width, canvas1.height);

      // Draw the original image on stencil-only canvas
      stencilOnlyCtx1.drawImage(canvas1, 0, 0);

      // Apply stencil effect for stencil-only image
      stencilOnlyCtx1.globalCompositeOperation = "destination-in";
      stencilOnlyCtx1.fillStyle = "white";
      stencilOnlyCtx1.fillRect(
        stencilLeft,
        stencilTop,
        stencilWidth,
        stencilHeight
      );

      const stencilOnlyImage1 = stencilOnlyCanvas1.toDataURL("image/jpeg");
      setImageStencilOnly1(stencilOnlyImage1);
    };

    // When the original images load, update the canvases for image2
    originalImage2.onload = () => {
      // Set canvas dimensions to match the image dimensions
      canvas3.width = originalImage2.width;
      canvas3.height = originalImage2.height;
      canvas4.width = originalImage2.width;
      canvas4.height = originalImage2.height;

      // Draw the original image on canvas3
      ctx3.drawImage(originalImage2, 0, 0);

      // Draw the stencil on canvas4
      ctx4.drawImage(originalImage2, 0, 0);
      ctx4.fillStyle = "black";
      ctx4.fillRect(stencilLeft, stencilTop, stencilWidth, stencilHeight);

      const imageWithStencilURL2 = canvas4.toDataURL("image/jpeg");
      setImageWithStencil2(imageWithStencilURL2);

      const stencilOnlyCanvas2 = document.createElement("canvas");
      const stencilOnlyCtx2 = stencilOnlyCanvas2.getContext("2d");
      stencilOnlyCanvas2.width = canvas3.width;
      stencilOnlyCanvas2.height = canvas3.height;
      stencilOnlyCtx2.drawImage(canvas3, 0, 0);

      stencilOnlyCtx2.globalCompositeOperation = "destination-in";
      stencilOnlyCtx2.fillStyle = "white";
      stencilOnlyCtx2.fillRect(
        stencilLeft,
        stencilTop,
        stencilWidth,
        stencilHeight
      );

      const stencilOnlyImage2 = stencilOnlyCanvas2.toDataURL("image/jpeg");
      setImageStencilOnly2(stencilOnlyImage2);
    };
  }, [image1, image2, stencilWidth, stencilHeight, stencilTop, stencilLeft]);

  const handleStencilWidthChange = (e) => {
    setStencilWidth(e.target.value);
  };

  const handleStencilHeightChange = (e) => {
    setStencilHeight(e.target.value);
  };

  const handleStencilTopChange = (e) => {
    setStencilTop(e.target.value);
  };

  const handleStencilLeftChange = (e) => {
    setStencilLeft(e.target.value);
  };

  return (
    <div>
      <div>
        <StencilSettings
          stencilWidth={stencilWidth}
          stencilHeight={stencilHeight}
          stencilTop={stencilTop}
          stencilLeft={stencilLeft}
          onWidthChange={handleStencilWidthChange}
          onHeightChange={handleStencilHeightChange}
          onTopChange={handleStencilTopChange}
          onLeftChange={handleStencilLeftChange}
        />

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
