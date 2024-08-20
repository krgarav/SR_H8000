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
import DesignTemplate from "views/DesignTemplate";
import Booklet32Page from "views/Booklet32Page";
import Booklet24Page from "views/Booklet24Page";
import ImageGrid from "views/Imagegrid";
import FolderStructure from "views/FolderStructure";
import ReactFile from "views/ReactFile";
import FolderPicker from "views/FolderPicker";
import FolderPickerDirectory from "views/FolderPickerDirectory";
import AdminJobQueue from "views/AdminJobQueue";
import AppManagement from "views/AppManagement";

var routes = [
 
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/jobs",
    name: "Job Management",
    icon: "ni ni-briefcase-24 text-yellow",
    component: <Jobs />,
    layout: "/admin",
  },

  {
    path: "/template",
    name: "Layout Management",
    icon: "ni ni-collection text-red",
    component: <Template />,
    layout: "/admin",
  },

  {
    path: "/user-managment",
    name: "User Managment",
    icon: "ni ni-circle-08 text-info",
    component: <UserManagment />,
    layout: "/admin",
  },
  // {
  //   path: "/24-page-booklet",
  //   name: "24 page Booklet",
  //   icon: "ni ni-book-bookmark text-orange",
  //   component: <Booklet24Page />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/32-page-booklet",
  //   name: "Scan Template",
  //   icon: "ni ni-books text-success",
  //   component: <Booklet32Page />,
  //   layout: "/admin",
  // },
  {
    path: "/icons",
    name: "Admin Job Queue",
    icon: "ni ni-money-coins text-yellow",
    component: <AdminJobQueue />,
    layout: "/admin",
  },
  // {
  //   path: "/setting",
  //   name: "Settings",
  //   icon: "ni ni-settings-gear-65 text-primary",
  //   component: <FolderPickerDirectory />,
  //   layout: "/admin",
  // },
  {
    path: "/server-folder",
    name: "Folder Management",
    icon: "ni ni-settings-gear-65 text-primary",
    component: <FolderStructure />,
    layout: "/admin",
  },

  {
    path: "/application-ip",
    name: "App Management",
    icon: "ni ni-bullet-list-67 text-red",
    component: <AppManagement />,
    layout: "/admin",
  },
  
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: <Maps />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: <Profile />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: <Tables />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/login",
  //   name: "Login",
  //   icon: "ni ni-key-25 text-info",
  //   component: <Login />,
  //   layout: "/auth",
  // },
  // {
  //   path: "/register",
  //   name: "Register",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: <Register />,
  //   layout: "/auth",
  // },
];
export default routes;
