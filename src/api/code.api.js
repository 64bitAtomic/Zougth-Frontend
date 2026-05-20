import api from "./api";

export const addCodeAPI = (data) => api.post("/codes", data);
export const getAllCodesAPI = (params) => api.get("/codes", { params });
export const getCodeByIdAPI = (id) => api.get(`/codes/${id}`);
export const updateCodeAPI = (id, data) => api.patch(`/codes/${id}`, data);
export const deleteCodeAPI = (id) => api.delete(`/codes/${id}`);
export const getCodeCategoriesAPI = () => api.get("/codes/categories");