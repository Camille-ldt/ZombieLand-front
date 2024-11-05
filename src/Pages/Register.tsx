import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/authContext';
import { authService } from '../Auth/Services/authService';
import MyImage from '../assets/img/zombie-accueil.webp';



const Register = () => { // Etat pour stocker les éléments email, password avec une fonction pour le màj
    const [firstname, setFirstname] = useState ('');
    const [lastname, setLastname] = useState ('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState ('');
  const [confirmPassword, setConfirmPassword] = useState ('');
  const navigate = useNavigate();
  const [error, setError] = useState ('');
  const [isLoading, setIsLoading]= useState(false);
  const { register } = useAuth();

  
  // Fonction qui gère la soumission du formulaire
  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire
    if(password !== confirmPassword){ 
        setError('Les mots de passe ne correspondent pas !') // Si les mdp ne correspondent pas, màj l'état d'erreur avec un message et arrête l'exécution de la fonction
        return;
    }
    
    // Si les mdp correspondent, tente l'inscription
    try {
        await authService.register({firstname, lastname, email, password, confirmPassword}) // Appelle la méthode register du service d'authentification avec les données du formulaire
        navigate('/');
    } catch (error) {
        setError("Échec de l'inscription. Veuillez réessayer."); // Si une erreur se produit pendant l'inscription
      console.error("Erreur d'inscription:", error);  
    }
  };
  
  return (
    <>
      <div className="flex min-h-full">
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">Inscrivez-vous sur notre site</h2>
              <p className="mt-2 text-sm text-gray-500">
                Vous avez déjà un compte ?{' '}
                <a href="/bookings" className="font-semibold text-red-primary hover:text-red-secondary">
                  Connectez-vous
                </a>
              </p>
            </div>

            <div className="mt-10">
              <form onSubmit={handleSubmitRegister} className="space-y-6">
                <div>
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-900">Prénom</label>
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    required
                    autoComplete="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-900">Nom</label>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    autoComplete="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">Mot de passe</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-900">Confirmation de mot de passe</label>
                  <input
                    id="confirmpassword"
                    name="confirmpassword"
                    type="password"
                    required
                    autoComplete="confirmpassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-red-primary focus:ring-red-primary"
                    />
                    <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700">Se souvenir de moi</label>
                  </div>

                  
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md bg-red-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary"
                  >
                    {isLoading ? 'Inscription...' : `S'inscrire`}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-10">
              <div className="relative">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium">
                  <span className="bg-white px-6 text-gray-900">Ou continuer avec</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                    {/* SVG pour Google */}
                  </svg>
                  <span className="text-sm font-semibold">Google</span>
                </a>

                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-[#24292F]">
                    {/* SVG pour GitHub */}
                  </svg>
                  <span className="text-sm font-semibold">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex-1 hidden lg:block">
          <img
            alt=""
            src={MyImage} // Assurez-vous que MyImage est bien importé
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default Register;