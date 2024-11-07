// Importation des hooks et types
import { useContext, useState, useEffect, createContext, ReactNode } from "react";
import {User, Login, Register} from './types';
import {authService} from './Services/authService';

// Interface pour le contexte d'authentification
interface AuthContextType {
    user: User | null, // Utilisateur ou null
    login: (data :Login) => Promise<void>, // Se connecter
    register: (data: Register) => Promise<void>;
    logout: ()=>void, // Se déconnecter

    isLoading: boolean // Etat de chargement
}

// Création du contexte d'authentification 
const AuthContext = createContext<AuthContextType | undefined>(undefined); // Avec le type défini précédemment il est initialisé à undefined

// Définition des props
interface AuthProviderProps {
    children: ReactNode; // Les composants enfants qui seront de type ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (data: Login) => {
    const loggedInUser = await authService.login(data);
    setUser(loggedInUser);
  };

  // Appel le service de déconnexion qui réinitialise les tables de l'utilisateur, remet à null
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  //Appel le service d'auth pour l'inscription
  const register = async (data: Register) => {
    const registeredUser = await authService.register(data);
    setUser(registeredUser);
  };


  // Contient toute les valeurs et fonctions fournies par le contexte
  const value ={
    user,
    login,
    logout,
    register,
    isLoading
  };

  // Retourne les enfants et les valeurs en fonction du contexte
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour accéder facilement au contexte d'authentification. Elle vérifie si le contexte est ok ou lance une erreur.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};