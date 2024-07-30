import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, Button, Col } from "react-bootstrap";
import { Row } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./DesignTemplate.module.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Draggable from 'react-draggable';
import { Rnd } from 'react-rnd';
import DataContext from "store/DataContext";
import { MultiSelect } from "react-multi-select-component";
import axios from 'axios';
import { createTemplate } from "helper/TemplateHelper";
import { getLayoutDataById } from "helper/TemplateHelper";
import jsonData from "data/csvjson";
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    UncontrolledTooltip,
} from "reactstrap";
import SmallHeader from "components/Headers/SmallHeader";
const URL = process.env.REACT_APP_BACKEND_URL;
const DesignTemplate = () => {
    const [selected, setSelected] = useState({});
    const [selection, setSelection] = useState(null);
    const [dragStart, setDragStart] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [selectedClass, setSelectedClass] = useState("circle")
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [selectedCoordinates, setSelectedCoordinates] = useState([]);

    const [name, setName] = useState();
    const [frameType, setFrameType] = useState({});
    const [frameUnit, setFrameUnit] = useState({});
    const [outputDataSetting, setOutputDataSetting] = useState({});
    const [developementDirection, setDevelopementDirection] = useState({});
    const [outputOrderDirection, setOutputOrderDirection] = useState({});
    const [lineInterval, setLineinterval] = useState(0);
    const [columnInterval, setColumnInterval] = useState(0);
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [skewoption, setSkewOption] = useState("none");
    const [windowNgOption, setWindowNgOption] = useState("")
    const [readingDirectionOption, setReadingDirectionOption] = useState("")
    const [minimumMark, setMinimumMark] = useState();
    const [maximumMark, setMaximumMark] = useState();
    const [noInRow, setNoInRow] = useState();
    const [noOfStepInRow, setNoOfStepInRow] = useState();
    const [noInCol, setNoInCol] = useState();
    const [noOfStepInCol, setNoOfStepInCol] = useState();
    const [option, setOption] = useState("")
    const [type, setType] = useState("")
    const [selectedFieldType, setSelectedFieldType] = useState('formField');
    const [fieldType, setFieldType] = useState();
    const [numberOfField, setNumberOfField] = useState();
    const [imageState, setImageState] = useState({ x: 0, y: 0, width: 400, height: 400 });
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
        width: 400,
        height: 400,
    });
    const [loading, setLoading] = useState(false)
    const dataCtx = useContext(DataContext);
    const {
        totalColumns,
        timingMarks,
        templateImagePath,
        bubbleType,
        templateIndex,
        iSensitivity,
        iDifference,
        iReject,
        iFace,
        arr,
        templateId
    } = useLocation().state;
    const [selectedCol, setSelectedCol] = useState([]);
    const [options, setOptions] = useState([]);
    const [idNumber, setIdNumber] = useState("");
    const [layoutFieldData, setLayoutFieldData] = useState();
    const [multipleValue, setMultipleValue] = useState("");
    const [blankValue, setBlankValue] = useState("");
    const [multiple, setMultiple] = useState("");
    const [blank, setBlank] = useState("");
    const rndRef = useRef();
    const navigate = useNavigate();
    const numRows = timingMarks;
    const numCols = totalColumns;

    const handleDragStop = (e, d) => {
        setPosition((prev) => ({ ...prev, x: d.x, y: d.y }));
    };

    const handleResizeStop = (e, direction, ref, delta, position) => {
        setPosition({
            x: position.x,
            y: position.y,
            width: ref.style.width.replace('px', ''),
            height: ref.style.height.replace('px', ''),
        });
    };
    const toggleSelection = (row, col) => {
        const key = `${row},${col}`;
        setSelected((prev) => {
            const newState = { ...prev, [key]: !prev[key] };

            return newState;
        });
    }

    // Function to get the current position and dimensions
    const getCurrentImageState = () => {
        if (rndRef.current) {
            const { x, y, width, height } = rndRef.current.resizableElement.current.getBoundingClientRect();
            return { x, y, width, height };
        }
        return null;
    };
    useEffect(() => {
        if (arr) {
            // Extract parameters from the first element of the array (if it exists)
            const formFieldData = arr[0]?.formFieldWindowParameters;
            const questionField = arr[0]?.questionsWindowParameters;
            const skewField = arr[0]?.skewMarksWindowParameters;
            const idField = arr[0]?.layoutParameters;

            // Map each set of parameters to their coordinates or default to an empty array
            const coordinateOfFormData = formFieldData?.map(item => item.Coordinate) ?? [];
            const coordinateOfQuestionField = questionField?.map(item => item.Coordinate) ?? [];
            const coordinateOfSkewField = skewField?.map(item => item.Coordinate) ?? [];
            const coordinateOfIdField = idField?.Coordinate ?? [];

            // Combine all coordinates into a single array
            const allCoordinates = [
                ...coordinateOfFormData,
                ...coordinateOfQuestionField,
                ...coordinateOfSkewField,
                coordinateOfIdField
            ];

            // Map each coordinate to a new format
            const newSelectedFields = allCoordinates?.map(item => {
                const { "Start Row": startRow, "Start Col": startCol, "End Row": endRow, "End Col": endCol, name } = item;
                return { startRow, startCol, endRow, endCol, name };
            });

            // Update the state with the new coordinates and image structure data
            setSelectedCoordinates(newSelectedFields);
            setPosition(idField?.imageStructureData);
        }
    }, []); // Run only once on component mount


    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch layout data by template ID
                const response = await getLayoutDataById(templateId);
                console.log(response);
                setLayoutFieldData(response)
                if (response) {
                    // Extract data from the response
                    const formFieldData = response?.formFieldWindowParameters ?? [];
                    const questionField = response?.questionsWindowParameters ?? [];
                    const skewField = response?.skewMarksWindowParameters ?? [];
                    const idField = response?.layoutParameters ?? {};

                    // Map and restructure data for coordinates
                    const coordinateOfFormData = formFieldData.map(item => ({
                        ...item.formFieldCoordinates, name: item.windowName
                    }));

                    const coordinateOfQuestionField = questionField.map(item => ({
                        ...item.questionWindowCoordinates, name: item.windowName
                    }));

                    const coordinateOfSkewField = skewField.map(item => ({
                        ...item.layoutWindowCoordinates, name: item.windowName
                    }));

                    const coordinateOfIdField = idField.layoutCoordinates ?? [];

                    // Combine all coordinates into a single array
                    const allCoordinates = [
                        ...coordinateOfFormData,
                        ...coordinateOfQuestionField,
                        ...coordinateOfSkewField,
                        coordinateOfIdField
                    ];

                    // Format the coordinates for the state update
                    const newSelectedFields = allCoordinates.map(item => {
                        const { start: startRow, left: startCol, end: endRow, right: endCol, name } = item;
                        return { startRow, startCol, endRow, endCol, name };
                    });

                    // Update state with the formatted coordinates and image data
                    setSelectedCoordinates(newSelectedFields);
                    setPosition(idField?.imageCoordinates);
                }
            } catch (error) {
                console.error('Error fetching layout data:', error);
            }
        };

        // Call the fetch details function
        fetchDetails();
    }, [templateId]);
    useEffect(() => {
        console.log(templateIndex)
        console.log(layoutFieldData)
        if (layoutFieldData) {
            dataCtx.addFieldToTemplate(layoutFieldData, templateIndex)
            console.log("called")
        }
    }, [layoutFieldData])
    useEffect(() => {
        switch (bubbleType) {
            case "rounded rectangle":
                setSelectedClass("rounded-rectangle")
                break;
            case "rectangle":
                setSelectedClass("rectangle")
                break;
            case "circle":
                setSelectedClass("circle")
                break;

            case "oval":
                setSelectedClass("oval")
                break;

            default:
                setSelectedClass("circle")
                break;
        }
    }, []);

    useEffect(() => {
        // Create an array to hold the options
        const options = Array.from({ length: +totalColumns }, (v, i) => ({
            label: `Col ${i + 1}`, // Set the label as 'Col X' where X is the column number
            value: i               // Set the value as the index
        }));

        // Update the state with the new options array
        setOptions(options);
    }, [totalColumns]);

    useEffect(() => {
        if (selectedCol.length > 0) {
            const value = selectedCol.map((item) => item.value);
            const arr = Array(+totalColumns).fill(0)
            for (let j = 0; j < value.length; j++) {
                arr[value[j]] = 1
            }
            setIdNumber(arr.join("").toString())
        }

    }, [options, selectedCol]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (modalShow) return; // Ignore keyboard events when modal is shown
            if (event.altKey && event.shiftKey) { // Toggle z-index when Alt + Enter is pressed
                const imgDiv = document.getElementById("imagecontainer");
                imgDiv.style.zIndex = imgDiv.style.zIndex === "999" ? "-1" : "999";
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [modalShow]);

    const handleMouseDown = (e) => {
        const boundingRect = imageRef.current.getBoundingClientRect();
        const col = Math.floor(
            (e.clientX - boundingRect.left) / (boundingRect.width / numCols)
        );
        const row = Math.floor(
            (e.clientY - boundingRect.top) / (boundingRect.height / numRows)
        );

        // Check if the clicked cell is a timing mark or already selected (a circle)
        if (col === 0 || selected[`${row},${col}`]) return;

        setDragStart({ row, col });
    };
    // const handleMouseMove = (e) => {
    //     if (!e.buttons || !dragStart) return;
    //     const boundingRect = imageRef.current.getBoundingClientRect();
    //     const col = Math.floor((e.clientX - boundingRect.left) / (boundingRect.width / numCols));
    //     const row = Math.floor((e.clientY - boundingRect.top) / (boundingRect.height / numRows));
    //     setSelection({
    //         startRow: Math.min(dragStart.row, row),
    //         startCol: Math.min(dragStart.col, col),
    //         endRow: Math.max(dragStart.row, row),
    //         endCol: Math.max(dragStart.col, col),
    //     });

    //     console.log(selection);
    // };

    const handleMouseMove = (e) => {
        if (!e.buttons || !dragStart) return;
        const boundingRect = imageRef.current.getBoundingClientRect();
        const col = Math.floor(
            (e.clientX - boundingRect.left) / (boundingRect.width / numCols)
        );
        const row = Math.floor(
            (e.clientY - boundingRect.top) / (boundingRect.height / numRows)
        );
        setSelection((prevSelection) => {
            const startRow = Math.min(dragStart.row, row);
            const startCol = Math.min(dragStart.col, col);
            const endRow = Math.max(dragStart.row, row);
            const endCol = Math.max(dragStart.col, col);

            const newSelection = {
                startRow: Math.max(0, startRow), // Ensure startRow is not negative
                startCol: Math.max(1, startCol), // Ensure startCol is not negative
                endRow: Math.min(numRows - 1, endRow), // Ensure endRow is within grid bounds
                endCol: Math.min(numCols, endCol), // Ensure endCol is within grid bounds
            };

            return newSelection;
        });

    };

    const handleMouseUp = () => {
        if (dragStart) {
            setDragStart(null);
            setModalShow(true);
        }
    };
    const handleCancel = () => {
        setDragStart(null);
        setSelection(null);
        setModalShow(false);
    };

    const handleSave = () => {

        // if (!name || !windowNgOption || !noInRow || !noOfStepInRow || !noInCol || !noOfStepInCol || !minimumMark) {
        //     return
        // }
        let newData = {}
        if (selectedFieldType === "idField") {
            newData = {
                "Coordinate": {
                    "Start Row": selection?.startRow + 1,
                    "Start Col": selection?.startCol,
                    "End Row": selection?.endRow + 1,
                    "End Col": selection?.endCol,
                    "name": "Id Field"
                },
                "imageStructureData": position,
                "columnStart": + selection?.startCol,
                "columnNumber": +noInCol,
                "columnStep": +noOfStepInCol,
                "rowStart": +selection?.startRow + 1,
                "rowNumber": +noInRow,
                "rowStep": +noOfStepInRow,
                "iDirection": +readingDirectionOption,
                "idMarksPattern": idNumber.toString(),
            }

        } else if (selectedFieldType === "skewMarkField") {
            newData = {
                "iFace": +iFace,
                "columnStart": +selection?.startCol,
                "columnNumber": +noInCol,
                "columnStep": +noOfStepInCol,
                "rowStart": +selection?.startRow + 1,
                "rowNumber": +noInRow,
                "rowStep": +noOfStepInRow,
                "iSensitivity": +iSensitivity,
                "iDifference": +iDifference,
                "iOption": +option,
                "iReject": +iReject,
                "iDirection": +readingDirectionOption,
                "windowName": name,
                "Coordinate": {
                    "Start Row": selection?.startRow + 1,
                    "Start Col": selection?.startCol,
                    "End Row": selection?.endRow + 1,
                    "End Col": selection?.endCol,
                    "name": name
                },
                "ngAction": windowNgOption,
                "iMinimumMarks": +minimumMark,
                "iMaximumMarks": +maximumMark,
                "skewMark": +skewoption,
                "iType": type,

            };


        } else {
            newData = {
                "iFace": +iFace,
                "windowName": name,
                "columnStart": +selection?.startCol,
                "columnNumber": +noInCol,
                "columnStep": +noOfStepInCol,
                "rowStart": +selection?.startRow + 1,
                "rowNumber": +noInRow,
                "rowStep": +noOfStepInRow,
                "iDirection": +readingDirectionOption,
                "iSensitivity": +iSensitivity,
                "iDifference": +iDifference,
                "iOption": +option,
                "iMinimumMarks": +minimumMark,
                "iMaximumMarks": +maximumMark,
                "iType": type,
                "ngAction": windowNgOption,
                "Coordinate": {
                    "Start Row": selection?.startRow + 1,
                    "Start Col": selection?.startCol,
                    "End Row": selection?.endRow + 1,
                    "End Col": selection?.endCol,
                    "name": name
                },
                "totalNumberOfFields": numberOfField,
                "numericOrAlphabets": fieldType
            };

        }
        const newSelected = { ...selection, name: selectedFieldType !== "idField" ? name : "Id Field" }
        setSelectedCoordinates((prev) => [...prev, newSelected]);
        setSelection(null);
        setModalShow(false);
        dataCtx.modifyAllTemplate(templateIndex, newData, selectedFieldType);
    };
    const handleSkewMarkOptionChange = (event) => {
        setSkewOption(event.target.value);
    };
    const handleWindowNgOptionChange = (event) => {
        setWindowNgOption(event.target.value)
    }
    const handleRadioChange = (e) => {
        setSelectedFieldType(e.target.value);
    };


    const handleEyeClick = (data) => {

        const template = dataCtx.allTemplates[templateIndex]

        if (data.name === "Id Field") {
            const data = template[0].layoutParameters;
            console.log(data)
            setSelectedFieldType("idField")
            setWindowNgOption(data?.ngAction);
            setMinimumMark(data?.minimumMark);
            setMaximumMark(data?.maximumMark);
            setNoInRow(data?.totalNoInRow);
            setNoInCol(data?.totalNoInColumn)
            setModalShow(true);
        }
    };

    const handleCrossClick = (data) => {
        const response = window.confirm("Are you sure you want to delete the selected field ?");
        console.log(response);
        console.log(data)
    };
    const handleIconMouseUp = (event) => {
        event.stopPropagation();
    };

    const sendHandler = async () => {
        // Retrieve the selected template
        const template = dataCtx.allTemplates[templateIndex];
        console.log(template);

        // Extract layout parameters and its coordinates
        const layoutParameters = template[0].layoutParameters;
        const Coordinate = layoutParameters.Coordinate;

        // Transform layout coordinates into the required format
        const layoutCoordinates = {
            right: Coordinate["End Col"],
            end: Coordinate["End Row"],
            left: Coordinate["Start Col"],
            start: Coordinate["Start Row"]
        };

        // Extract and format image structure data
        const imageStructureData = layoutParameters.imageStructureData;
        const imageCoordinates = {
            height: imageStructureData.height,
            x: imageStructureData.x,
            y: imageStructureData.y,
            width: imageStructureData.width
        };

        // Update layout parameters, removing original Coordinate and imageStructureData
        const updatedLayout = {
            ...layoutParameters,
            layoutCoordinates,
            imageCoordinates
        };
        delete updatedLayout.Coordinate;
        delete updatedLayout.imageStructureData;

        // Extract and format barcode, image, and printing data
        const barcodeData = template[0].barcodeData;
        const imageData = template[0].imageData;
        const printingData = template[0].printingData;

        // Transform question window parameters into the required format
        const questionsWindowParameters = template[0].questionsWindowParameters?.map((item) => {
            const { Coordinate, ...rest } = item;
            const questionWindowCoordinates = Coordinate ? {
                right: Coordinate["End Col"],
                end: Coordinate["End Row"],
                left: Coordinate["Start Col"],
                start: Coordinate["Start Row"]
            } : {};
            return { ...rest, questionWindowCoordinates };
        });

        // Transform skew marks window parameters into the required format
        const skewMarksWindowParameters = template[0].skewMarksWindowParameters?.map((item) => {
            const { Coordinate, ...rest } = item;
            const layoutWindowCoordinates = Coordinate ? {
                right: Coordinate["End Col"],
                end: Coordinate["End Row"],
                left: Coordinate["Start Col"],
                start: Coordinate["Start Row"]
            } : {};
            return { ...rest, layoutWindowCoordinates };
        });

        // Transform form field window parameters into the required format
        const formFieldWindowParameters = template[0].formFieldWindowParameters?.map((item) => {
            const { Coordinate, ...rest } = item;
            const formFieldCoordinates = Coordinate ? {
                right: Coordinate["End Col"],
                end: Coordinate["End Row"],
                left: Coordinate["Start Col"],
                start: Coordinate["Start Row"]
            } : {};
            return { ...rest, formFieldCoordinates };
        });

        // Assemble the full request data
        const fullRequestData = {
            layoutParameters: updatedLayout,
            barcodeData,
            imageData,
            printingData,
            questionsWindowParameters,
            skewMarksWindowParameters,
            formFieldWindowParameters
        };
        console.log(fullRequestData);

        // Send the request and handle the response
        try {
            const res = await createTemplate(fullRequestData);
            console.log(res);
            alert(`Response : ${JSON.stringify(res.message)}`);
            navigate("/admin/template", { replace: true });
        } catch (error) {
            alert(`Error creating template`);
            console.error('Error sending POST request:', error);
        }
    };

    return (
        <>

            <SmallHeader />
            <div>
                <Button onClick={sendHandler}> {!loading ? "Save" : "Saving"}</Button>
                <div className="containers" >

                    <div id="imagecontainer" className={classes.img} >
                        <Rnd
                            default={{
                                x: 0,
                                y: 0,
                                width: 400,
                                height: 400,
                            }}
                            minWidth={100}
                            minHeight={100}
                            position={{ x: position?.x, y: position?.y }}
                            size={{ width: position?.width, height: position?.height }}
                            onDragStop={handleDragStop}
                            onResizeStop={handleResizeStop}
                            bounds={null}
                            style={{
                                border: '1px solid #ddd',
                            }}

                        >
                            <img
                                src={templateImagePath}
                                className={`${classes["object-contain"]} ${classes["draggable-resizable-image"]} rounded`}
                                alt="omr sheet"

                            />
                        </Rnd>
                    </div>
                    <div className="d-flex">
                        <div style={{ marginRight: "1rem" }}>
                            <div className="top"></div>
                            {Array.from({ length: numRows }).map((_, rowIndex) => (
                                <div key={rowIndex} className="row">
                                    <div className="left-nums">{rowIndex + 1}</div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="top-row">
                                <div className="corner"></div>
                                {Array.from({ length: numCols }).map((_, index) => (
                                    <div key={index} className="top-num">{index + 1}</div>
                                ))}
                            </div>
                            <div style={{ border: "2px solid black", paddingTop: "2.0rem", padding: "1rem", paddingLeft: ".5rem" }}>
                                <div className="grid"
                                    ref={imageRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseUp={handleMouseUp}
                                    onMouseMove={handleMouseMove}
                                >
                                    {Array.from({ length: numRows }).map((_, rowIndex) => {
                                        const result = [...jsonData.map(Object.values)];
                                        return (
                                            <div key={rowIndex} className="row">
                                                <div className="left-num" sty><div className="timing-mark "></div></div>
                                                {Array.from({ length: numCols }).map((_, colIndex) => (
                                                    <div key={colIndex} style={{ backgroundColor: result[rowIndex][colIndex] !== 0 ? "black" : "" }} className={`${bubbleType} ${selected[`${rowIndex},${colIndex}`] ? 'selected' : ''}`}></div>
                                                ))}

                                            </div>
                                        )
                                    })}

                                    {selectedCoordinates.map((data, index) => (
                                        <div
                                            key={index}
                                            className="border-blue-900"
                                            style={{
                                                border: "3px solid #007bff",
                                                position: "absolute",
                                                left: `${(data.startCol * (imageRef.current.getBoundingClientRect().width / numCols)) - 4}px`,
                                                top: `${(data.startRow * (imageRef.current.getBoundingClientRect().height / numRows)) - 3}px`,
                                                width: `${((data.endCol - data.startCol + 1) * (imageRef.current.getBoundingClientRect().width / numCols))}px`,
                                                height: `${((data.endRow - data.startRow + 1) * (imageRef.current.getBoundingClientRect().height / numRows))}px`,

                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >

                                            <div className="d-flex justify-content-between align-items-center bg-dark text-white p-1" style={{ opacity: 0.8, fontSize: '12px', position: 'relative' }}>
                                                <span className="user-select-none">
                                                    {data.name}
                                                </span>
                                                <span className="d-flex align-items-center user-select-none gap-10">
                                                    <i className="fas fa-eye me-2 mr-1" onMouseUp={handleIconMouseUp} onClick={(e) => { handleEyeClick(data); }} style={{ cursor: 'pointer' }}></i>
                                                    <i className="fas fa-times text-danger cross-icon  ml-1" onMouseUp={handleIconMouseUp} onClick={() => { handleCrossClick(data); }} style={{ cursor: 'pointer' }}></i>
                                                </span>
                                            </div>

                                        </div>
                                    ))}
                                    {selection && (
                                        <div
                                            className="border-green-700"
                                            style={{
                                                border: "2px solid green",
                                                position: "absolute",
                                                left: `${(selection.startCol * (imageRef.current.getBoundingClientRect().width / numCols)) - 4}px`,
                                                top: `${(selection.startRow * (imageRef.current.getBoundingClientRect().height / numRows)) - 3}px`,
                                                width: `${(selection.endCol - selection.startCol + 1) * (imageRef.current.getBoundingClientRect().width / numCols)}px`,
                                                height: `${(selection.endRow - selection.startRow + 1) * (imageRef.current.getBoundingClientRect().height / numRows)}px`,
                                                content: "question field"
                                            }}
                                        ></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter" style={{ width: "100vw" }} >
                        <h2 className="text-center">Choose field type</h2>
                        <br />
                        <Row className="mb-2">
                            <label htmlFor="example-text-input" className="col-md-2 col-form-label">

                            </label>
                            <Col md={2} className="d-flex align-items-center">
                                <label htmlFor="formField" className="mr-2 mb-0 field-label" >Form : </label>
                                <input
                                    id="formField"
                                    type="radio"
                                    name="fieldType"
                                    value="formField"
                                    checked={selectedFieldType === 'formField'}
                                    onChange={handleRadioChange}
                                    className=" field-label"
                                />
                            </Col>
                            <Col md={2} className="d-flex align-items-center">
                                <label htmlFor="fieldType" className="mr-2 mb-0 field-label" >Question : </label>
                                <input
                                    id="fieldType"
                                    type="radio"
                                    name="fieldType"
                                    value="questionField"
                                    checked={selectedFieldType === 'questionField'}
                                    onChange={handleRadioChange}
                                    className=" field-label"
                                />
                            </Col>
                            <Col md={3} className="d-flex align-items-center">
                                <label htmlFor="skewMarkField" className="mr-2 mb-0 field-label">Skew Mark:</label>
                                <input
                                    id="skewMarkField"
                                    type="radio"
                                    name="fieldType"
                                    value="skewMarkField"
                                    checked={selectedFieldType === 'skewMarkField'}
                                    onChange={handleRadioChange}
                                    className=" field-label"
                                />
                            </Col>
                            <Col md={2} className="d-flex align-items-center  ">
                                <label htmlFor="idField" className="mr-2 mb-0 field-label">ID Mark :</label>
                                <input
                                    id="idField"
                                    type="radio"
                                    name="fieldType"
                                    value="idField"
                                    checked={selectedFieldType === 'idField'}
                                    onChange={handleRadioChange}
                                    className=" field-label"
                                />
                            </Col>
                        </Row>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: "70vh", overflowX: "auto" }}>

                    {selectedFieldType !== 'idField' && <Row className="mb-2" >
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label "
                            style={{ fontSize: "0.9rem" }}
                        >
                            Window Name
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Window Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{ color: "black" }}
                            />
                            {!name && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>}
                    <Row className="mb-2">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Multiple
                        </label>
                        <div className="col-md-4">
                            <select
                                className="form-control"
                                value={multiple}
                                onChange={(e) => { setMultiple(e.target.value) }}
                                defaultValue={""}
                            >
                                <option value="">Select an option</option>
                                <option value="allow">Allow All</option>
                                <option value="not allow">Allow None</option>

                            </select>

                        </div>
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 "
                        >
                            Multiple Value
                        </label>
                        <div className="col-md-4">
                            <input type="number" className='form-control' placeholder="Character of Multiple" value={multipleValue}
                                onChange={(e) => setMultipleValue(e.target.value)}
                                required />
                        </div>


                    </Row>
                    <Row>
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >

                            Blanks
                        </label>
                        <div className="col-md-4">
                            <select
                                className="form-control"
                                value={blank}
                                onChange={(e) => {
                                    setBlank(e.target.value
                                    )
                                }}
                                defaultValue={""}
                            >
                                <option value="">Select an option</option>
                                <option value="allow">Allow All</option>
                                <option value="not allow">Allow None</option>

                            </select>

                        </div>
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Blank Value
                        </label>
                        <div className="col-md-4">
                            <input type="number" className='form-control' placeholder="Character of Blank" value={blankValue}
                                onChange={(e) => setBlankValue(e.target.value)}
                                required />
                        </div>
                    </Row>
                    {selectedFieldType !== "idField" &&
                        <Row className="mb-2">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label"
                            >
                                Window NG
                            </label>
                            <div className="col-md-10">
                                <select
                                    className="form-control"
                                    value={windowNgOption}
                                    onChange={handleWindowNgOptionChange}
                                    defaultValue={""}
                                >
                                    <option value="">Select an option</option>
                                    <option value="0x00000001">Paper ejection to select stacker</option>
                                    <option value="0x00000002">Stop reading</option>

                                </select>

                            </div>
                        </Row>}
                    {selectedFieldType !== "idField" &&
                        <Row >
                            <label htmlFor="example-select-input" className="col-md-2" >
                                Minimum Mark
                            </label>
                            <div className="col-md-4">
                                <input type="number" className='form-control' placeholder="Enter the minimum mark" value={minimumMark}
                                    onChange={(e) => setMinimumMark(e.target.value)}
                                    required />
                            </div>
                            <label htmlFor="example-select-input" className="col-md-2 ">
                                Maximum Mark
                            </label>
                            <div className="col-md-4">
                                <input type="number" className='form-control' placeholder="Enter the maximum mark" value={maximumMark}
                                    onChange={(e) => setMaximumMark(e.target.value)}
                                    required />
                            </div>
                        </Row>}
                    {selectedFieldType === "idField" && <Row className="mb-2">
                        <label className="col-md-2 " style={{}}>
                            Set Id Pattern
                        </label>

                        <div className="col-md-2">
                            <select className=" form-control">
                                <option>Row</option>
                                <option>Col</option>
                            </select>
                        </div>
                        <label htmlFor="example-select-input" className="col-md-2 ">
                            Id selection
                        </label>
                        <div className="col-md-6">
                            <MultiSelect
                                options={options}
                                value={selectedCol}
                                onChange={setSelectedCol}
                                labelledBy="Select"
                            />
                        </div>
                    </Row>}
                    {selectedFieldType === 'skewMarkField' && <Row className="mb-2">
                        <label htmlFor="example-select-input" className="col-md-2 col-form-label">
                            Skew Mark
                        </label>
                        <div className="col-md-10">
                            <select
                                className="form-control"
                                value={skewoption}
                                onChange={handleSkewMarkOptionChange}
                                defaultValue={"none"}
                            >
                                <option value="">Select an option</option>
                                <option value="rear">Top Skew Mark</option>
                                <option value="front">Bottom Skew Mark</option>
                            </select>
                        </div>
                    </Row>}

                    <Row className="mb-2">
                        <label htmlFor="example-select-input" className="col-2 col-form-label">
                            Start Row
                        </label>
                        <div className="col-2 ">
                            <input id="startRow" value={selection?.startRow + 1} readOnly className="form-control" />
                        </div>
                        <label htmlFor="example-select-input" className="col-2 col-form-label">
                            End Row
                        </label>
                        <div className="col-2">
                            <input value={selection?.endRow + 1} readOnly className="form-control" />
                        </div>
                        <label htmlFor="example-select-input" className="col-2 col-form-label">
                            Total Row
                        </label>
                        <div className="col-2">
                            <input value={numRows} readOnly className="form-control" />
                        </div>
                    </Row>
                    <Row className="">
                        <label htmlFor="example-select-input" className="col-2 ">
                            Total No In Row
                        </label>
                        <div className="col-4">
                            <input type="number" className="form-control" value={noInRow}
                                onChange={(e) => setNoInRow(e.target.value)}
                                required />
                        </div>
                        <label htmlFor="example-select-input" className="col-2 ">
                            Total Step In A Row
                        </label>
                        <div className="col-4">
                            <input type="number" className="form-control" value={noOfStepInRow}
                                onChange={(e) => setNoOfStepInRow(e.target.value)}
                                required />
                        </div>
                    </Row>
                    <Row className="mb-2">
                        <label htmlFor="example-select-input" className="col-2  col-form-label">
                            Start Col
                        </label>
                        <div className="col-2">
                            <input value={selection?.startCol} readOnly className="form-control" />
                        </div>

                        <label htmlFor="example-select-input" className="col-2 col-form-label">
                            End Col
                        </label>
                        <div className="col-2">
                            <input value={selection?.endCol} readOnly className="form-control" />
                        </div>
                        <label htmlFor="example-select-input" className="col-2 col-form-label">
                            Total Col
                        </label>
                        <div className="col-2">
                            <input value={numCols} readOnly className="form-control" />
                        </div>
                    </Row>
                    <Row className="mb-2">
                        <label htmlFor="example-select-input" className="col-2 ">
                            Total No In Col
                        </label>
                        <div className="col-4">
                            <input type="number" className="form-control" value={noInCol}
                                onChange={(e) => setNoInCol(e.target.value)}
                                required />
                        </div>
                        <label htmlFor="example-select-input" className="col-2 ">
                            Total Step In A Col
                        </label>
                        <div className="col-4">
                            <input type="number" className="form-control"
                                value={noOfStepInCol}
                                onChange={(e) => setNoOfStepInCol(e.target.value)}
                                required />
                        </div>
                    </Row>

                    <Row className="mb-2">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 "
                        >
                            Reading Direction :
                        </label>
                        <div className="col-md-10">
                            <select
                                className="form-control"
                                value={readingDirectionOption}
                                onChange={(e) => { setReadingDirectionOption(e.target.value) }}
                                defaultValue={""}
                            >
                                <option value="">Select reading direction... </option>
                                <option value="0">From the upper left to the bottom</option>
                                <option value="1">From the upper right to the bottom </option>
                                <option value="2">From the lower left to a top
                                </option>
                                <option value="3">From the lower right to a top
                                </option>
                                <option value="4">From the upper left to right
                                </option>
                                <option value="5">From the upper right to the left
                                </option>
                                <option value="6">From the lower left to right
                                </option>
                                <option value="7">From the lower right to the left  </option>
                            </select>
                        </div>
                    </Row>

                    {selectedFieldType !== "idField" &&
                        <Row className="mb-2">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2  col-form-label"
                            >
                                Type :
                            </label>
                            <div className="col-md-5">
                                <select
                                    className="form-control"
                                    value={type}
                                    onChange={(e) => { setType(e.target.value) }}
                                    defaultValue={""}
                                >
                                    <option value="">Select reading direction... </option>
                                    <option value="1">Mask (at the time set window) about a mark </option>
                                    <option value="2">Fixed mark </option>
                                    <option value="3">Checkdigits </option>
                                    <option value="4">Range checking (ascending order)</option>
                                    <option value="5">Range checking (descending order)</option>
                                    <option value="6">Range checking (not order) </option>
                                    <option value="7">Mask setting(common to partition)
                                    </option>
                                </select>
                            </div>
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label "
                            >
                                Option :
                            </label>
                            <div className="col-3 ">
                                <input type="number" className="form-control"
                                    value={option}
                                    onChange={(e) => setOption(e.target.value)}
                                    required />
                            </div>
                        </Row>}
                    {(selectedFieldType === "questionField" || selectedFieldType === 'formField') && (<Row>
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label "
                        >

                            Total Fields :
                        </label>
                        <div className="col-3 ">
                            <input type="number" className="form-control"
                                value={numberOfField}
                                onChange={(e) => setNumberOfField(e.target.value)}
                                required />
                        </div>
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label "
                        >

                            Field Type :
                        </label>
                        <div className="col-3 ">
                            <select
                                className="form-control"
                                value={fieldType}
                                onChange={(e) => { setFieldType(e.target.value) }}
                                defaultValue={""}
                            >
                                <option value="">Select field type... </option>
                                <option value="numeric">Numeric </option>
                                <option value="alphabet">Alphabet </option>

                            </select>
                        </div>
                    </Row>)}
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={handleCancel} className="waves-effect waves-light">Cancel</Button>{" "}
                    <Button type="button" color="success" onClick={handleSave} className="waves-effect waves-light">Save</Button>{" "}
                </Modal.Footer>
            </Modal >
        </>
    );
};

export default DesignTemplate;
