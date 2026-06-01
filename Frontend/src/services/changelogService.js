import api from './api';
import { extractErrorMessage } from '../utils/errorHandler';

const handle = (err) => { throw new Error(extractErrorMessage(err)); };

const changelogService = {
  getEntries: (competitorId, page = 1, pageSize = 20) =>
    api.get(`/competitors/${competitorId}/changelog?page=${page}&pageSize=${pageSize}`).catch(handle),
};

export default changelogService;
