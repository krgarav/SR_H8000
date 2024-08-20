import getBaseUrl from "services/BackendApi";



export const CREATE_USER = getBaseUrl() + "UserRegistration";
export const UPDATE_USER = getBaseUrl() + "UpdateUser";
export const GET_USERS = getBaseUrl() + "GetUsers";
export const LOGIN = getBaseUrl() + "Login";
export const DELETE_USER = getBaseUrl() + "DeleteUser?Id=";
export const GET_USER_ROLES = getBaseUrl() + "GetUserRole";

export const GET_PROCESS_DATA = getBaseUrl() + "ProcessData";
export const SCAN_FILES = getBaseUrl() + "ScanFiles";
export const REFRESH_SCANNER = getBaseUrl() + "RefreshScanner";

export const GET_PROCESS_24_PAGE_DATA = getBaseUrl() + "Process_24_Page_Booklet_Data";
export const SCAN_24_PAGE_FILES = getBaseUrl() + "Scan_24_Page_Booklet";

export const GET_PROCESS_32_PAG_DATA = getBaseUrl() + "ProcessData";
export const SCAN_32_PAGE_FILES = getBaseUrl() + "Scan_32_Page_Booklet";

export const GET_AllTEMPLATE = getBaseUrl() + "GetAllLayout";
export const GET_LAYOUT_DATA = getBaseUrl() + "GetLayoutDataById";
export const CREATE_TEMPLATE = getBaseUrl() + "LayoutSetting";
export const SEND_FILE = getBaseUrl() + "SaveLayoutFiles";
export const DELETE_TEMPLATE = getBaseUrl() + "DeleteLayout";
export const CHECK_DELETE_TEMPLATE = getBaseUrl() + "GetJobStatus";
export const GET_TEMPLATE_IMAGE = getBaseUrl() + "GetTemplateImage";
export const GET_TEMPLATE_CSV = getBaseUrl() + "GetTemplateCSV";
export const CANCEL_SCAN = getBaseUrl() + "CancelScan";
export const GENERATE_EXCEL = getBaseUrl() + "GenerateExcelFile";

export const CREATE_JOB = getBaseUrl() + "CreateJobs";
export const GET_ALL_JOBS = getBaseUrl() + "GetAllJobs";
export const DELETE_JOB = getBaseUrl() + "DeleteJob";
export const GET_JOB_DETAIL = getBaseUrl() + "GetJobById";



export const ASSIGN_JOB = getBaseUrl() + "AssignJob";
export const GET_ASSIGNED_JOB = getBaseUrl() + "GetJobQueueList";
export const GET_SCANNED_IMAGE = getBaseUrl() + "GetSampleData";
export const GET_JOB_COUNT = getBaseUrl() + "GetTotalJobCount";
export const START_JOB = getBaseUrl() + "StartJob";
export const FINISH_JOB = getBaseUrl() + "FinishJob";
export const UPDATE_JOB = getBaseUrl() + "UpdateJobs";
export const MAIN_URL = getBaseUrl();


