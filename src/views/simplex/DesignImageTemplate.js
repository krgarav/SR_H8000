import React, { useState, useEffect, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Modal, Button, Col, Badge, Spinner } from "react-bootstrap";
import {
  Row,
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import SmallHeader from "components/Headers/SmallHeader";
import ReactDOM from "react-dom";
// import CroppedData from "components/CroppedData";

const Popup = (props) => {
  return ReactDOM.createPortal(
    <div
    style={props.style}
      // style={{
      //   position: "fixed",
      //   top: 0,
      //   left: 0,
      //   width: "100vw",
      //   height: "100vh",
      //   background: "rgba(0, 0, 0, 0.5)",
      //   zindex: 9998,
      //   // zIndex: 9999,
      //   // position: "fixed",
      //   // top: "50%",
      //   // left: "50%",
      //   // transform: "translate(-50%, -50%)",
      //   // background: "#000",
      //   // color: "#fff",
      //   // padding: "20px",
      //   // borderRadius: "8px"
      // }}
    >
      gfdgf
    </div>,
    document.getElementById("tyrt") // target div outside root
  );
};
const DesignImageTemplate = () => {
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [allCoordinates, setAllCoordinates] = useState([]);
  const [cropBoxes, setCropBoxes] = useState([]);
  const [boxData, setSetBoxData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [fieldDetails, setFieldDetails] = useState({});
  const [modalUpdate, setModalUpdate] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState(null);
  const [allFields, setAllFields] = useState([]);
  const [updatesBoxData, setUpdatesBoxData] = useState([]);
  const cropperRef = useRef(null);
  console.log(fieldDetails);
  useEffect(() => {
    setFieldDetails((prev) => {
      return { ...prev, selectedFieldType: selectedFieldType };
    });
  }, [selectedFieldType]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (cropperRef.current?.cropper) {
        const cropper = cropperRef.current.cropper;

        // Ensure both getImageData() and getCanvasData() are available
        if (
          typeof cropper.getImageData === "function" &&
          typeof cropper.getCanvasData === "function"
        ) {
          const imageData = cropper.getImageData();
          const canvasData = cropper.getCanvasData();

          if (!imageData || !canvasData) {
            console.warn(
              "imageData or canvasData is undefined, skipping calculation."
            );
            return;
          }
          console.log(cropBoxes);
          
          if (cropBoxes.length > 0) {
            const boxes = cropBoxes.map((item, index) => {
              // 🔥 Adjust for zoom and position using canvasData
              const scaleX = canvasData.width / imageData.naturalWidth;
              const scaleY = canvasData.height / imageData.naturalHeight;
              const relativeTop = item.topLeftY * scaleY + canvasData.top;
              const relativeLeft = item.topLeftX * scaleX + canvasData.left;
              const relativeWidth =
                (item.bottomRightX - item.topLeftX) * scaleX;
              const relativeHeight =
                (item.bottomRightY - item.topLeftY) * scaleY;
              return (
                <div
                  key={index}
                  onClick={handleBoxClick}
                  style={{
                    position: "absolute",
                    top: `${relativeTop}px`,
                    left: `${relativeLeft}px`,
                    width: `${relativeWidth}px`,
                    height: `${relativeHeight}px`,
                    border: "2px solid blue",
                    pointerEvents: "none",
                    
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    padding: "4px",
                    boxSizing: "border-box",
                  }}
                >
                  {/* {Array.from({ length: 10 }).map((_, rowIdx) => (
                    <div
                      key={rowIdx}
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        width: "100%",
                        height: `${100 / 10}%`, // 10 rows
                      }}
                    >
                      {Array.from({ length: 8 }).map((_, colIdx) => (
                        <div
                          key={colIdx}
                          style={{
                            aspectRatio: "1", // keep it a circle
                            height: "80%", // slightly smaller than row height to add spacing
                            borderRadius: "50%",
                            border: "1px solid black",
                            backgroundColor: "white",
                            boxSizing: "border-box",
                          }}
                        />
                      ))}
                    </div>
                  ))} */}
                </div>
                
              );
            });
            console.log(boxes);
            setAllCoordinates(boxes);
          }
        } else {
          console.warn(
            "cropper.getImageData or cropper.getCanvasData is not available yet."
          );
        }
      }
    }, 60); // Slight delay to ensure Cropper is ready
    console.log("called");
    return () => clearTimeout(timeoutId); // Cleanup function to prevent memory leaks
  }, [cropData, cropBoxes, updatesBoxData]);

  const handleBoxClick = (event) => {
    console.log(event.target);
  };
  const handleRadioChange = (e) => {
    setSelectedFieldType(e.target.value);
  };
  const getCropData = () => {
    const cropper = cropperRef.current.cropper;
    const cropBoxData = cropper.getCropBoxData();
    const imageData = cropper.getImageData();
    const canvasData = cropper.getCanvasData();
    // Calculate coordinates relative to the original image
    const scaleX = imageData.naturalWidth / imageData.width;
    const scaleY = imageData.naturalHeight / imageData.height;

    const coordinates = {
      topLeftX: (cropBoxData.left - canvasData.left) * scaleX,
      topLeftY: (cropBoxData.top - canvasData.top) * scaleY,
      bottomRightX:
        (cropBoxData.left - canvasData.left + cropBoxData.width) * scaleX,
      bottomRightY:
        (cropBoxData.top - canvasData.top + cropBoxData.height) * scaleY,
    };

    const relativeCoordinates = {
      topLeftX: cropBoxData.left - canvasData.left,
      topLeftY: cropBoxData.top - canvasData.top,
      bottomRightX: cropBoxData.left - canvasData.left + cropBoxData.width,
      bottomRightY: cropBoxData.top - canvasData.top + cropBoxData.height,
    };

    setCropData({
      coordinates,
      relativeCoordinates,
      croppedImage: cropper.getCroppedCanvas().toDataURL(),
    });
  };

  const saveHandler = () => {
    if (cropData) {
      //   const obj = cropData?.relativeCoordinates;
      const obj = cropData?.coordinates;
      console.log(obj);
      // dispatch(obj)
      setCropBoxes((prev) => {
        return [...prev, obj];
      });
      const { topLeftX, topLeftY, bottomRightX, bottomRightY } =
        cropData.coordinates;

      const obj2 = {
        x: topLeftX,
        y: topLeftY,
        width: bottomRightX - topLeftX,
        height: bottomRightY - topLeftY,
      };
      setFieldDetails(() => {
        return {
          x: topLeftX,
          y: topLeftY,
          width: bottomRightX - topLeftX,
          height: bottomRightY - topLeftY,
        };
      });
      // setSetBoxData((prev) => [...prev, obj2]);
      setSetBoxData(obj2);
      setModalShow(true);
    }
  };

  const handleSave = () => {
    setAllFields((prev) => [...prev, fieldDetails]);
    setModalShow(false);
  };

  const handleCancel = () => {
    // setDragStart(null);
    // setSelection(null);
    setModalShow(false);
    setModalUpdate(false);
  };

  const clearSelection = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.clear();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert file to a data URL for preview/storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Store base64 image in state
      };
      reader.readAsDataURL(file);
    }
  };
  const editHandler = (d, i) => {
    const updatedData = allCoordinates.map((item, index) => {
      if (index === i) {
        const updatedStyle = {
          ...(item.props.style || {}),
          border: "2px solid green",
        };

        return React.cloneElement(item, {
          style: updatedStyle,
        });
      }
      return item;
    });
    // const cropboxPos = cropBoxes[i];
    // console.log(cropboxPos)
    // Set the cropper to the same dimensions
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;

      const item = allFields[i]; // assuming this has topLeftX, topLeftY, bottomRightX, bottomRightY

      const imageData = cropper.getImageData(); // original image dimensions
      const canvasData = cropper.getCanvasData(); // current scaled image dimensions & position

      // Calculate scale factors
      const scaleX = canvasData.width / imageData.naturalWidth;
      const scaleY = canvasData.height / imageData.naturalHeight;

      // Calculate relative position and size of the crop box
      const relativeLeft = item.x * scaleX + canvasData.left;
      const relativeTop = item.y * scaleY + canvasData.top;
      const relativeWidth = item.width * scaleX;
      const relativeHeight = item.height * scaleY;
      console.log(relativeLeft, relativeTop);
      console.log(relativeWidth, relativeHeight);
      // Set crop box with calculated values
      cropper.setCropBoxData({
        left: relativeLeft,
        top: relativeTop,
        width: relativeWidth,
        height: relativeHeight,
      });

      // Optional: Also scroll/move the image to the crop box
      // cropper.setCanvasData({ left: relativeLeft, top: relativeTop });
    }
    setFieldDetails(allFields[i]);
    // setAllCoordinates(updatedData);
    setModalShow(true);
  };

  const LoadedTemplates = allFields?.map((d, i) => (
    <tr
      key={i}
      // onClick={() => handleRowClick(d, i)}
      style={{ cursor: "pointer" }} // Adds a pointer cursor on hover
    >
      <td>{i + 1}</td>
      <td>{d.name}</td>
      <td>{d.selectedFieldType}</td>

      <td className="text-right">
        <UncontrolledDropdown>
          <DropdownToggle
            className="btn-icon-only text-light"
            href="#pablo"
            role="button"
            size="sm"
            color=""
            onClick={(e) => e.preventDefault()}
          >
            <i className="fas fa-ellipsis-v" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-arrow" right>
            <DropdownItem onClick={() => editHandler(d, i)}>Edit</DropdownItem>
            <DropdownItem
            // onClick={() => duplicateHandler(d)}
            >
              Duplicate
            </DropdownItem>
            <DropdownItem
              style={{ color: "red" }}
              // onClick={() => deleteHandler(d, i)}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </td>
    </tr>
  ));
  return (
    <>
      <div>
        <div style={{ position: "sticky", top: 0, zIndex: 99 }}>
          <SmallHeader />
        </div>
        <div>
          <label>Upload File</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <section style={{ display: "flex", flexDirection: "row" }}>
          <div
            className="border border-primary"
            style={{ position: "relative" }}
          >
            <Cropper
              src={image}
              style={{ height: "80dvh" }}
              initialAspectRatio={1}
              guides={true}
              ref={cropperRef}
              cropend={() => getCropData()}
              zoom={() => setUpdatesBoxData((prev) => !prev)} // 🔥 Update boxes on zoom
              //   cropmove={() => updateCoordinates()}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={true}
              responsive={true}
              autoCropArea={0}
              checkOrientation={false}
              rotatable={true}
              autoCrop={false}
              zoomable={true}
            />
            {allCoordinates}
            <div className="d-flex justify-content-center flex-grow-1">
              <Button
                type="button"
                variant="success"
                onClick={saveHandler}
                className="waves-effect waves-light"
              >
                Save
              </Button>
              <button
                // active={currentImage === imageSrc}
                onClick={clearSelection}
              >
                Clear selection
              </button>
            </div>
          </div>

          <div>
            {boxData.length > 0 && (
              <table
                border="1"
                cellPadding="10"
                style={{ marginTop: "20px", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>X</th>
                    <th>Y</th>
                    <th>Width</th>
                    <th>Height</th>
                  </tr>
                </thead>
                <tbody>
                  {boxData.map((box, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{box.x.toFixed(2)}</td>
                      <td>{box.y.toFixed(2)}</td>
                      <td>{box.width.toFixed(2)}</td>
                      <td>{box.height.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <Table className="align-items-center table-flush mb-5 table-hover">
              <thead
                className="thead-light"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "white",
                }}
              >
                <tr>
                  <th scope="col">SL no.</th>
                  <th scope="col">Field Name</th>
                  <th scope="col">Field Type</th>

                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>{LoadedTemplates}</tbody>
            </Table>
          </div>
        </section>
      </div>

      <Modal
        show={modalShow}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title
            id="contained-modal-title-vcenter"
            style={{ width: "100vw" }}
          >
            <h2 className="text-center">
              {!modalUpdate ? "Choose field type" : selectedFieldType}
            </h2>
            <br />

            {!modalUpdate && (
              <Row className="mb-2 d-flex align-items-center">
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <label htmlFor="formField" className="mr-2 mb-0 field-label">
                    Form:
                  </label>
                  <input
                    id="formField"
                    type="radio"
                    name="fieldType"
                    value="formField"
                    checked={selectedFieldType === "formField"}
                    onChange={(e) => {
                      setSelectedFieldType(e.target.value);
                    }}
                    className="field-label mt-1"
                  />
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  className="d-flex align-items-center"
                >
                  <label htmlFor="fieldType" className="mr-2 mb-0 field-label">
                    Question:
                  </label>
                  <input
                    id="fieldType"
                    type="radio"
                    name="fieldType"
                    value="questionField"
                    checked={selectedFieldType === "questionField"}
                    onChange={handleRadioChange}
                    className="field-label mt-1"
                  />
                </Col>
              </Row>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "55vh", overflowX: "auto" }}>
          {selectedFieldType && (
            <>
              <Row className="mb-2">
                <label
                  htmlFor="example-text-input"
                  className="col-md-2  "
                  // style={{ fontSize: "0.8rem" }}
                >
                  Field Name
                </label>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Window Name"
                    value={fieldDetails.name}
                    onChange={(e) =>
                      setFieldDetails((prev) => {
                        return { ...prev, name: e.target.value };
                      })
                    }
                    required
                    style={{ color: "black" }}
                  />
                </div>
              </Row>

              <Row className="mb-3">
                <label htmlFor="example-text-input" className="col-md-2 ">
                  Reading Direction
                </label>
                <div className="col-md-10">
                  <select
                    className="form-control"
                    value={fieldDetails.readingDirection}
                    onChange={(e) =>
                      setFieldDetails((prev) => {
                        return { ...prev, readingDirection: e.target.value };
                      })
                    }
                  >
                    <option value="">Select reading direction... </option>
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                  </select>
                </div>
              </Row>

              <Row className="mb-2">
                <label
                  htmlFor="example-text-input"
                  className="col-md-2 col-form-label "
                >
                  Rows
                </label>
                <div className="col-4 ">
                  <input
                    type="text"
                    className="form-control"
                    value={fieldDetails.totalRows}
                    onChange={(e) =>
                      setFieldDetails((prev) => {
                        return { ...prev, totalRows: e.target.value };
                      })
                    }
                    required
                  />
                </div>
                <label
                  htmlFor="example-text-input"
                  className="col-md-2 col-form-label "
                >
                  Columns
                </label>
                <div className="col-4 ">
                  <input
                    type="text"
                    className="  form-control"
                    value={fieldDetails.totalCols}
                    onChange={(e) =>
                      setFieldDetails((prev) => {
                        return { ...prev, totalCols: e.target.value };
                      })
                    }
                    required
                  />
                </div>
              </Row>
              <Row className="mb-2">
                <label htmlFor="example-text-input" className="col-md-2 ">
                  Total Fields
                </label>
                <div className="col-4 ">
                  <input
                    type="text"
                    className="form-control"
                    value={fieldDetails.totalFields}
                    onChange={(e) =>
                      setFieldDetails((prev) => {
                        return { ...prev, totalFields: e.target.value };
                      })
                    }
                    required
                  />
                </div>
                <label htmlFor="example-text-input" className="col-md-2 ">
                  Field Type
                </label>
                <div className="col-4 ">
                  <select
                    className="form-control"
                    value={fieldDetails.fieldType}
                    onChange={(e) =>
                      setFieldDetails((prev) => {
                        return { ...prev, fieldType: e.target.value };
                      })
                    }
                    defaultValue={""}
                  >
                    <option value="">Select field type... </option>
                    <option value="numeric">Numeric </option>
                    <option value="alphabet">Alphabet </option>
                    <option value="custom">Custom </option>
                  </select>
                </div>
              </Row>
              <Row className="mb-2">
                <label
                  htmlFor="example-text-input"
                  className="col-md-2 col-form-label "
                >
                  X
                </label>
                <div className="col-4 ">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={fieldDetails.x}
                    required
                  />
                </div>
                <label
                  htmlFor="example-text-input"
                  className="col-md-2 col-form-label "
                >
                  Y
                </label>
                <div className="col-4 ">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={fieldDetails.y}
                    // onChange={(e) => setNumberOfField(e.target.value)}
                    required
                  />
                </div>
              </Row>
              <Row className="mb-2">
                <label
                  htmlFor="example-text-input"
                  className="col-md-2 col-form-label "
                >
                  Width
                </label>
                <div className="col-4 ">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={fieldDetails.width}
                    required
                  />
                </div>
                <label
                  htmlFor="example-text-input"
                  className="col-md-2 col-form-label "
                >
                  Height
                </label>
                <div className="col-4 ">
                  <input
                    type="text"
                    className="  form-control"
                    disabled
                    value={fieldDetails.height}
                    required
                  />
                </div>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            onClick={() => {
              setModalShow(false);
            }}
            variant="warning"
            style={{ marginRight: "auto" }}
          >
            Hide Modal
          </Button>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              type="button"
              variant="danger"
              onClick={handleCancel}
              className="waves-effect waves-light"
            >
              Cancel
            </Button>
            <Button
              type="button"
              color="success"
              onClick={handleSave}
              className="waves-effect waves-light"
            >
              {!modalUpdate ? "Save" : "Update"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DesignImageTemplate;
