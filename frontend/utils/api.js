import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const fetchPosts = async (params={}) =>
  axios.get(`${API_URL}/posts`, { params }).then(res => res.data);

export const fetchPost = async id =>
  axios.get(`${API_URL}/posts/${id}`).then(res => res.data);

export const login = async (username, password) =>
  axios.post(`${API_URL}/auth/login`, { username, password }).then(res => res.data);

export const signup = async (username, password) =>
  axios.post(`${API_URL}/auth/signup`, { username, password }).then(res => res.data);

export const createPost = async (data, token) =>
  axios.post(`${API_URL}/posts`, data, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
