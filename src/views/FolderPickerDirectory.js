import React, { useState } from "react";
import {
  FileManagerComponent,
  Toolbar,
  DetailsView,
  NavigationPane,
} from "@syncfusion/ej2-react-filemanager";
import { FileOpenEventArgs } from "@syncfusion/ej2-filemanager";
import SmallHeader from "components/Headers/SmallHeader";

const FolderPickerDirectory = () => {
  const hostUrl = "https://ej2-aspcore-service.azurewebsites.net/";
  const [selectedDirectory, setSelectedDirectory] = useState("");

  const handleFileSelect = (args: FileOpenEventArgs) => {
    console.log(args);
    if (args.fileDetails.isFile === false) {
      // It's a directory
      const path = args.fileDetails.filterPath;
      const mainPath = path + args.fileDetails.name;
      console.log(path);
      setSelectedDirectory(mainPath);
    }
  };

  const handleButtonClick = () => {
    console.log("Selected Directory:", selectedDirectory);
    // You can also display the selected directory path or use it as needed
  };

  return (
    <>
      <SmallHeader />
      <div>
        <h2>Directory Picker</h2>
        <FileManagerComponent
          id="filemanager"
          ajaxSettings={{
            url: `${hostUrl}api/FileManager/FileOperations`,
            getImageUrl: `${hostUrl}api/FileManager/GetImage`,
            uploadUrl: `${hostUrl}api/FileManager/Upload`,
            downloadUrl: `${hostUrl}api/FileManager/Download`,
          }}
          toolbarSettings={{ items: [] }} // Hide toolbar items for simplicity
          view="LargeIcons"
          showThumbnail={false}
          enablePersistence={true}
          allowDragAndDrop={false}
          fileSelect={handleFileSelect} // Event to handle file/folder selection
        />
        <button onClick={handleButtonClick}>Get Selected Directory</button>
        {selectedDirectory && (
          <div>
            <h3>Selected Directory:</h3>
            <p>{selectedDirectory}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default FolderPickerDirectory;
