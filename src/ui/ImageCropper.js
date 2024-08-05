import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const ImageCropper = ({ imageSrc }) => {
  const cropperRef = useRef(null);
  const [cropData, setCropData] = useState(null);

  const getCropData = () => {
    const cropper = cropperRef.current.cropper;
    const cropBoxData = cropper.getCropBoxData();
    const imageData = cropper.getImageData();
    const canvasData = cropper.getCanvasData();
    console.log(cropper)
    console.log(cropBoxData)
    console.log(imageData);
    console.log(cropper.getCroppedCanvas())
    // Calculate coordinates relative to the original image
    const scaleX = imageData.naturalWidth / imageData.width;
    const scaleY = imageData.naturalHeight / imageData.height;

    const coordinates = {
      startX: (cropBoxData.left - canvasData.left) * scaleX,
      startY: (cropBoxData.top - canvasData.top) * scaleY,
      endX: (cropBoxData.left - canvasData.left + cropBoxData.width) * scaleX,
      endY: (cropBoxData.top - canvasData.top + cropBoxData.height) * scaleY,
    };

    const relativeCoordinates = {
      TopLeftX: cropBoxData.left - canvasData.left,
      TopLeftY: cropBoxData.top - canvasData.top,
      BottomRightX: cropBoxData.left - canvasData.left + cropBoxData.width,
      BottomRightY: cropBoxData.top - canvasData.top + cropBoxData.height,
    };

    setCropData({
      coordinates,
      relativeCoordinates,
      croppedImage: cropper.getCroppedCanvas().toDataURL(),
    });
  };

  return (
    <div>
      <Cropper
        src={imageSrc}
        style={{ height: 300, width: '100%' }}
        initialAspectRatio={1}
        guides={true}
        ref={cropperRef}
        // cropend={() => getCropData()}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={true}
        responsive={true}
        autoCropArea={0}
        checkOrientation={false}
        rotatable={true}
        autoCrop={false}
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
