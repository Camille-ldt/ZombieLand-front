import axios from 'axios';
import {User, Login, Register} from "../types";

const API_URL= "http://localhost:3000/"; // Notes à nous-même : En attente des routes d'auth pour mettre à la suite du /
// Fonction pour se connecter
export const authService = {
    async login(data: Login) : Promise<User> { // Prend en paramètre data en type login, permets de retourner un objet de type user
        try {
            const response = await axios.post(`${API_URL}`, data); // Utilise axios pour utiliser un url post à l'endpoint de l'api, et data correspond aux infos de connexion qui se trouve dans la requête
            if(response.data.token){ // Vérifie la condition que la réponse contient un token.
            localStorage.setItem('user', JSON.stringify(response.data)) // S'il ya un token, les données utilisateurs sont stockés dans le localstorage, mais avant on les met dans le JSON
            }
            return response.data // La fonction retourne les données de l'utilisateur. Il doit contenir les infos utilisateurs et token
    
        } catch (error){
            console.error("Erreur lors de la connexion:", error);
        throw new Error("Échec de la connexion");
        }
    },
        

    // Fonction pour s'inscrire
    async register(data: Register): Promise<User> { //Fonction Resgister qui prend en paramètre date de type Register et qui promet de retourner un objet de type User
        try {
            const response = await axios.post(`${API_URL}`, data); // Fait une requête post à l'API via axios à l'endpoint de l'api. Data correspond aux informations de connexion dans la requete
            return response.data; // retourne les données de l'utilisateur
        } catch (error) {
            throw new Error("Echec de l'inscription");// gère les erreurs pendant la requête ou le traitement de la réponse
        }
    },

    // Fonction pour se déconnecter
    logout() {
        localStorage.removeItem('user'); // supprime l'élément qui a la clé 'user' dans le local storage
    },

    //Fonction pour récupérer le current user
    getCurrentUser(): User | null { // Fonction qui retourne soit un objet User, soit rien
        const userStr = localStorage.getItem('user'); // Récupère l'élémént qui a la clé 'user' dans le local Storage
        if (userStr) return JSON.parse(userStr); // Si userStr existe, on le parse de JSON en objet JS et on le retourne.
        return null //si non on retourne null
    },

    // Fonction pour vérifier si l'utilisateur est connecté
    isLoggedIn(): boolean {
        return !!localStorage.getItem('user'); // Vérifie si l'item 'user' existe dans le localStorage et convertit le résultat en booléan
    },

    // Fonction pour mettre à jour le token si nécessaire
    updateToken(token:string) { // Fonction qui appelle la méthode getCurrentUser() pour obtenir les données de l'utilisateur actuel
        const user = this.getCurrentUser();
        if (user) { // Si un utilisateur existe, met à jour son token avec la nouvelle valeur
            user.token = token;
            localStorage.setItem('user', JSON. stringify(user));
        }
    }
};

export default authService;
