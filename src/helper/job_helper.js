import axios from "axios";
import { post, del, get, put } from "./api_helper";
import * as url from "./url_helper";

export const createJob = (payload) => post(url.CREATE_JOB, payload);
export const getJobs = () => get(url.GET_ALL_JOBS);
export const deleteJob = (id) => del(url.DELETE_JOB + "?Id=" + id);
export const assignJob = (data) => post(url.ASSIGN_JOB, data);
export const getAssignedJob = (id) => get(url.GET_ASSIGNED_JOB + "?Id=" + id);

export const getJobCount = (id) => get(url.GET_JOB_COUNT);

export const startJob = (data) => post(url.START_JOB, data);
export const finishJob = (data) => post(url.FINISH_JOB, data);
