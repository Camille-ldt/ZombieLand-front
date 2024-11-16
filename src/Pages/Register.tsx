import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/authContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyImage from '../assets/img/zombie-accueil.webp';

const Register = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, login } = useAuth();

  const validatePassword = (value) => {
    setPasswordCriteria({
      length: value.length >= 6,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[@$!%*?&]/.test(value),
    });
    setPassword(value);
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();

    if (Object.values(passwordCriteria).some((criterion) => !criterion)) {
      toast.error('Votre mot de passe ne respecte pas les critères.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas !');
      return;
    }

    setIsLoading(true);
    try {
      await register({ firstname, lastname, email, password });
      toast.success("Inscription réussie ! Redirection vers la page d'accueil...");
      await login({ email, password });

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast.error("Échec de l'inscription. Veuillez réessayer.");
      console.error("Erreur d'inscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full">
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">Inscrivez-vous</h2>
              <p className="mt-2 text-sm text-gray-500">
                Vous avez déjà un compte ?{' '}
                <a href="/login" className="font-semibold text-red-primary hover:text-red-secondary">
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
                    onChange={(e) => validatePassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm"
                  />
                  <ul className="mt-2 text-sm space-y-1">
                    <li className={passwordCriteria.length ? 'text-green-500' : 'text-red-500'}>
                      {passwordCriteria.length ? '✔️' : '❌'} Au moins 6 caractères
                    </li>
                    <li className={passwordCriteria.uppercase ? 'text-green-500' : 'text-red-500'}>
                      {passwordCriteria.uppercase ? '✔️' : '❌'} Une lettre majuscule
                    </li>
                    <li className={passwordCriteria.lowercase ? 'text-green-500' : 'text-red-500'}>
                      {passwordCriteria.lowercase ? '✔️' : '❌'} Une lettre minuscule
                    </li>
                    <li className={passwordCriteria.number ? 'text-green-500' : 'text-red-500'}>
                      {passwordCriteria.number ? '✔️' : '❌'} Un chiffre
                    </li>
                    <li className={passwordCriteria.specialChar ? 'text-green-500' : 'text-red-500'}>
                      {passwordCriteria.specialChar ? '✔️' : '❌'} Un caractère spécial (@$!%*?&)
                    </li>
                  </ul>
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
          </div>
        </div>
        <div className="relative flex-1 hidden lg:block">
          <img
            alt=""
            src={MyImage}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default Register;
