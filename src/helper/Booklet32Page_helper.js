import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"

// Create Class
export const fetchProcessData = (id) => get(url.GET_PROCESS_DATA + `?Id=${id}`);
export const scanFiles = (id) => post(url.SCAN_FILES + `?Id=${id}`);
export const refreshScanner = () => get(url.REFRESH_SCANNER);

