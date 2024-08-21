import React, { useEffect, useState } from "react";
import {
  FileManagerComponent,
  Toolbar,
  DetailsView,
  NavigationPane,
} from "@syncfusion/ej2-react-filemanager";
import { FileOpenEventArgs } from "@syncfusion/ej2-filemanager";
import SmallHeader from "components/Headers/SmallHeader";
import { MAIN_URL } from "helper/url_helper";
import { getUrls } from "helper/url_helper";
const DirectoryPicker = ({ handleChange }) => {
  const [hostUrl, setHostUrl] = useState("http://localhost:81/");
  useEffect(() => {
    const fetchData = async () => {
      const response = await getUrls;
      const GetDataURL = await response.MAIN_URL;
      setHostUrl(GetDataURL);
    };
    fetchData();
  }, []);

  const [selectedDirectory, setSelectedDirectory] = useState("");

  const handleFileSelect = (args: FileOpenEventArgs) => {
    if (args.fileDetails.isFile === false) {
      // It's a directory
      const path = args.fileDetails.filterPath;
      const mainPath = path + args.fileDetails.name;
      setSelectedDirectory(mainPath);
      handleChange(mainPath);
    }
  };

  return (
    <>
      <div style={{ height: "65vh", overflow: "auto" }}>
        <h2>Pick directory of server </h2>
        <FileManagerComponent
          id="filemanager"
          ajaxSettings={{
            url: `${hostUrl}api/FileManager/FileOperations`,
            getImageUrl: `${hostUrl}api/FileManager/GetImage`,
            uploadUrl: `${hostUrl}api/FileManager/Upload`,
            downloadUrl: `${hostUrl}api/FileManager/Download`,
          }}
          toolbarSettings={{
            items: ["NewFolder", "Rename", "Refresh", "View", "Details"],
          }}
          view="LargeIcons"
          showThumbnail={false}
          enablePersistence={true}
          allowDragAndDrop={false}
          fileSelect={handleFileSelect} // Event to handle file/folder selection
        />

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

export default DirectoryPicker;
