import api from "./api";

export const addMovieAPI = (data) => api.post("/movies", data);
export const getAllMoviesAPI = (params) => api.get("/movies", { params });
export const getMovieByIdAPI = (id) => api.get(`/movies/${id}`);
export const updateMovieAPI = (id, data) => api.patch(`/movies/${id}`, data);
export const updateMovieStatusAPI = (id, watchStatus) => api.patch(`/movies/${id}/status`, { watchStatus });
export const deleteMovieAPI = (id) => api.delete(`/movies/${id}`);