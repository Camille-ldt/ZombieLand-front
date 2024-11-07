// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/', // URL de base de l'API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction GET : Récupérer une liste de ressources
export const getDatas = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('GET error:', error);
    throw error;
  }
};

// Fonction GET par ID : Récupérer un seul élément
export const getDataById = async (endpoint: string, id: number | string) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error('GET by ID error:', error);
    throw error;
  }
};

// Fonction POST : Créer une nouvelle ressource
export const createData = async (endpoint: string, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('POST error:', error);
    throw error;
  }
};

// Fonction PUT : Mettre à jour une ressource
export const updateData = async (endpoint: string, id: number | string, data) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('PUT error:', error);
    throw error;
  }
};

// Fonction DELETE : Supprimer une ressource
export const deleteData = async (endpoint: string, id: number | string) => {
  try {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error('DELETE error:', error);
    throw error;
  }
};

export default api;