import api from "./api";

export const addAnimeAPI = (data) =>
    api.post("/anime", data);

export const getAllAnimeAPI = (params) =>
    api.get("/anime", { params });

export const getAnimeByIdAPI = (id) =>
    api.get(`/anime/${id}`);

export const updateAnimeAPI = (id, data) =>
    api.patch(`/anime/${id}`, data);

export const updateAnimeStatusAPI = (id, watchStatus) =>
    api.patch(`/anime/${id}/status`, { watchStatus });

export const deleteAnimeAPI = (id) =>
    api.delete(`/anime/${id}`);