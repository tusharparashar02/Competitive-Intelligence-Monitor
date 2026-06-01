import api from './api';
import { extractErrorMessage } from '../utils/errorHandler';

const handle = (err) => { throw new Error(extractErrorMessage(err)); };

const alertService = {
  getAll:         (unreadOnly = false) => api.get(`/alerts?unreadOnly=${unreadOnly}`).catch(handle),
  getUnreadCount: ()                   => api.get('/alerts/unread-count').catch(handle),
  markAsRead:     (id)                 => api.put(`/alerts/${id}/read`).catch(handle),
  markAllAsRead:  ()                   => api.put('/alerts/read-all').catch(handle),
};

export default alertService;
