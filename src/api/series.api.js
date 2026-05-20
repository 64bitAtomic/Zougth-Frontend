import api from "./api";

export const addSeriesAPI = (data) => api.post("/series", data);
export const getAllSeriesAPI = (params) => api.get("/series", { params });
export const getSeriesByIdAPI = (id) => api.get(`/series/${id}`);
export const updateSeriesAPI = (id, data) => api.patch(`/series/${id}`, data);
export const updateSeriesStatusAPI = (id, watchStatus) => api.patch(`/series/${id}/status`, { watchStatus });
export const deleteSeriesAPI = (id) => api.delete(`/series/${id}`);