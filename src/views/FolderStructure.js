import { FileManagerComponent, Inject, NavigationPane, DetailsView, Toolbar } from '@syncfusion/ej2-react-filemanager';
import * as React from 'react';
import '@syncfusion/ej2-base/styles/bootstrap5.css';
import '@syncfusion/ej2-icons/styles/bootstrap5.css';
import '@syncfusion/ej2-inputs/styles/bootstrap5.css';
import '@syncfusion/ej2-popups/styles/bootstrap5.css';
import '@syncfusion/ej2-buttons/styles/bootstrap5.css';
import '@syncfusion/ej2-splitbuttons/styles/bootstrap5.css';
import '@syncfusion/ej2-navigations/styles/bootstrap5.css';
import '@syncfusion/ej2-layouts/styles/bootstrap5.css';
import '@syncfusion/ej2-grids/styles/bootstrap5.css';
import '@syncfusion/ej2-react-filemanager/styles/bootstrap5.css';
import SmallHeader from 'components/Headers/SmallHeader';
import { Container } from "reactstrap";
import "../App.css"
import { MAIN_URL } from 'helper/url_helper';
import { getUrls } from 'helper/url_helper';
const Overview = () => {
    const [hostUrl, setHostUrl] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUrls();
        const GetDataURL = response.MAIN_URL;
        setHostUrl(GetDataURL);
      } catch (error) {
        console.error('Error fetching URLs:', error);
        // Handle the error appropriately (e.g., show an error message)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



    if (loading) {
        return (
          <div className="loader-container">
            {/* Add your loader component or spinner here */}
            <p>Loading...</p>
          </div>
        );
      }
    return (
        <div className="full-height-container">
            <SmallHeader />
            <div style={{ height: "200px" }}>
                <FileManagerComponent
                    id="overview_file"
                    height={500}
                    ajaxSettings={{
                        url: hostUrl + "api/FileManager/FileOperations",
                        getImageUrl: hostUrl + "api/FileManager/GetImage",
                        uploadUrl: hostUrl + 'api/FileManager/Upload',
                        downloadUrl: hostUrl + 'api/FileManager/Download'
                    }}
                    toolbarSettings={{ items: ['NewFolder', 'SortBy', 'Cut', 'Copy', 'Paste', 'Delete', 'Refresh', 'Download', 'Rename', 'Selection', 'View', 'Details'] }}
                    contextMenuSettings={{ layout: ['SortBy', 'View', 'Refresh', '|', 'Paste', '|', 'NewFolder', '|', 'Details', '|', 'SelectAll'] }}
                    view={"Details"}
                >
                    <Inject services={[NavigationPane, DetailsView, Toolbar]} />
                </FileManagerComponent>
            </div>
        </div>
    );
};

export default Overview;
