import { Hour, User } from '_shared/types/types';
import axios, { AxiosResponse } from 'axios';

export const apiUrl = process.env.API_URL || 'http://localhost:3005';

axios.defaults.baseURL = apiUrl;
axios.defaults.withCredentials = true;
axios.defaults.headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'http://localhost:3000/',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
};
axios.defaults.validateStatus = function () {
  return true;
};

function handleUnAuthorizedRequest(response: AxiosResponse) {
  if (response.status === 401) {
    alert('Your are not authorized to access this resource.');
    location.pathname = '/login';
  }
  return response;
}

export async function register(data: { username: string; password: string }): Promise<AxiosResponse> {
  return axios.post('/register', data);
}

export async function login(data: { username: string; password: string }): Promise<AxiosResponse> {
  return axios.post('/login', data);
}

export async function logout(): Promise<AxiosResponse> {
  return axios.post('/logout');
}

export async function getAuth(): Promise<AxiosResponse> {
  return axios.get('/auth');
}

export async function createUser(accountId: string, user: User): Promise<AxiosResponse> {
  const response = await axios.post(`/account/${accountId}/users`, user);
  return handleUnAuthorizedRequest(response);
}

export async function getUser(accountId: string, userId: string): Promise<AxiosResponse> {
  const response = await axios.get(`/account/${accountId}/users/${userId}`);
  return handleUnAuthorizedRequest(response);
}

export async function getUsers(accountId: string): Promise<AxiosResponse> {
  const response = await axios.get(`/account/${accountId}/users`);
  return handleUnAuthorizedRequest(response);
}

export async function updateUser(user: User): Promise<AxiosResponse> {
  const response = await axios.put(`/account/${user.accountId}/users/${user.userId}`, user);
  return handleUnAuthorizedRequest(response);
}

export async function deleteUser(user: User): Promise<AxiosResponse> {
  const response = await axios.delete(`/account/${user.accountId}/users/${user.userId}`);
  return handleUnAuthorizedRequest(response);
}

export async function createHour(accountId: string, userId: string, hour: Hour): Promise<AxiosResponse> {
  const response = await axios.post(`/account/${accountId}/users/${userId}/hours`, hour);
  return handleUnAuthorizedRequest(response);
}

export async function getHours(
  accountId: string,
  userId: string,
  params?: { fromDate: Date | null; toDate: Date | null }
): Promise<AxiosResponse> {
  const response = await axios.get(`/account/${accountId}/users/${userId}/hours`, { params });
  return handleUnAuthorizedRequest(response);
}

export async function updateHour(hour: Hour): Promise<AxiosResponse> {
  const response = await axios.put(`/account/${hour.accountId}/users/${hour.userId}/hours/${hour.hourId}`, hour);
  return handleUnAuthorizedRequest(response);
}

export async function deleteHour(hour: Hour): Promise<AxiosResponse> {
  const response = await axios.delete(`/account/${hour.accountId}/users/${hour.userId}/hours/${hour.hourId}`);
  return handleUnAuthorizedRequest(response);
}
