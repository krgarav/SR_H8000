import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import UserManagment from "views/UserManagment";
import Jobs from "views/Jobs";
import Template from "views/Template";
import Settings from "views/Settings";
import JobQueue from "views/JobQueue";
import DesignTemplate from "views/DesignTemplate";
import Booklet32Page from "views/Booklet32Page";
import Booklet24Page from "views/Booklet24Page";
import ImageGrid from "views/Imagegrid";
import FolderStructure from "views/FolderStructure";
import ModeratorJobQueue from "views/ModeratorJobQueue";

var moderatorRoute = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/moderator",
  },
  {
    path: "/jobs",
    name: "Job Management",
    icon: "ni ni-briefcase-24 text-yellow",
    component: <Jobs />,
    layout: "/moderator",
  },
  // {
  //     path: "/32-page-booklet",
  //     name: "Scan Template",
  //     icon: "ni ni-books text-success",
  //     component: <Booklet32Page />,
  //     layout: "/moderator",
  // },
  {
    path: "/icons",
    name: "Moderator Job Queue",
    icon: "ni ni-money-coins text-yellow",
    component: <ModeratorJobQueue />,
    layout: "/moderator",
  },
  {
    path: "/server-folder",
    name: "Folder Management",
    icon: "ni ni-settings-gear-65 text-primary",
    component: <FolderStructure />,
    layout: "/moderator",
  },
];
export default moderatorRoute;
