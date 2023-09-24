import React, { useEffect, useRef, useState } from "react";
import * as ssim from "image-ssim";

function SSIMCalculator({ image1, image2 }) {
  const imageData1Ref = useRef(null);
  const imageData2Ref = useRef(null);
  const [ssiValue, setSsiValue] = useState(null);

  console.log(ssim);
  useEffect(() => {
    // Load the two images
    const img1 = new Image();
    img1.src = image1;

    const img2 = new Image();
    img2.src = image2;

    // Calculate SSIM when both images are loaded
    Promise.all([loadImage(img1), loadImage(img2)]).then(([data1, data2]) => {
      imageData1Ref.current = data1;
      imageData2Ref.current = data2;
      console.log(imageData1Ref);
      console.log(imageData2Ref);
      const ssi = ssim(data1, data2);
      setSsiValue(ssi);
    });
  }, [image1, image2]);

  const loadImage = (image) => {
    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        resolve(imageData.data);
      };
    });
  };

  return (
    <div>
      <h2>Structural Similarity Index (SSI)</h2>
      {ssiValue !== null && (
        <p>SSI between the images: {ssiValue.toFixed(4)}</p>
      )}
    </div>
  );
}

export default SSIMCalculator;
