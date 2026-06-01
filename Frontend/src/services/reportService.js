import api from './api';
import { extractErrorMessage } from '../utils/errorHandler';

const handle = (err) => { throw new Error(extractErrorMessage(err)); };

const reportService = {
  getAll:  ()    => api.get('/reports').catch(handle),
  getById: (id)  => api.get(`/reports/${id}`).catch(handle),
};

export default reportService;

export const getReports    = ()    => reportService.getAll();
export const getReportById = (id)  => reportService.getById(id);
