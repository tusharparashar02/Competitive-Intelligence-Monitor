import api from './api';
import { extractErrorMessage } from '../utils/errorHandler';

const handle = (err) => { throw new Error(extractErrorMessage(err)); };

const redditService = {
  getMentions: (competitorId, page = 1, pageSize = 20) =>
    api.get(`/competitors/${competitorId}/reviews?page=${page}&pageSize=${pageSize}`).catch(handle),

  getSentiment: (competitorId, lastDays = 30) =>
    api.get(`/competitors/${competitorId}/reviews/sentiment?lastDays=${lastDays}`).catch(handle),
};

export default redditService;
