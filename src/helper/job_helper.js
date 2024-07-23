import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"


export const createJob = (payload) => post(url.CREATE_JOB, payload);
export const getJobs = () => get(url.GET_ALL_JOBS);
export const deleteJob = (id) => del(url.DELETE_JOB + "/" + id);
