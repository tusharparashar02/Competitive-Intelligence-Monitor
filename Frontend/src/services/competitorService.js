import api from './api';
import { extractErrorMessage } from '../utils/errorHandler';

const handle = (err) => { throw new Error(extractErrorMessage(err)); };

const competitorService = {
  getAll:  ()           => api.get('/competitors').catch(handle),
  getById: (id)         => api.get(`/competitors/${id}`).catch(handle),
  create:  (data)       => api.post('/competitors', data).catch(handle),
  update:  (id, data)   => api.put(`/competitors/${id}`, data).catch(handle),
  delete:  (id)         => api.delete(`/competitors/${id}`).catch(handle),
};

export default competitorService;

export const createCompetitor  = (data) => competitorService.create(data);
export const getCompetitorById = (id)   => competitorService.getById(id);
export const deleteCompetitor  = (id)   => competitorService.delete(id);
