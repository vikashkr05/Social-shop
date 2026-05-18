import axios from 'axios';
import type {
  AuthResponse, FeedResponse, LinkMeta, Post,
  UserProfile, User, PageResponse,
} from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post<AuthResponse>('/api/auth/register', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/api/auth/login', data).then((r) => r.data),
  me: () => api.get<User>('/api/auth/me').then((r) => r.data),
};

export const feedApi = {
  getFeed: (cursor = 0, size = 20) =>
    api.get<FeedResponse>('/api/feed', { params: { cursor, size } }).then((r) => r.data),
};

export const postsApi = {
  create: (data: { url: string; caption?: string }) =>
    api.post<Post>('/api/posts', data).then((r) => r.data),
  delete: (postId: string) => api.delete(`/api/posts/${postId}`),
  like: (postId: string) => api.post(`/api/posts/${postId}/like`),
  unlike: (postId: string) => api.delete(`/api/posts/${postId}/like`),
  save: (postId: string) => api.post(`/api/posts/${postId}/save`),
  unsave: (postId: string) => api.delete(`/api/posts/${postId}/save`),
};

export const usersApi = {
  getProfile: (username: string) =>
    api.get<UserProfile>(`/api/users/${username}`).then((r) => r.data),
  getPosts: (username: string, page = 0, size = 20) =>
    api.get<PageResponse<Post>>(`/api/users/${username}/posts`, { params: { page, size } }).then((r) => r.data),
  getFollowers: (username: string) =>
    api.get<User[]>(`/api/users/${username}/followers`).then((r) => r.data),
  getFollowing: (username: string) =>
    api.get<User[]>(`/api/users/${username}/following`).then((r) => r.data),
};

export const socialApi = {
  follow: (userId: string) => api.post(`/api/social/follow/${userId}`),
  unfollow: (userId: string) => api.delete(`/api/social/unfollow/${userId}`),
  isFollowing: (userId: string) =>
    api.get<{ following: boolean }>(`/api/social/is-following/${userId}`).then((r) => r.data),
};

export const linksApi = {
  extract: (url: string) =>
    api.post<LinkMeta>('/api/links/extract', { url }).then((r) => r.data),
};

export default api;