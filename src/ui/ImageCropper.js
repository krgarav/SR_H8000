import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCropper = ({ imageSrc }) => {
  const cropperRef = useRef(null);
  const [cropData, setCropData] = useState(null);

  const getCropData = () => {
    const cropper = cropperRef.current.cropper;
    const cropBoxData = cropper.getCropBoxData();
    const imageData = cropper.getImageData();
    const croppedCanvas = cropper.getCroppedCanvas();

    const coordinates = {
      x: cropBoxData.left - imageData.left,
      y: cropBoxData.top - imageData.top,
      width: cropBoxData.width,
      height: cropBoxData.height,
    };

    setCropData({
      coordinates,
      croppedImage: croppedCanvas.toDataURL(),
    });
  };

  return (
    <div>
      <Cropper
        src={imageSrc}
        style={{ height: 350, width: "100%" }}
        initialAspectRatio={1}
        guides={false}
        ref={cropperRef}
      />
      <button onClick={getCropData}>Get Crop Data</button>
      {cropData && (
        <div>
          <h3>Cropped Image</h3>
          <img src={cropData.croppedImage} alt="Cropped" />
          <h3>Coordinates</h3>
          <pre>{JSON.stringify(cropData.coordinates, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
