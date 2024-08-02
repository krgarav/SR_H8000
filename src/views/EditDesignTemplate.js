import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, Button, Col } from "react-bootstrap";
import { Row } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./DesignTemplate.module.css";
import { Rnd } from "react-rnd";
import DataContext from "store/DataContext";
import { MultiSelect } from "react-multi-select-component";
import { createTemplate } from "helper/TemplateHelper";
import { getLayoutDataById } from "helper/TemplateHelper";
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
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual";
import { sendFile } from "helper/TemplateHelper";

// Function to get values from sessionStorage or provide default
const getSessionStorageOrDefault = (key, defaultValue) => {
    const stored = sessionStorage.getItem(key);

    if (!stored) {
        return defaultValue;
    }
    try {
        const parsed = JSON.parse(stored);
        // Check for 'undefined' string which is not a valid JSON
        if (parsed === undefined) {
            return defaultValue;
        }
        return parsed;
    } catch (e) {
        console.warn(`Error parsing sessionStorage item with key "${key}":`, e);
        return defaultValue;
    }
};
const EditDesignTemplate = () => {
    const [selected, setSelected] = useState({});
    const [selection, setSelection] = useState(null);
    const [dragStart, setDragStart] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [selectedClass, setSelectedClass] = useState("circle");
    const imageRef = useRef(null);
    const [selectedCoordinates, setSelectedCoordinates] = useState([]);
    const [name, setName] = useState();
    const [skewoption, setSkewOption] = useState("none");
    const [windowNgOption, setWindowNgOption] = useState("");
    const [readingDirectionOption, setReadingDirectionOption] = useState("");
    const [minimumMark, setMinimumMark] = useState();
    const [maximumMark, setMaximumMark] = useState();
    const [noInRow, setNoInRow] = useState();
    const [noOfStepInRow, setNoOfStepInRow] = useState();
    const [noInCol, setNoInCol] = useState();
    const [noOfStepInCol, setNoOfStepInCol] = useState();
    const [option, setOption] = useState("");
    const [type, setType] = useState("");
    const [selectedFieldType, setSelectedFieldType] = useState("formField");
    const [fieldType, setFieldType] = useState();
    const [numberOfField, setNumberOfField] = useState();
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
        width: 400,
        height: 400,
    });
    const [loading, setLoading] = useState(false);
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
        templateId,
        excelJsonFile,
        imageTempFile,
        excelFile,
    } = useLocation().state;
    const [selectedCol, setSelectedCol] = useState([]);
    const [options, setOptions] = useState([]);
    const [idNumber, setIdNumber] = useState("0000000000000000000000000000");
    const [layoutFieldData, setLayoutFieldData] = useState();
    const [multipleValue, setMultipleValue] = useState("");
    const [blankValue, setBlankValue] = useState("");
    const [multiple, setMultiple] = useState("");
    const [blank, setBlank] = useState("");
    const [startRowInput, setStartRowInput] = useState("");
    const [startColInput, setStartColInput] = useState("");
    const [endRowInput, setEndRowInput] = useState("");
    const [endColInput, setEndColInput] = useState("");
    const [idType, setIdType] = useState("");
    const [customValue, setCustomValue] = useState("");
    const [modalUpdate, setModalUpdate] = useState(false);
    const [coordinateIndex, setCoordinateIndex] = useState(-1);
    const [selectionIndex, setSelectionIndex] = useState();

    const location = useLocation();
    const state = location.state || {};
    // Initialize state with values from sessionStorage or location.state
    // const [data, setData] = useState(() => ({
    //     totalColumns: getSessionStorageOrDefault(
    //         "totalColumns",
    //         state.totalColumns
    //     ),
    //     timingMarks: getSessionStorageOrDefault("timingMarks", state.timingMarks),
    //     templateImagePath: getSessionStorageOrDefault(
    //         "templateImagePath",
    //         state.templateImagePath
    //     ),
    //     bubbleType: getSessionStorageOrDefault("bubbleType", state.bubbleType),
    //     templateIndex: getSessionStorageOrDefault(
    //         "templateIndex",
    //         state.templateIndex
    //     ),
    //     iSensitivity: getSessionStorageOrDefault(
    //         "iSensitivity",
    //         state.iSensitivity
    //     ),
    //     iDifference: getSessionStorageOrDefault("iDifference", state.iDifference),
    //     iReject: getSessionStorageOrDefault("iReject", state.iReject),
    //     iFace: getSessionStorageOrDefault("iFace", state.iFace),
    //     arr: getSessionStorageOrDefault("arr", state.arr),
    //     templateId: getSessionStorageOrDefault("templateId", state.templateId),
    //     excelJsonFile: getSessionStorageOrDefault(
    //         "excelJsonFile",
    //         state.excelJsonFile
    //     ),
    //     imageTempFile: getSessionStorageOrDefault(
    //         "imageTempFile",
    //         state.imageTempFile
    //     ),
    //     excelFile: getSessionStorageOrDefault("excelFile", state.excelFile),
    // }));

    const rndRef = useRef();
    const navigate = useNavigate();
    const numRows = state.timingMarks;
    const numCols = state.totalColumns;

    const handleDragStop = (e, d) => {
        setPosition((prev) => ({ ...prev, x: d.x, y: d.y }));
    };

    const handleResizeStop = (e, direction, ref, delta, position) => {
        setPosition({
            x: position.x,
            y: position.y,
            width: ref.style.width.replace("px", ""),
            height: ref.style.height.replace("px", ""),
        });
    };
    const toggleSelection = (row, col) => {
        const key = `${row},${col}`;
        setSelected((prev) => {
            const newState = { ...prev, [key]: !prev[key] };

            return newState;
        });
    };

    // useEffect(() => {
    //     if (location.state) {
    //         sessionStorage.setItem(
    //             "totalColumns",
    //             state.totalColumns
    //         );
    //         sessionStorage.setItem("timingMarks", JSON.stringify(state.timingMarks));
    //         sessionStorage.setItem(
    //             "templateImagePath",
    //             JSON.stringify(state.templateImagePath)
    //         );
    //         sessionStorage.setItem("bubbleType", JSON.stringify(state.bubbleType));
    //         sessionStorage.setItem(
    //             "templateIndex",
    //             state.templateIndex
    //         );
    //         sessionStorage.setItem(
    //             "iSensitivity",
    //             JSON.stringify(state.iSensitivity)
    //         );
    //         sessionStorage.setItem("iDifference", JSON.stringify(state.iDifference));
    //         sessionStorage.setItem("iReject", JSON.stringify(state.iReject));
    //         sessionStorage.setItem("iFace", JSON.stringify(state.iFace));
    //         sessionStorage.setItem("arr", JSON.stringify(state.arr));
    //         sessionStorage.setItem("templateId", JSON.stringify(state.templateId));
    //         sessionStorage.setItem(
    //             "excelJsonFile",
    //             JSON.stringify(state.excelJsonFile)
    //         );
    //         sessionStorage.setItem(
    //             "imageTempFile",
    //             JSON.stringify(state.imageTempFile)
    //         );
    //         sessionStorage.setItem("excelFile", JSON.stringify(state.excelFile));
    //     }
    // }, [location.state]);

    // **************************PREVENT FROM RELOADING*********************
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const confirmationMessage =
                "Are you sure you want to leave this page? All unsaved data will be lost.";
            event.returnValue = confirmationMessage; // Standard for most browsers
            return confirmationMessage; // Required for some browsers
        };

        const handleNavigation = (event) => {
            if (
                event.type === "POP" &&
                !window.confirm(
                    "Are you sure you want to leave this page? All unsaved data will be lost."
                )
            ) {
                navigate(location.pathname); // Navigate back to the current page
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handleNavigation);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handleNavigation);
        };
    }, [navigate, location.pathname]);


    // *****************************************************************
    useEffect(() => {
        setStartRowInput(selection?.startRow + 1);
        setEndRowInput(selection?.endRow + 1);
        setStartColInput(selection?.startCol);
        setEndColInput(selection?.endCol);
    }, [selection]);
    useEffect(() => {
        const gridDiv = document.getElementById("grid-div");
        const imgDiv = document.getElementById("imagecontainer");

        if (gridDiv && imgDiv) {
            const gridHeight = gridDiv.clientHeight;
            const gridWidth = gridDiv.clientWidth;

            imgDiv.style.height = `${gridHeight + 250}px`;
            imgDiv.style.width = `${gridWidth + 130}px`; // Adding 50 pixels to the width
            setPosition({
                x: 0,
                y: 0,
                width: `${gridWidth}px`,
                height: `${gridHeight}px`,
            });
        }
    }, []);
    // useEffect(() => {
    //     if (arr) {
    //         // Extract parameters from the first element of the array (if it exists)
    //         const formFieldData = arr[0]?.formFieldWindowParameters;
    //         const questionField = arr[0]?.questionsWindowParameters;
    //         const skewField = arr[0]?.skewMarksWindowParameters;
    //         const idField = arr[0]?.layoutParameters;

    //         // Map each set of parameters to their coordinates or default to an empty array
    //         const coordinateOfFormData =
    //             formFieldData?.map((item) => item.Coordinate) ?? [];
    //         const coordinateOfQuestionField =
    //             questionField?.map((item) => item.Coordinate) ?? [];
    //         const coordinateOfSkewField =
    //             skewField?.map((item) => item.Coordinate) ?? [];
    //         const coordinateOfIdField = idField?.Coordinate ?? [];

    //         // Combine all coordinates into a single array
    //         const allCoordinates = [
    //             ...coordinateOfFormData,
    //             ...coordinateOfQuestionField,
    //             ...coordinateOfSkewField,
    //             coordinateOfIdField,
    //         ];
    //         console.log(allCoordinates)
    //         // Map each coordinate to a new format
    //         const newSelectedFields = allCoordinates?.map((item) => {
    //             const {
    //                 "Start Row": startRow,
    //                 "Start Col": startCol,
    //                 "End Row": endRow,
    //                 "End Col": endCol,
    //                 name,
    //             } = item;
    //             return { startRow, startCol, endRow, endCol, name };
    //         });

    //         // Update the state with the new coordinates and image structure data
    //         setSelectedCoordinates(newSelectedFields);
    //         setPosition(idField?.imageStructureData);
    //     }
    // }, []); 
    // *************************For Fetching the details and setting the coordinate******************

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch layout data by template ID
                const response = await getLayoutDataById(templateId);
                console.log(response);
                setLayoutFieldData(response);
                if (response) {
                    // Extract data from the response
                    const formFieldData = response?.formFieldWindowParameters ?? [];
                    const questionField = response?.questionsWindowParameters ?? [];
                    const skewField = response?.skewMarksWindowParameters ?? [];
                    const idField = response?.layoutParameters ?? {};

                    // Map and restructure data for coordinates
                    const coordinateOfFormData = formFieldData.map((item) => ({
                        ...item.formFieldCoordinates,
                        name: item.windowName,
                    }));

                    const coordinateOfQuestionField = questionField.map((item) => ({
                        ...item.questionWindowCoordinates,
                        name: item.windowName,
                    }));

                    const coordinateOfSkewField = skewField.map((item) => ({
                        ...item.layoutWindowCoordinates,
                        name: item.windowName,
                    }));

                    const coordinateOfIdField = idField.layoutCoordinates ?? [];

                    // Check if the start value of the ID field's coordinates is not 0
                    const shouldIncludeIdField = coordinateOfIdField.start !== 0;

                    // Combine all coordinates into a single array, conditionally including the ID field's coordinates
                    const allCoordinates = [
                        ...coordinateOfFormData,
                        ...coordinateOfQuestionField,
                        ...coordinateOfSkewField,
                        ...(shouldIncludeIdField ? [coordinateOfIdField] : []), // Conditionally include the ID field's coordinates
                    ];

                    // Format the coordinates for the state update
                    const newSelectedFields = allCoordinates.map((item) => {
                        const {
                            start: startRow,
                            left: startCol,
                            end: endRow,
                            right: endCol,
                            name,
                            fieldType
                        } = item;
                        return { startRow, startCol, endRow, endCol, name, fieldType };
                    });
                    console.log(newSelectedFields)
                    // Update state with the formatted coordinates and image data
                    setSelectedCoordinates(newSelectedFields);
                    setPosition(idField?.imageCoordinates);
                }
            } catch (error) {
                console.error("Error fetching layout data:", error);
            }
        };

        // Call the fetch details function
        fetchDetails();
    }, [templateId]);
    // *****************************************************************************************
    useEffect(() => {
        if (layoutFieldData) {
            dataCtx.addFieldToTemplate(layoutFieldData, templateIndex);
            console.log("called");
        }
    }, [layoutFieldData]);
    useEffect(() => {
        switch (bubbleType) {
            case "rounded rectangle":
                setSelectedClass("rounded-rectangle");
                break;
            case "rectangle":
                setSelectedClass("rectangle");
                break;
            case "circle":
                setSelectedClass("circle");
                break;

            case "oval":
                setSelectedClass("oval");
                break;

            default:
                setSelectedClass("circle");
                break;
        }
    }, []);

    useEffect(() => {
        // Create an array to hold the options
        const options = Array.from({ length: +totalColumns }, (v, i) => ({
            label: `${idType} ${i + 1}`, // Set the label as 'Col X' where X is the column number
            value: i, // Set the value as the index
        }));

        // Update the state with the new options array
        setOptions(options);
    }, [totalColumns, idType]);

    useEffect(() => {
        if (selectedCol.length > 0) {
            const value = selectedCol.map((item) => item.value);
            const arr = Array(+totalColumns).fill(0);
            for (let j = 0; j < value.length; j++) {
                arr[value[j]] = 1;
            }
            setIdNumber(arr.join("").toString());
        }
    }, [options, selectedCol]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (modalShow) return; // Ignore keyboard events when modal is shown
            if (event.altKey && event.shiftKey) {
                // Toggle z-index when Alt + Enter is pressed
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
        setModalUpdate(false);
    };

    const validateFormField = () => {
        const errors = {
            name: "Name Field can not be empty",
            multiple: "Please select multiple",
            blank: "Please select blank",
            windowNgOption: "Please select window Ng",
            minimumMark: "Minimum mark cannot be empty",
            maximumMark: "Maximum mark cannot be empty",
            noInRow: "Total number in row cannot be empty",
            noOfStepInRow: "Total number of step in a row cannot be empty",
            noInCol: "Total number in col cannot be empty",
            noOfStepInCol: "Total number of step in a col cannot be empty",
            readingDirectionOption: "Please select reading direction",
            type: "Please select type",
            option: "Please select option",
            numberOfField: "Total field cannot be empty",
            fieldType: "Please select field type",
        };

        for (let [field, errorMsg] of Object.entries(errors)) {
            if (!eval(field)) {
                toast.error(errorMsg);
                return false;
            }
        }
        return true;
    };

    const validateSkewField = () => {
        const errors = {
            name: "Name Field can not be empty",
            windowNgOption: "Please select window Ng",
            minimumMark: "Minimum mark cannot be empty",
            maximumMark: "Maximum mark cannot be empty",
            skewoption: "Please select the skew mark position",
            noInRow: "Total number in row cannot be empty",
            noOfStepInRow: "Total number of step in a row cannot be empty",
            noInCol: "Total number in col cannot be empty",
            noOfStepInCol: "Total number of step in a col cannot be empty",
            readingDirectionOption: "Please select reading direction",
            type: "Please select type",
            option: "Please select option",
        };

        for (let [field, errorMsg] of Object.entries(errors)) {
            if (!eval(field)) {
                toast.error(errorMsg);
                return false;
            }
        }
        return true;
    };
    const validateIdField = () => {
        const errors = {
            noInRow: "Total number in row cannot be empty",
            noOfStepInRow: "Total number of step in a row cannot be empty",
            noInCol: "Total number in col cannot be empty",
            noOfStepInCol: "Total number of step in a col cannot be empty",
            readingDirectionOption: "Please select reading direction",
        };

        for (let [field, errorMsg] of Object.entries(errors)) {
            if (!eval(field)) {
                toast.error(errorMsg);
                return false;
            }
        }
        return true;
    };
    const handleSave = () => {
        if (
            selectedFieldType === "formField" ||
            selectedFieldType === "questionField"
        ) {
            if (multiple !== "allow") {
                if (!multipleValue) {
                    toast.error("Multiple value cannot be empty");
                    return;
                }
            }
            if (blank !== "allow") {
                if (!blankValue) {
                    toast.error("Blank value cannot be empty");
                    return;
                }
            }
            if (!validateFormField()) {
                return;
            }
        } else if (selectedFieldType === "skewMarkField") {
            if (!validateSkewField()) {
                return;
            }
        } else if (selectedFieldType === "idField") {
            if (!validateIdField()) {
                return;
            }
        }

        let newData = {};
        if (selectedFieldType === "idField") {
            newData = {
                Coordinate: {
                    "Start Row": selection?.startRow + 1,
                    "Start Col": selection?.startCol,
                    "End Row": selection?.endRow + 1,
                    "End Col": selection?.endCol,
                    name: name,
                    fieldType: selectedFieldType,
                },
                imageStructureData: position,
                columnStart: +selection?.startCol,
                columnNumber: +noInCol,
                columnStep: +noOfStepInCol,
                rowStart: +selection?.startRow + 1,
                rowNumber: +noInRow,
                rowStep: +noOfStepInRow,
                iDirection: +readingDirectionOption,
                idMarksPattern: idNumber.toString(),
            };
        } else if (selectedFieldType === "skewMarkField") {
            newData = {
                iFace: +iFace,
                columnStart: +selection?.startCol,
                columnNumber: +noInCol,
                columnStep: +noOfStepInCol,
                rowStart: +selection?.startRow + 1,
                rowNumber: +noInRow,
                rowStep: +noOfStepInRow,
                iSensitivity: +iSensitivity,
                iDifference: +iDifference,
                iOption: +option,
                iReject: +iReject,
                iDirection: +readingDirectionOption,
                windowName: name,
                Coordinate: {
                    "Start Row": selection?.startRow + 1,
                    "Start Col": selection?.startCol,
                    "End Row": selection?.endRow + 1,
                    "End Col": selection?.endCol,
                    name: name,
                    fieldType: selectedFieldType,
                },
                ngAction: windowNgOption,
                iMinimumMarks: +minimumMark,
                iMaximumMarks: +maximumMark,
                skewMark: +skewoption,
                iType: type,
                // imageStructureData: position,
            };
        } else {
            newData = {
                iFace: +iFace,
                windowName: name,
                columnStart: +selection?.startCol,
                columnNumber: +noInCol,
                columnStep: +noOfStepInCol,
                rowStart: +selection?.startRow + 1,
                rowNumber: +noInRow,
                rowStep: +noOfStepInRow,
                iDirection: +readingDirectionOption,
                iSensitivity: +iSensitivity,
                iDifference: +iDifference,
                iOption: +option,
                iMinimumMarks: +minimumMark,
                iMaximumMarks: +maximumMark,
                iType: type,
                ngAction: windowNgOption,
                Coordinate: {
                    "Start Row": selection?.startRow + 1,
                    "Start Col": selection?.startCol,
                    "End Row": selection?.endRow + 1,
                    "End Col": selection?.endCol,
                    name: name,
                    fieldType: selectedFieldType,
                },
                totalNumberOfFields: numberOfField,
                numericOrAlphabets: fieldType,
                multipleAllow: multiple,
                multipleValue: multipleValue ? multipleValue : "",
                blankAllow: blank,
                blankValue: blankValue ? blankValue : "",
                customFieldValue: customValue ? customValue : ""
                // imageStructureData: position,
            };
        }

        // setSelectedCoordinates((prev) => [...prev, newSelected]);//chamnge here
        // setSelection(null);
        setModalShow(false);
        if (!modalUpdate) {
            dataCtx.modifyAllTemplate(templateIndex, newData, selectedFieldType);
            const newSelected = {
                ...selection,
                name: selectedFieldType !== "idField" ? name : "Id Field",
                fieldType: selectedFieldType,
            };
            setSelectedCoordinates((prev) => [...prev, newSelected]);
            setSelection(null);
        } else {
            // const updatedValue = {
            //     startRow: selection?.startRow - 1,
            //     startCol: selection?.startCol,
            //     endRow: selection?.endRow - 1,
            //     endCol: selection?.endCol,
            //     name: name,
            //     fieldType: selectedFieldType,
            //   };
            setSelectedCoordinates((item) => {
                // Ensure item is defined and coordinateIndex is valid
                if (!item || coordinateIndex < 0 || coordinateIndex >= item.length) {
                    console.error("Invalid coordinate index or item array");
                    return item; // Return the unchanged state if validation fails
                }

                const copiedSelectedField = [...item];
                copiedSelectedField[coordinateIndex] = {
                    ...copiedSelectedField[coordinateIndex],
                    name: name,
                    fieldType: selectedFieldType,
                };

                return copiedSelectedField;
            });

            //   console.log(templateIndex,selectedFieldType,coordinateIndex);
            //   if(templateIndex,selectedFieldType,coordinateIndex)
            dataCtx.modifyWithRegion(
                templateIndex,
                newData,
                selectedFieldType,
                coordinateIndex
            );
            setSelection(null);
        }
    };

    const handleSkewMarkOptionChange = (event) => {
        setSkewOption(event.target.value);
    };
    const handleWindowNgOptionChange = (event) => {
        setWindowNgOption(event.target.value);
    };
    const handleRadioChange = (e) => {
        setSelectedFieldType(e.target.value);
    };
    console.log(selectedCoordinates);

    const handleEyeClick = (selectedField, index) => {
        console.log(selectedField)

        console.log(selectedField);
        setSelection(() => ({
            startRow: selectedField.startRow,
            startCol: selectedField.startCol,
            endRow: selectedField.endRow,
            endCol: selectedField.endCol,
        }));
        console.log(selectedField, index);
        const formattedSelectedFile = {
            "End Col": selectedField.endCol,
            "End Row": selectedField.endRow,
            "Start Col": selectedField.startCol,
            "Start Row": selectedField.startRow,
            fieldType: selectedField.fieldType,
            name: selectedField.name,
        };

        setSelectionIndex(index);
        const template = dataCtx.allTemplates[templateIndex];
        console.log(template);
        if (selectedField?.fieldType === "idField") {
            const data = template[0].layoutParameters;
            setSelectedFieldType("idField");
            setWindowNgOption(data?.ngAction);
            setMinimumMark(data?.minimumMark);
            setMaximumMark(data?.maximumMark);
            setNoInRow(data?.totalNoInRow);
            setNoInCol(data?.totalNoInColumn);
            setStartRowInput(formattedSelectedFile["Start Row"]);
            setEndRowInput(formattedSelectedFile["End Row"]);
            setStartColInput(formattedSelectedFile["Start Col"]);
            setEndColInput(formattedSelectedFile["End Col"]);
            setCoordinateIndex(index);
            setModalUpdate(true);
            setModalShow(true);
        } else if (selectedField?.fieldType === "questionField") {
            // const data = template[0].questionsWindowParameters.filter((item) => {
            //     return isEqual(item.Coordinate, formattedSelectedFile);
            // })[0];
            const parameters = template[0].questionsWindowParameters;
            // Find the index of the matched object
            const index = parameters.findIndex((item) =>
                isEqual(item.questionWindowCoordinates, formattedSelectedFile)
            );
            console.log(index);
            // Get the matched object
            const data = index !== -1 ? parameters[index] : null;
            console.log(data);
            setCoordinateIndex(index);
            setModalUpdate(true);
            setModalShow(true);
            setName(data?.windowName);
            setSelectedFieldType("questionField");
            setWindowNgOption(data?.ngAction);
            setMinimumMark(data?.iMaximumMarks);
            setMaximumMark(data?.iMinimumMarks);
            setNoInRow(data?.rowNumber);
            setNoInCol(data?.columnNumber);
            setStartRowInput(formattedSelectedFile["Start Row"]);
            setEndRowInput(formattedSelectedFile["End Row"]);
            setStartColInput(formattedSelectedFile["Start Col"]);
            setEndColInput(formattedSelectedFile["End Col"]);
            setReadingDirectionOption(data?.iDirection);
            setType(data?.iType);
            setOption(data?.iOption);
            setNumberOfField(data?.totalNumberOfFields);
            setFieldType(data?.numericOrAlphabets);
            setMultiple(data?.multipleAllow);
            setMultipleValue(data?.multipleValue);
            setBlank(data?.blankAllow);
            setBlankValue(data?.blankValue)
        } else if (selectedField?.fieldType === "formField") {
            // const data = template[0].formFieldWindowParameters.filter((item) => {

            //     return isEqual(item.Coordinate, formattedSelectedFile);
            // })[0];
            const parameters = template[0].formFieldWindowParameters;
            const index = parameters.findIndex((item) =>
                isEqual(item.formFieldCoordinates, formattedSelectedFile)
            );
            console.log(formattedSelectedFile)
            console.log(parameters)
            console.log(index);
            // Get the matched object
            const data = index !== -1 ? parameters[index] : null;
            console.log(data);
            setCoordinateIndex(index);
            console.log(formattedSelectedFile);
            setModalUpdate(true);
            setModalShow(true);
            setSelectedFieldType("formField");
            setName(data?.windowName);
            setWindowNgOption(data?.ngAction);
            setMinimumMark(data?.iMaximumMarks);

            setMaximumMark(data?.iMinimumMarks);
            setNoInRow(data?.rowNumber);
            setNoInCol(data?.columnNumber);
            setStartRowInput(formattedSelectedFile["Start Row"] - 1);
            setEndRowInput(formattedSelectedFile["End Row"] - 1);
            setStartColInput(formattedSelectedFile["Start Col"]);
            setEndColInput(formattedSelectedFile["End Col"]);
            setReadingDirectionOption(data?.iDirection);
            setType(data?.iType);
            setOption(data?.iOption);
            setNumberOfField(data?.totalNumberOfFields);
            setFieldType(data?.numericOrAlphabets);
            setMultiple(data?.multipleAllow);
            setMultipleValue(data?.multipleValue);
            setBlank(data?.blankAllow);
            setBlankValue(data?.blankValue)
        } else if (selectedField?.fieldType === "skewMarkField") {
            const parameters = template[0].skewMarksWindowParameters;
            const index = parameters.findIndex((item) =>
                isEqual(item.Coordinate, formattedSelectedFile)
            );
            console.log(index);
            // Get the matched object
            const data = index !== -1 ? parameters[index] : null;
            console.log(data);
            setCoordinateIndex(index);
            setModalUpdate(true);
            setModalShow(true);
            setSelectedFieldType("skewMarkField");
            setStartRowInput(formattedSelectedFile["Start Row"]);
            setEndRowInput(formattedSelectedFile["End Row"]);
            setStartColInput(formattedSelectedFile["Start Col"]);
            setEndColInput(formattedSelectedFile["End Col"]);
        }
    };

    const handleCrossClick = (selectedField, index) => {
        const response = window.confirm(
            "Are you sure you want to delete the selected field ?"
        );
        if (!response) {
            return;
        }
        const formattedSelectedFile = {
            "End Col": selectedField.endCol,
            "End Row": selectedField.endRow + 1,
            "Start Col": selectedField.startCol,
            "Start Row": selectedField.startRow + 1,
            fieldType: selectedField.fieldType,
            name: selectedField.name,
        };
        setSelectedCoordinates((prevState) => {
            const copiedState = [...prevState];
            copiedState.splice(index, 1); // Remove the item at the specified index
            return copiedState;
        });
        dataCtx.deleteFieldTemplate(templateIndex, formattedSelectedFile);
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
        let layoutCoordinates = {};
        // Transform layout coordinates into the required format
        if (Coordinate) {
            layoutCoordinates = {
                right: Coordinate["End Col"],
                end: Coordinate["End Row"],
                left: Coordinate["Start Col"],
                start: Coordinate["Start Row"],
            };
        }

        // Extract and format image structure data
        const imageStructureData = layoutParameters.imageStructureData;
        let imageCoordinates = {};
        if (imageStructureData) {
            imageCoordinates = {
                height: imageStructureData.height,
                x: imageStructureData.x,
                y: imageStructureData.y,
                width: imageStructureData.width,
            };
        }

        // Update layout parameters, removing original Coordinate and imageStructureData
        const updatedLayout = {
            ...layoutParameters,
            layoutCoordinates,
            imageCoordinates,
        };
        delete updatedLayout.Coordinate;
        delete updatedLayout.imageStructureData;

        // Extract and format barcode, image, and printing data
        const barcodeData = template[0].barcodeData;
        const imageData = template[0].imageData;
        const printingData = template[0].printingData;

        // Transform question window parameters into the required format
        const questionsWindowParameters =
            template[0].questionsWindowParameters?.map((item) => {
                const { Coordinate, ...rest } = item;
                const questionWindowCoordinates = Coordinate
                    ? {
                        right: Coordinate["End Col"],
                        end: Coordinate["End Row"],
                        left: Coordinate["Start Col"],
                        start: Coordinate["Start Row"],
                    }
                    : {};
                return { ...rest, questionWindowCoordinates };
            });

        // Transform skew marks window parameters into the required format
        const skewMarksWindowParameters =
            template[0].skewMarksWindowParameters?.map((item) => {
                const { Coordinate, ...rest } = item;
                const layoutWindowCoordinates = Coordinate
                    ? {
                        right: Coordinate["End Col"],
                        end: Coordinate["End Row"],
                        left: Coordinate["Start Col"],
                        start: Coordinate["Start Row"],
                    }
                    : {};
                return { ...rest, layoutWindowCoordinates };
            });

        // Transform form field window parameters into the required format
        const formFieldWindowParameters =
            template[0].formFieldWindowParameters?.map((item) => {
                const { Coordinate, ...rest } = item;
                const formFieldCoordinates = Coordinate
                    ? {
                        right: Coordinate["End Col"],
                        end: Coordinate["End Row"],
                        left: Coordinate["Start Col"],
                        start: Coordinate["Start Row"],
                    }
                    : {};
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
            formFieldWindowParameters,
        };
        console.log(fullRequestData)
        // Send the request and handle the response
        try {
            setLoading(true);
            const res = await createTemplate(fullRequestData);
            console.log(res);
            if (res.success === true) {
                const layoutId = res?.layoutId;
                const formdata = new FormData();
                formdata.append("LayoutId", layoutId);
                formdata.append("ImageFile", state.imageTempFile);
                formdata.append("ExcelFile", state.excelFile);
                // Iterate over the FormData entries and log them
                for (let [key, value] of formdata.entries()) {
                    console.log(`${key}: ${value}`);
                }
                const res2 = await sendFile(formdata);
                console.log(res2);
                setLoading(false);

                alert(`Response : ${JSON.stringify(res2?.message)}`);

                if (res2?.success) {
                    sessionStorage.clear();
                    toast.success("Layout Saved");
                    navigate("/admin/template", { replace: true });
                }
            }
        } catch (error) {
            alert(`Error creating template`);
            console.error("Error sending POST request:", error);
        }
    };

    return (
        <>
            <div>
                <SmallHeader />
            </div>
            {!modalShow && selection && (
                <Button
                    onClick={() => {
                        setModalShow(true);
                    }}
                    variant="primary"
                    style={{
                        position: "fixed",
                        top: "20px", // Adjust the top value as needed
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: "999",
                    }}
                >
                    Show Modal
                </Button>
            )}

            <div style={{ overflow: "auto" }}>
                <Button
                    onClick={sendHandler}
                    style={{
                        position: "fixed",
                        bottom: "50px", // Distance from the bottom of the screen
                        right: "50px", // Distance from the right of the screen
                        borderRadius: "50%",
                        width: "50px", // Width of the button
                        height: "50px", // Height of the button
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "50px", // Remove padding to center the text
                        zIndex: "999",
                        color: "white", // Optional: Set the text color
                        border: "none", // Optional: Remove border if desired
                        cursor: "pointer", // Optional: Change cursor to pointer on hover
                    }}
                >
                    {!loading ? "Save" : "Saving"}
                </Button>
                <div className="containers">
                    <div id="imagecontainer" className={classes.img}>
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
                            //   bounds={null}
                            style={
                                {
                                    // border: "1px solid #ddd",
                                }
                            }
                        >
                            <img
                                src={templateImagePath}
                                className={`${classes["object-contain"]} ${classes["draggable-resizable-image"]} rounded`}
                                alt="omr sheet"
                                id="omr-style-sheet"
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
                                    <div key={index} className="top-num">
                                        {index + 1}
                                    </div>
                                ))}
                            </div>
                            <div
                                id="grid-div"
                                style={{
                                    border: "2px solid black",
                                    paddingTop: "2.0rem",
                                    padding: "1rem",
                                    paddingLeft: ".5rem",
                                }}
                            >
                                <div
                                    className="grid"
                                    ref={imageRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseUp={handleMouseUp}
                                    onMouseMove={handleMouseMove}
                                >
                                    {Array.from({ length: numRows }).map((_, rowIndex) => {
                                        const result = [...excelJsonFile.map(Object.values)];

                                        return (
                                            <div key={rowIndex} className="row">
                                                <div className="left-num" sty>
                                                    <div className="timing-mark "></div>
                                                </div>
                                                {Array.from({ length: numCols }).map((_, colIndex) => (
                                                    <div
                                                        key={colIndex}
                                                        style={{
                                                            backgroundColor:
                                                                rowIndex < result.length &&
                                                                    colIndex < result[rowIndex].length &&
                                                                    result[rowIndex][colIndex] != 0 &&
                                                                    result[rowIndex][colIndex] !== undefined
                                                                    ? "black"
                                                                    : "",
                                                        }}
                                                        // style={{
                                                        //     backgroundColor:
                                                        //         result[rowIndex][colIndex] != 0 ? "black" : "",
                                                        // }}
                                                        className={`${bubbleType} ${selected[`${rowIndex},${colIndex}`]
                                                            ? "selected"
                                                            : ""
                                                            }`}
                                                    ></div>
                                                ))}
                                            </div>
                                        );
                                    })}

                                    {selectedCoordinates.map((data, index) => (
                                        <div
                                            key={index}
                                            className="border-blue-900"
                                            style={{
                                                border: "3px solid #007bff",
                                                position: "absolute",
                                                left: `${data.startCol *
                                                    (imageRef.current.getBoundingClientRect().width /
                                                        numCols) -
                                                    4
                                                    }px`,
                                                top: `${data.startRow *
                                                    (imageRef.current.getBoundingClientRect().height /
                                                        numRows) -
                                                    3
                                                    }px`,
                                                width: `${(data.endCol - data.startCol + 1) *
                                                    (imageRef.current.getBoundingClientRect().width /
                                                        numCols)
                                                    }px`,
                                                height: `${(data.endRow - data.startRow + 1) *
                                                    (imageRef.current.getBoundingClientRect().height /
                                                        numRows)
                                                    }px`,
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div
                                                className="d-flex justify-content-between align-items-center bg-dark text-white p-1"
                                                style={{
                                                    opacity: 0.8,
                                                    fontSize: "12px",
                                                    position: "relative",
                                                }}
                                            >
                                                <span className="user-select-none">{data.name}</span>
                                                <span className="d-flex align-items-center user-select-none gap-10">
                                                    <i
                                                        className="fas fa-eye me-2 mr-1"
                                                        onMouseUp={handleIconMouseUp}
                                                        onClick={(e) => {
                                                            handleEyeClick(data, index);
                                                        }}
                                                        style={{ cursor: "pointer" }}
                                                    ></i>
                                                    <i
                                                        className="fas fa-times text-danger cross-icon  ml-1"
                                                        onMouseUp={handleIconMouseUp}
                                                        onClick={() => {
                                                            handleCrossClick(data, index);
                                                        }}
                                                        style={{ cursor: "pointer" }}
                                                    ></i>
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
                                                left: `${selection.startCol *
                                                    (imageRef.current.getBoundingClientRect().width /
                                                        numCols) -
                                                    4
                                                    }px`,
                                                top: `${selection.startRow *
                                                    (imageRef.current.getBoundingClientRect().height /
                                                        numRows) -
                                                    3
                                                    }px`,
                                                width: `${(selection.endCol - selection.startCol + 1) *
                                                    (imageRef.current.getBoundingClientRect().width /
                                                        numCols)
                                                    }px`,
                                                height: `${(selection.endRow - selection.startRow + 1) *
                                                    (imageRef.current.getBoundingClientRect().height /
                                                        numRows)
                                                    }px`,
                                                content: "question field",
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
                <Modal.Header>
                    <Modal.Title
                        id="contained-modal-title-vcenter"
                        style={{ width: "100vw" }}
                    >
                        <h2 className="text-center">Choose field type</h2>
                        <br />
                        <Row className="mb-2">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label"
                            ></label>
                            <Col md={2} className="d-flex align-items-center">
                                <label htmlFor="formField" className="mr-2 mb-0 field-label">
                                    Form :{" "}
                                </label>
                                <input
                                    id="formField"
                                    type="radio"
                                    name="fieldType"
                                    value="formField"
                                    checked={selectedFieldType === "formField"}
                                    onChange={handleRadioChange}
                                    className=" field-label"
                                />
                            </Col>
                            <Col md={2} className="d-flex align-items-center">
                                <label htmlFor="fieldType" className="mr-2 mb-0 field-label">
                                    Question :{" "}
                                </label>
                                <input
                                    id="fieldType"
                                    type="radio"
                                    name="fieldType"
                                    value="questionField"
                                    checked={selectedFieldType === "questionField"}
                                    onChange={handleRadioChange}
                                    className=" field-label"
                                />
                            </Col>
                            <Col md={3} className="d-flex align-items-center">
                                <label
                                    htmlFor="skewMarkField"
                                    className="mr-2 mb-0 field-label"
                                >
                                    Skew Mark:
                                </label>
                                <input
                                    id="skewMarkField"
                                    type="radio"
                                    name="fieldType"
                                    value="skewMarkField"
                                    checked={selectedFieldType === "skewMarkField"}
                                    onChange={handleRadioChange}
                                    className=" field-label"
                                />
                            </Col>
                            <Col md={2} className="d-flex align-items-center  ">
                                <label htmlFor="idField" className="mr-2 mb-0 field-label">
                                    ID Mark :
                                </label>
                                <input
                                    id="idField"
                                    type="radio"
                                    name="fieldType"
                                    value="idField"
                                    checked={selectedFieldType === "idField"}
                                    onChange={handleRadioChange}
                                    className=" field-label"
                                />
                            </Col>
                        </Row>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: "55vh", overflowX: "auto" }}>
                    {selectedFieldType !== "idField" && (
                        <Row className="mb-2">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label "
                                style={{ fontSize: "0.8rem" }}
                            >
                                Window Name
                            </label>
                            <div className="col-md-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Window Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    style={{ color: "black" }}
                                />
                            </div>
                        </Row>
                    )}
                    {(selectedFieldType === "questionField" ||
                        selectedFieldType === "formField") && (
                            <Row className="mb-2">
                                <label
                                    htmlFor="example-text-input"
                                    className="col-md-2 col-form-label"
                                >
                                    Multiple
                                </label>
                                <div className={multiple !== "allow" ? "col-md-4" : "col-md-10"}>
                                    <select
                                        className="form-control"
                                        value={multiple}
                                        onChange={(e) => {
                                            setMultiple(e.target.value);
                                        }}
                                        defaultValue={""}
                                    >
                                        <option value="">Select an option</option>
                                        <option value="allow">Allow All</option>
                                        <option value="not allow">Allow None</option>
                                    </select>
                                </div>
                                {multiple !== "allow" && (
                                    <>
                                        <label htmlFor="example-text-input" className="col-md-2 ">
                                            Multiple Value
                                        </label>
                                        <div className="col-md-4">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Character of Multiple"
                                                value={multipleValue}
                                                onChange={(e) => setMultipleValue(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                            </Row>
                        )}
                    {(selectedFieldType === "questionField" ||
                        selectedFieldType === "formField") && (
                            <Row className="mb-2">
                                <label
                                    htmlFor="example-text-input"
                                    className="col-md-2 col-form-label"
                                >
                                    Blanks
                                </label>
                                <div className={blank !== "allow" ? "col-md-4" : "col-md-10"}>
                                    <select
                                        className="form-control"
                                        value={blank}
                                        onChange={(e) => {
                                            setBlank(e.target.value);
                                        }}
                                        defaultValue={""}
                                    >
                                        <option value="">Select an option</option>
                                        <option value="allow">Allow All</option>
                                        <option value="not allow">Allow None</option>
                                    </select>
                                </div>
                                {blank !== "allow" && (
                                    <>
                                        <label
                                            htmlFor="example-text-input"
                                            className="col-md-2 col-form-label"
                                        >
                                            Blank Value
                                        </label>
                                        <div className="col-md-4">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Character of Blank"
                                                value={blankValue}
                                                onChange={(e) => setBlankValue(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                            </Row>
                        )}
                    {selectedFieldType !== "idField" && (
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
                                    <option value="0x00000001">
                                        Paper ejection to select stacker
                                    </option>
                                    <option value="0x00000002">Stop reading</option>
                                </select>
                            </div>
                        </Row>
                    )}
                    {selectedFieldType !== "idField" && (
                        <Row>
                            <label htmlFor="example-select-input" className="col-md-2">
                                Minimum Mark
                            </label>
                            <div className="col-md-4">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter the minimum mark"
                                    value={minimumMark}
                                    onChange={(e) => setMinimumMark(e.target.value)}
                                    required
                                />
                            </div>
                            <label htmlFor="example-select-input" className="col-md-2 ">
                                Maximum Mark
                            </label>
                            <div className="col-md-4">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter the maximum mark"
                                    value={maximumMark}
                                    onChange={(e) => setMaximumMark(e.target.value)}
                                    required
                                />
                            </div>
                        </Row>
                    )}
                    {selectedFieldType === "idField" && (
                        <Row className="mb-2">
                            <label className="col-md-2 " style={{}}>
                                Set Id Pattern
                            </label>

                            <div className="col-md-2">
                                <select
                                    value={idType}
                                    onChange={(e) => {
                                        setIdType(e.target.value);
                                    }}
                                    className=" form-control"
                                >
                                    <option value="Row">Row</option>
                                    <option value="Col">Col</option>
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
                        </Row>
                    )}
                    {selectedFieldType === "skewMarkField" && (
                        <Row className="mb-2">
                            <label
                                htmlFor="example-select-input"
                                className="col-md-2 col-form-label"
                            >
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
                        </Row>
                    )}

                    <Row className="mb-2">
                        <label
                            htmlFor="example-select-input"
                            className="col-2 col-form-label"
                        >
                            Start Row
                        </label>
                        <div className="col-2 ">
                            <input
                                id="startRow"
                                type="number"
                                disabled={modalUpdate}
                                value={startRowInput}
                                onBlur={(e) => {
                                    const newValue = e.target.valueAsNumber;
                                    if (newValue > 0) {
                                        setSelection((item) => ({
                                            ...item,
                                            startRow: newValue - 1,
                                        }));
                                    } else {
                                        setStartRowInput(selection.startRow + 1); // Reset to previous valid value
                                    }
                                }}
                                onChange={(e) => {
                                    setStartRowInput(
                                        e.target.valueAsNumber >= 0 ? e.target.value : ""
                                    );
                                }}
                                className="form-control"
                            />
                        </div>
                        <label
                            htmlFor="example-select-input"
                            className="col-2 col-form-label"
                        >
                            End Row
                        </label>
                        <div className="col-2">
                            <input
                                type="number"
                                value={endRowInput}
                                disabled={modalUpdate}
                                onBlur={(e) => {
                                    const newValue = e.target.valueAsNumber;
                                    if (newValue > 0) {
                                        setSelection((item) => ({
                                            ...item,
                                            endRow: newValue - 1,
                                        }));
                                    } else {
                                        setEndRowInput(selection?.endRow + 1); // Reset to previous valid value
                                    }
                                }}
                                onChange={(e) => {
                                    setEndRowInput(
                                        e.target.valueAsNumber >= 0 ? e.target.value : ""
                                    );
                                }}
                                className="form-control"
                            />
                        </div>
                        <label
                            htmlFor="example-select-input"
                            className="col-2 col-form-label"
                        >
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
                            <input
                                type="number"
                                className="form-control"
                                value={noInRow}
                                onChange={(e) => setNoInRow(e.target.value)}
                                required
                            />
                        </div>
                        <label htmlFor="example-select-input" className="col-2 ">
                            Total Step In A Row
                        </label>
                        <div className="col-4">
                            <input
                                type="number"
                                className="form-control"
                                value={noOfStepInRow}
                                onChange={(e) => setNoOfStepInRow(e.target.value)}
                                required
                            />
                        </div>
                    </Row>
                    <Row className="mb-2">
                        <label
                            htmlFor="example-select-input"
                            className="col-2  col-form-label"
                        >
                            Start Col
                        </label>
                        <div className="col-2">
                            <input
                                type="number"
                                value={startColInput}
                                disabled={modalUpdate}
                                onBlur={(e) => {
                                    const newValue = e.target.valueAsNumber;
                                    if (newValue > 0) {
                                        setSelection((item) => ({
                                            ...item,
                                            startCol: newValue,
                                        }));
                                    } else {
                                        setStartColInput(selection?.startCol); // Reset to previous valid value
                                    }
                                }}
                                onChange={(e) => {
                                    setStartColInput(
                                        e.target.valueAsNumber >= 0 ? e.target.value : ""
                                    );
                                }}
                                className="form-control"
                            />
                            {/* <input
                value={selection?.startCol}
                readOnly
                className="form-control"
              /> */}
                        </div>

                        <label
                            htmlFor="example-select-input"
                            className="col-2 col-form-label"
                        >
                            End Col
                        </label>
                        <div className="col-2">
                            <input
                                type="number"
                                value={endColInput}
                                disabled={modalUpdate}
                                onBlur={(e) => {
                                    const newValue = e.target.valueAsNumber;
                                    if (newValue > 0) {
                                        setSelection((item) => ({
                                            ...item,
                                            endCol: newValue,
                                        }));
                                    } else {
                                        setEndColInput(selection?.endCol); // Reset to previous valid value
                                    }
                                }}
                                onChange={(e) => {
                                    setEndColInput(
                                        e.target.valueAsNumber >= 0 ? e.target.value : ""
                                    );
                                }}
                                className="form-control"
                            />
                            {/* <input
                value={selection?.endCol}
                readOnly
                className="form-control"
              /> */}
                        </div>
                        <label
                            htmlFor="example-select-input"
                            className="col-2 col-form-label"
                        >
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
                            <input
                                type="number"
                                className="form-control"
                                value={noInCol}
                                onChange={(e) => setNoInCol(e.target.value)}
                                required
                            />
                        </div>
                        <label htmlFor="example-select-input" className="col-2 ">
                            Total Step In A Col
                        </label>
                        <div className="col-4">
                            <input
                                type="number"
                                className="form-control"
                                value={noOfStepInCol}
                                onChange={(e) => setNoOfStepInCol(e.target.value)}
                                required
                            />
                        </div>
                    </Row>

                    <Row className="mb-2">
                        <label htmlFor="example-text-input" className="col-md-2 ">
                            Reading Direction :
                        </label>
                        <div className="col-md-10">
                            <select
                                className="form-control"
                                value={readingDirectionOption}
                                onChange={(e) => {
                                    setReadingDirectionOption(e.target.value);
                                }}
                                defaultValue={""}
                            >
                                <option value="">Select reading direction... </option>
                                <option value="0">From the upper left to the bottom</option>
                                <option value="1">From the upper right to the bottom </option>
                                <option value="2">From the lower left to a top</option>
                                <option value="3">From the lower right to a top</option>
                                <option value="4">From the upper left to right</option>
                                <option value="5">From the upper right to the left</option>
                                <option value="6">From the lower left to right</option>
                                <option value="7">From the lower right to the left </option>
                            </select>
                        </div>
                    </Row>

                    {selectedFieldType !== "idField" && (
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
                                    onChange={(e) => {
                                        setType(e.target.value);
                                    }}
                                    defaultValue={""}
                                >
                                    <option value="">Select reading direction... </option>
                                    <option value="1">
                                        Mask (at the time set window) about a mark{" "}
                                    </option>
                                    <option value="2">Fixed mark </option>
                                    <option value="3">Checkdigits </option>
                                    <option value="4">Range checking (ascending order)</option>
                                    <option value="5">Range checking (descending order)</option>
                                    <option value="6">Range checking (not order) </option>
                                    <option value="7">Mask setting(common to partition)</option>
                                </select>
                            </div>
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label "
                            >
                                Option :
                            </label>
                            <div className="col-3 ">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={option}
                                    onChange={(e) => setOption(e.target.value)}
                                    required
                                />
                            </div>
                        </Row>
                    )}
                    {(selectedFieldType === "questionField" ||
                        selectedFieldType === "formField") && (
                            <Row className="mb-2">
                                <label
                                    htmlFor="example-text-input"
                                    className="col-md-2 col-form-label "
                                >
                                    Total Fields :
                                </label>
                                <div className="col-4 ">
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={numberOfField}
                                        onChange={(e) => setNumberOfField(e.target.value)}
                                        required
                                    />
                                </div>
                                <label
                                    htmlFor="example-text-input"
                                    className="col-md-2 col-form-label "
                                >
                                    Field Type :
                                </label>
                                <div className="col-4 ">
                                    <select
                                        className="form-control"
                                        value={fieldType}
                                        onChange={(e) => {
                                            setFieldType(e.target.value);
                                        }}
                                        defaultValue={""}
                                    >
                                        <option value="">Select field type... </option>
                                        <option value="numeric">Numeric </option>
                                        <option value="alphabet">Alphabet </option>
                                        <option value="custom">Custom </option>
                                    </select>
                                </div>
                            </Row>
                        )}
                    {(selectedFieldType === "questionField" ||
                        selectedFieldType === "formField") &&
                        fieldType === "custom" && (
                            <Row>
                                <label htmlFor="example-text-input" className="col-md-2 ">
                                    Custom Value :
                                </label>
                                <div className="col-10 ">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={customValue}
                                        onChange={(e) => setCustomValue(e.target.value)}
                                        placeholder="Enter value separated by value, For Eg (2,3,4,Feild1, Feild2)"
                                    />
                                    <small style={{ color: "red" }}>
                                        *Custom value should be in the reading direction
                                    </small>
                                </div>
                            </Row>
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

export default EditDesignTemplate;
