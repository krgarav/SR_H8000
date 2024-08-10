import axios from "axios";
import { post, del, get, put, postWithFormData } from "./api_helper";
import * as url from "./url_helper";

// Create Class
export const fetchAllTemplate = () => get(url.GET_AllTEMPLATE);

export const createTemplate = (data) => post(url.CREATE_TEMPLATE, data);
export const deleteTemplate = (id) => del(`${url.DELETE_TEMPLATE}?Id=${id}`);
export const getLayoutDataById = (id) => get(`${url.GET_LAYOUT_DATA}?Id=${id}`);

export const sendFile = (data) => postWithFormData(url.SEND_FILE, data);
export const getSampleData = () => get(url.GET_SCANNED_IMAGE);
export const getTemplateImage = (path) =>
  get(`${url.GET_TEMPLATE_IMAGE}?filePath=${path}`);
export const getTemplateCsv = (path) =>
  get(`${url.GET_TEMPLATE_CSV}?csvPath=${path}`);
export const cancelScan = () => get(url.CANCEL_SCAN);
export const checkJobStatus = (id) =>
  get(`${url.CHECK_DELETE_TEMPLATE}?Id=${id}`);
