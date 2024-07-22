import React from "react";
const DataContext = React.createContext({
  allTemplates: [],
  addToAllTemplate: () => {},
  setAllTemplates: () => {},
  modifyAllTemplate: () => {},
  deleteTemplate: () => {},
});

export default DataContext;
