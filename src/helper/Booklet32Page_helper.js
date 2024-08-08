import axios from "axios";
import { post, del, get, put } from "./api_helper";
import * as url from "./url_helper";

// Create Class
export const fetchProcessData = (id, userId) =>
  get(url.GET_PROCESS_DATA + `?Id=${id}&UserId=${userId}`);
export const scanFiles = (id, userId) =>
  post(url.SCAN_FILES + `?Id=${id}&UserId=${userId}`);
export const refreshScanner = () => get(url.REFRESH_SCANNER);
