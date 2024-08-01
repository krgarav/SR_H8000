import React from "react";
const DataContext = React.createContext({
  allTemplates: [],
  addToAllTemplate: () => {},
  setAllTemplates: () => {},
  modifyAllTemplate: () => {},
  modifyWithRegion : ()=>{},
  deleteTemplate: () => {},
});

export default DataContext;
