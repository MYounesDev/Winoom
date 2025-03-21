// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Generic fetch function for all components
export const fetchData = async (endpoint: string, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Post data to the server
export const postData = async (endpoint: string, data = {}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
};

// Specific API calls for different components
export const getClasses = async (userRole: string) => {
  return postData('getClasses', { userRole });
};

export const getStudentClass = async (userRole: string) => {
  return postData('getStudentClass', { userRole });
};

export const getHomework = async () => {
  return fetchData('homework');
};

export const getLessons = async () => {
  return fetchData('lessons');
};

export const getBooks = async () => {
  return fetchData('books');
};

export const getCalendar = async () => {
  return fetchData('calendar');
};

export const getStudents = async () => {
  return fetchData('students');
};

export const getNotes = async () => {
  return fetchData('notes');
};

export const getReports = async () => {
  return fetchData('reports');
};