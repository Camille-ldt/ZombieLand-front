import axios, { AxiosResponse, AxiosError } from 'axios'; // Assure-toi d'importer AxiosError
import { User, Login, Register } from "../types";

const API_URL = "http://localhost:3000"; // URL de base

export const authService = {
  async login(data: Login): Promise<User> {
    try {
      // Utilisation de l'endpoint de connexion : /auth/login
      const response: AxiosResponse<User> = await axios.post(`${API_URL}/auth/login`, data);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Erreur lors de la connexion:", error.response?.data || error.message);
      } else {
        console.error("Erreur inconnue:", error);
      }
      throw new Error("Échec de la connexion");
    }
  },

  async register(data: Register): Promise<User> {
    try {
      // Utilisation de l'endpoint d'inscription : /users
      const response: AxiosResponse<User> = await axios.post(`${API_URL}/users`, data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Erreur lors de l'inscription - Response data:", error.response?.data || error.message);
      } else {
        console.error("Erreur inconnue:", error);
      }
      throw new Error("Échec de l'inscription");
    }
  },

  // Fonction pour se déconnecter
  logout() {
    localStorage.removeItem('user'); // Supprime l'élément qui a la clé 'user' dans le local storage
  },

  // Fonction pour récupérer le current user
  getCurrentUser(): User | null { 
    const userStr = localStorage.getItem('user'); // Récupère l'élément qui a la clé 'user' dans le local Storage
    if (userStr) return JSON.parse(userStr) as User; // Si userStr existe, on le parse de JSON en objet JS et on le retourne
    return null; // Si non, on retourne null
  },

  // Fonction pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user'); // Vérifie si l'item 'user' existe dans le localStorage et convertit le résultat en booléen
  },

  // Fonction pour mettre à jour le token si nécessaire
  updateToken(token: string) {
    const user = this.getCurrentUser();
    if (user) { // Si un utilisateur existe, met à jour son token avec la nouvelle valeur
      user.token = token;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
};

export default authService;
