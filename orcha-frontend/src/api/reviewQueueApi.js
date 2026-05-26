// Fetches pending AI-generated outputs and sends approve/reject/edit decisions to the API
import client from './client';

export const reviewQueueApi = {
  getAll: (page = 1, status = '') => client.get('/review-queue', { params: { page, ...(status && { status }) } }),
  getOne: (id) => client.get(`/review-queue/${id}`),
  approve: (id) => client.patch(`/review-queue/${id}/approve`),
  reject: (id, reviewNote) => client.patch(`/review-queue/${id}/reject`, { reviewNote }),
  edit: (id, editedOutput) => client.patch(`/review-queue/${id}/edit`, { editedOutput }),
  markSent: (id) => client.patch(`/review-queue/${id}/mark-sent`),
};
