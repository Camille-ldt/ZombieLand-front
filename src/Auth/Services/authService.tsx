// src/services/authService.ts

import axios, { AxiosResponse, AxiosError } from 'axios';
import { User, Login, Register } from "../types";

const API_URL = "http://localhost:3000"; // URL de base

export const authService = {
  // Correction de la syntaxe des méthodes

  login: async (data: Login): Promise<User> => {
    try {
      // Obtenir le token
      const response: AxiosResponse<{ token: string }> = await axios.post(`${API_URL}/auth/login`, data);
      const token = response.data.token;

      if (token) {
        // Stocker le token
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Récupérer les informations de l'utilisateur
        const userResponse: AxiosResponse<User> = await axios.get(`${API_URL}/users/me`);
        const userData = userResponse.data;

        // Combiner le token et les données utilisateur
        const loggedInUser = { ...userData, token };

        // Stocker l'utilisateur complet dans le localStorage
        localStorage.setItem('user', JSON.stringify(loggedInUser));

        return loggedInUser;
      } else {
        throw new Error("Token non reçu");
      }
    } catch (error: unknown) {
      // Gestion des erreurs
      console.error("Erreur lors de la connexion:", error);
      throw new Error("Échec de la connexion");
    }
  },

  register: async (data: Register): Promise<User> => {
    try {
      // Appel à l'endpoint d'inscription
      const response: AxiosResponse<User> = await axios.post(`${API_URL}/users`, data); // Ajustez l'URL si nécessaire
      const registeredUser = response.data;

      if (registeredUser) {
        // Stocker l'utilisateur
        localStorage.setItem('user', JSON.stringify(registeredUser));
      }

      return registeredUser;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Erreur lors de l'inscription - Response data:", error.response?.data || error.message);
      } else {
        console.error("Erreur inconnue:", error);
      }
      throw new Error("Échec de l'inscription");
    }
  },

  // Autres méthodes (logout, getCurrentUser, etc.)
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr) as User;
    return null;
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('user');
  },

  updateToken: (token: string) => {
    const user = authService.getCurrentUser();
    if (user) {
      user.token = token;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
};

export default authService;
