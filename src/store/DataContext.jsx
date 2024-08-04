import React from "react";
const DataContext = React.createContext({
  allTemplates: [],
  addToAllTemplate: () => {},
  setAllTemplates: () => {},
  modifyAllTemplate: () => {},
  modifyWithRegion : ()=>{},
  deleteTemplate: () => {},
  deleteFieldTemplate : ()=>{},
  modifyRegionWithUUID : ()=>{}
});

export default DataContext;
