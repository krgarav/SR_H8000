import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Row } from "reactstrap";
import { Modal, Button, Col } from "react-bootstrap";
import classes from "./ImageCropper.module.css";
const ImageCropper = ({ imageSrc }) => {
  const cropperRef = useRef(null);
  const [cropData, setCropData] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  useEffect(() => {
    if (!modalShow) {
      document.body.classList.add(classes["blur-background"]);
    } else {
      document.body.classList.remove(classes["blur-background"]);
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove(classes["blur-background"]);
    };
  }, [modalShow]);
  const getCropData = () => {
    const cropper = cropperRef.current.cropper;
    const cropBoxData = cropper.getCropBoxData();
    const imageData = cropper.getImageData();
    const canvasData = cropper.getCanvasData();
    console.log(cropper);
    console.log(cropBoxData);
    console.log(imageData);
    console.log(cropper.getCroppedCanvas());
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
    setModalShow(true);
  };

  return (
    <>
      <div className="justify-content-center">
        <Cropper
          src={imageSrc}
          style={{ height: 300, width: "100%" }}
          initialAspectRatio={1}
          guides={true}
          ref={cropperRef}
          // cropend={() => getCropData()}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={true}
          responsive={true}
          // autoCropArea={0}
          checkOrientation={false}
          rotatable={true}
          // autoCrop={false}
        />

        {cropData && (
          <Modal
            show={modalShow}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter">
                Image Detail
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: "60vh" }}>
              <Row>
                <label htmlFor="imageName" className="col-md-4 ">
                  Image Name:
                </label>
                <div className="col-md-8">
                  <input
                    id="imageName"
                    type="text"
                    placeholder="Enter Image Name"
                    className="form-control"
                  />
                </div>
              </Row>
              <Row>
                <label htmlFor="croppingSide" className="col-md-4">
                  Cropping Side:
                </label>
                <div className="col-md-8">
                  <input
                    id="croppingSide"
                    type="text"
                    placeholder="Enter Cropping Side"
                    className="form-control"
                  />
                </div>
              </Row>
              <Row className="">
                <div className="col-12">
                  <img
                    src={cropData.croppedImage}
                    alt="Cropped"
                    className="img-fluid"
                  />
                </div>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                variant="danger"
                onClick={() => setModalShow(false)}
                className="waves-effect waves-light"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="success"
                onClick={() => setModalShow(false)}
                className="waves-effect waves-light"
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {/* {cropData &&
        <Row>
          <label
            htmlFor="example-text-input"
            className="col-md-2  col-form-label"
          >
            Image Name:
          </label>
          <div className="col-md-2">
            <input
              id="imageArea"
              type="text"
              placeholder="Enter Image Name"
              className="form-control"
            />
          </div>
          <label
            htmlFor="example-text-input"
            className="col-md-2 "
          >
            Cropping Side:
          </label>
          <div className="col-md-2">
            <input
              id="imageArea"
              type="text"
              placeholder="Enter Image Name"
              className="form-control"
            />
          </div>
          <div className="col-md-4">
            <Button>Select Coordinate</Button>
          </div>


        </Row>} */}
        {/* {cropData && (
        <div>
          <h3>Cropped Image</h3>
          <img src={cropData.croppedImage} alt="Cropped" />
          <h3>Coordinates</h3>
          <pre>{JSON.stringify(cropData.coordinates, null, 2)}</pre>
        </div>
      )} */}
      </div>
      <div style={{width:"100%",display:"flex",justifyContent:"center"}}>
      <Button  className="d-flex justify-content-center" onClick={getCropData}>
        Select region area
      </Button>
      </div>
     
    </>
  );
};

export default ImageCropper;
