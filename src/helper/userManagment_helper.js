import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"

// Create Class
export const createUser = data => post(url.CREATE_USER, data);
export const updateUser = data => post(url.UPDATE_USER, data);
export const removeUser = id => del(url.DELETE_USER + id);
export const fetchAllUsers = () => get(url.GET_USERS);
export const getUserRoles = () => get(url.GET_USER_ROLES);

export const login=(data)=>post(url.LOGIN,data)