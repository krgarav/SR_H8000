const url = "https://28mdpn6d-5000.inc1.devtunnels.ms/";
// const url = "http://192.168.0.173:5001/";
// https://28mdpn6d-5289.inc1.devtunnels.ms/swagger/index.html

export const CREATE_USER = url + "UserRegistration";
export const UPDATE_USER = url + "UpdateUser";
export const GET_USERS = url + "GetUsers";
export const LOGIN = url + "Login";
export const DELETE_USER = url + "DeleteUser?Id=";
export const GET_USER_ROLES = url + "GetUserRole";

export const GET_PROCESS_DATA = url + "ProcessData";
export const SCAN_FILES = url + "ScanFiles";
export const REFRESH_SCANNER = url + "RefreshScanner";

export const GET_PROCESS_24_PAGE_DATA = url + "Process_24_Page_Booklet_Data";
export const SCAN_24_PAGE_FILES = url + "Scan_24_Page_Booklet";

export const GET_PROCESS_32_PAG_DATA = url + "ProcessData";
export const SCAN_32_PAGE_FILES = url + "Scan_32_Page_Booklet";

export const GET_AllTEMPLATE = url + "GetAllLayout";
export const GET_LAYOUT_DATA = url + "GetLayoutDataById";
export const CREATE_TEMPLATE = url + "LayoutSetting";
export const SEND_FILE = url + "SaveLayoutFiles";
export const DELETE_TEMPLATE = url + "DeleteLayout";
export const CHECK_DELETE_TEMPLATE = url + "GetJobStatus";
export const GET_TEMPLATE_IMAGE = url + "GetTemplateImage";
export const GET_TEMPLATE_CSV = url + "GetTemplateCSV";
export const CANCEL_SCAN = url + "CancelScan";

export const CREATE_JOB = url + "CreateJobs";
export const GET_ALL_JOBS = url + "GetAllJobs";
export const DELETE_JOB = url + "DeleteJob";
export const GET_JOB_DETAIL = url + "GetJobById";



export const ASSIGN_JOB = url + "AssignJob";
export const GET_ASSIGNED_JOB = url + "GetJobQueueList";
export const GET_SCANNED_IMAGE = url + "GetSampleData";
export const GET_JOB_COUNT = url + "GetTotalJobCount";
export const START_JOB = url + "StartJob";
export const FINISH_JOB = url + "FinishJob";

export const MAIN_URL = url;
