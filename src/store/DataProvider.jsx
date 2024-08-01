import React, { useState, useEffect } from "react";
import DataContext from "./DataContext"; // Assuming you have a DataContext
import { isEqual } from "lodash";

const initialData = { allTemplates: [] }; // Initial data if localStorage is empty

const DataProvider = (props) => {
  // Initialize dataState from localStorage if it exists, otherwise use initialData
  const [dataState, setDataState] = useState(initialData);

  // Save dataState to localStorage whenever it changes

  // useEffect(() => {
  //   const stringifiedTemdata = JSON.stringify(dataState.allTemplates);
  //   localStorage.setItem("Template", stringifiedTemdata);
  // }, [dataState]);

  const templateHandler = (template) => {
    let newIndex;
    setDataState((prevState) => {
      // Ensure prevState.allTemplates is always an array
      const allTemplates = Array.isArray(prevState.allTemplates)
        ? prevState.allTemplates
        : [];
      newIndex = allTemplates.length; // Calculate the new index
      return {
        ...prevState,
        allTemplates: [...allTemplates, template],
      };
    });
    return newIndex; // Return the new index
  };

  const modifyTemplateHandler = (index, regionData, fieldType) => {
    console.log(index);
    setDataState((item) => {
      const copiedData = [...item.allTemplates];
      const currentTemplate = copiedData[index];

      switch (fieldType) {
        case "skewMarkField":
          currentTemplate[0].skewMarksWindowParameters = currentTemplate[0]
            .skewMarksWindowParameters
            ? [...currentTemplate[0]?.skewMarksWindowParameters, regionData]
            : [regionData];
          break;
        case "formField":
          currentTemplate[0].formFieldWindowParameters = currentTemplate[0]
            .formFieldWindowParameters
            ? [...currentTemplate[0].formFieldWindowParameters, regionData]
            : [regionData];
          break;
        case "questionField":
          currentTemplate[0].questionsWindowParameters = currentTemplate[0]
            .questionsWindowParameters
            ? [...currentTemplate[0].questionsWindowParameters, regionData]
            : [regionData];
          break;
        default:
          currentTemplate[0].layoutParameters = {
            ...currentTemplate[0].layoutParameters,
            ...regionData,
          };
          break;
      }

      return {
        ...item,
        allTemplates: copiedData,
      };
    });
  };
  const deleteTemplateHandler = (index) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (isConfirmed) {
      setDataState((prevState) => {
        const updatedTemplates = prevState.allTemplates.filter(
          (_, i) => i !== index
        );
        return {
          ...prevState,
          allTemplates: updatedTemplates,
        };
      });
    }
  };
  const addToAllTemplateHandler = (template) => {
    setDataState((prevState) => {
      return {
        ...prevState,
        allTemplates: template,
      };
    });
  };
  const addFieldToTemplateHandler = (regionData, index) => {
    const {
      formFieldWindowParameters,
      imageData,
      printingData,
      questionsWindowParameters,
      skewMarksWindowParameters,
      barcodeData,
      layoutParameters,
    } = regionData;

    const imageCoordinates = layoutParameters.imageCoordinates;
    const imageStructureData = {
      height: imageCoordinates?.height,
      x: imageCoordinates?.x,
      y: imageCoordinates?.y,
      width: imageCoordinates?.width,
    };

    const layoutCoordinates = layoutParameters.layoutCoordinates;
    console.log(layoutCoordinates);
    const Coordinate = {
      "End Col": layoutCoordinates["right"],
      "End Row": layoutCoordinates["end"],
      "Start Col": layoutCoordinates["left"],
      "Start Row": layoutCoordinates["start"],
    };

    const updatedLayoutParameter = {
      ...layoutParameters,
      Coordinate,
      imageStructureData,
    };
    delete updatedLayoutParameter.imageCoordinates;
    delete updatedLayoutParameter.layoutCoordinates;

    //   console.log(formFieldWindowParameters);

    const updatedFormField = formFieldWindowParameters?.map((item) => {
      const { formFieldCoordinates, ...rest } = item;
      const questionWindowCoordinates = formFieldCoordinates
        ? {
            "End Col": formFieldCoordinates["right"],
            "End Row": formFieldCoordinates["end"],
            "Start Col": formFieldCoordinates["left"],
            "Start Row": formFieldCoordinates["start"],
          }
        : {};
      return { ...rest, questionWindowCoordinates };
    });
    const updatedSkewField = skewMarksWindowParameters?.map((item) => {
      const { formFieldCoordinates, ...rest } = item;
      const questionWindowCoordinates = formFieldCoordinates
        ? {
            "End Col": formFieldCoordinates["right"],
            "End Row": formFieldCoordinates["end"],
            "Start Col": formFieldCoordinates["left"],
            "Start Row": formFieldCoordinates["start"],
          }
        : {};
      return { ...rest, questionWindowCoordinates };
    });
    const updatedQuestionField = questionsWindowParameters?.map((item) => {
      const { formFieldCoordinates, ...rest } = item;
      const questionWindowCoordinates = formFieldCoordinates
        ? {
            "End Col": formFieldCoordinates["right"],
            "End Row": formFieldCoordinates["end"],
            "Start Col": formFieldCoordinates["left"],
            "Start Row": formFieldCoordinates["start"],
          }
        : {};
      return { ...rest, questionWindowCoordinates };
    });
    // const Coordinate = {
    //   "End Col": layoutCoordinates["right"],
    //   "End Row": layoutCoordinates["end"],
    //   "Start Col": layoutCoordinates["left"],
    //   "Start Row": layoutCoordinates["start"],
    // };

    // const updatedLayoutParameter = {
    //   ...layoutParameters,
    //   Coordinate,
    //   imageStructureData,
    // };
    // delete updatedLayoutParameter.imageCoordinates;
    // delete updatedLayoutParameter.layoutCoordinates;

    setDataState((prevState) => {
      const copiedData = [...prevState.allTemplates];
      const currentTemplate = copiedData[index];
      currentTemplate[0].skewMarksWindowParameters = updatedSkewField;
      currentTemplate[0].formFieldWindowParameters = updatedFormField;
      currentTemplate[0].questionsWindowParameters = updatedQuestionField;
      currentTemplate[0].imageData = imageData;
      currentTemplate[0].printingData = printingData;
      currentTemplate[0].barcodeData = barcodeData;
      currentTemplate[0].layoutParameters = updatedLayoutParameter;

      return {
        ...prevState,
        allTemplates: copiedData,
      };
    });
  };
  const modifyWithRegionHandler = (
    templateIndex,
    regionData,
    fieldType,
    coordinateIndex
  ) => {
    if (coordinateIndex === -1) {
      alert("cannot be -1");
    }
    setDataState((item) => {
      const copiedData = [...item.allTemplates];
      const currentTemplate = copiedData[templateIndex];

      switch (fieldType) {
        case "skewMarkField":
          currentTemplate[0].skewMarksWindowParameters[coordinateIndex] =
            regionData;
          break;
        case "formField":
          currentTemplate[0].formFieldWindowParameters[coordinateIndex] =
            regionData;
          break;
        case "questionField":
          currentTemplate[0].questionsWindowParameters[coordinateIndex] =
            regionData;

          break;
        default:
          currentTemplate[0].layoutParameters = {
            ...currentTemplate[0].layoutParameters,
            ...regionData,
          };
          break;
      }
      return {
        ...item,
        allTemplates: copiedData,
      };
    });
  };
  const deleteFieldTemplateHandler = (templateIndex, selectedFieldData) => {
    const fieldType = selectedFieldData.fieldType;
    setDataState((item) => {
      const copiedData = [...item.allTemplates];
      const currentTemplate = copiedData[templateIndex][0];

      switch (fieldType) {
        case "skewMarkField":
          const parameters = currentTemplate?.skewMarksWindowParameters;

          const updatedSkew = parameters.filter(
            (item) => !isEqual(item.Coordinate, selectedFieldData)
          );

          currentTemplate.skewMarksWindowParameters = updatedSkew;
          break;
        case "formField":
          const formparameters = currentTemplate?.formFieldWindowParameters;

          const updatedForm = formparameters.filter(
            (item) => !isEqual(item.Coordinate, selectedFieldData)
          );

          currentTemplate.formFieldWindowParameters = updatedForm;
          break;
        case "questionField":
          const questionparameters = currentTemplate?.questionsWindowParameters;

          const questionForm = questionparameters.filter(
            (item) => !isEqual(item.Coordinate, selectedFieldData)
          );

          currentTemplate.questionsWindowParameters = questionForm;
          break;
        default:
          currentTemplate.layoutParameters = {
            ...currentTemplate.layoutParameters,
          };
          break;
      }
      return {
        ...item,
        allTemplates: copiedData,
      };
    });
  };
  const dataContext = {
    allTemplates: dataState.allTemplates,
    setAllTemplates: templateHandler,
    modifyAllTemplate: modifyTemplateHandler,
    deleteTemplate: deleteTemplateHandler,
    addToAllTemplate: addToAllTemplateHandler,
    addFieldToTemplate: addFieldToTemplateHandler,
    modifyWithRegion: modifyWithRegionHandler,
    deleteFieldTemplate: deleteFieldTemplateHandler,
  };

  return (
    <DataContext.Provider value={dataContext}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataProvider;
