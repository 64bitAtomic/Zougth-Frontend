import api from "./api";

export const addLinkAPI = (data) => api.post("/links", data);
export const getAllLinksAPI = (params) => api.get("/links", { params });
export const getLinkByIdAPI = (id) => api.get(`/links/${id}`);
export const updateLinkAPI = (id, data) => api.patch(`/links/${id}`, data);
export const deleteLinkAPI = (id) => api.delete(`/links/${id}`);
export const getLinkCategoriesAPI = () => api.get("/links/categories");