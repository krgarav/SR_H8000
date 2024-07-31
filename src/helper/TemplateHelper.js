import axios from "axios"
import { post, del, get, put, postWithFormData } from "./api_helper"
import * as url from "./url_helper"

// Create Class
export const fetchAllTemplate = () => get(url.GET_AllTEMPLATE);

export const createTemplate = (data) => post(url.CREATE_TEMPLATE, data)
export const deleteTemplate = (id) => del(`${url.DELETE_TEMPLATE}?Id=${id}`);
export const getLayoutDataById = (id) => get(`${url.GET_LAYOUT_DATA}?Id=${id}`);
export const getScannedImage = () => get(url.SCAN_IMAGE);
export const sendFile = (data) => postWithFormData(url.SEND_FILE, data)