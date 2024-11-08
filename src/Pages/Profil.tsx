import { UserCircleIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react';
import { getDataById, createData, updateData } from '../services/api';
import { useParams } from 'react-router-dom';
import { Title } from '../components/Title';

interface UserProps {
    firstname: string;
    lastname: string;
    phone_number: string;
    email: string;
    password: string;
    street_address: string;
    postal_code: string;
    city: string;
    birthday: Date | null;
    image: string;
}

const Profil = () => {

  const [user, setUser] = useState<UserProps>({
    firstname: '',
    lastname: '',
    phone_number: '',
    email: '',
    password: '',
    street_address: '',
    postal_code: '',
    city: '',
    birthday: null,
    image: ''
  });

  const {userId} = useParams();

  useEffect(() => {
      
      const fetchOneUser = async () => {
          try {
            console.log("userId:", userId);
              if (userId) {
                  const dataUser = await getDataById("/users", userId);
                  console.log("Données utilisateur:", dataUser);
                  setUser({
                    ...dataUser,
                    birthday: dataUser.birthday ? new Date(dataUser.birthday) : null
                  });
              }
          } catch (error) {
              console.error("Erreur lors de la récupération des données d'un utilisateur", error);
          }
      };
      fetchOneUser();
  }, [userId]);

  console.log(user)
  const updateImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    // On récupère le fichier que l'utilisateur vient de renseigner dans l'input
    const file = evt.target.files[0]; // File

    // On convertit le fichier en data-url
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setUser({
        ...user,
        image: reader.result
      });
    });
    reader.readAsDataURL(file);
  };

  const handleSubmit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();

    if (user.id) {
      updateData(`/users`, user.id, user);
    }
    else {
      createData(`/users`, user);
    }
  };

  // Fonction générique pour gérer les changements d'input
  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 pt-10 gap-x-8 gap-y-8 m-6">

        <div className='md:col-start-1 md:col-end-2'>
            <section className=''>
                <h2 className='text-2xl'>Réservations actuelles :</h2>
                <div>
                    <img src="" alt="" />
                    <Title>Nom de la réservation</Title>
                </div>
            </section>
        </div>
        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-start-2 md:col-end-3" onSubmit={handleSubmit}>
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
                <label htmlFor="photo" className="block font-medium text-gray-900 text-sm/6">
                  Photo
                </label>
                <div className="flex items-center mt-2 gap-x-3">
                  {user.image === null ? (
                    <UserCircleIcon aria-hidden="true" className="w-12 h-12 text-gray-300" />
                  ) : (
                    <img
                      alt=""
                      src={user.image}
                      className="inline-block h-12 w-12 rounded-md"
                    />
                  )}
                  <label htmlFor="file-upload" className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Change
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onInput={updateImage} />
                  </label>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="lastname" className="block font-medium text-gray-900 text-sm/6">
                  Nom
                </label>
                <div className="mt-2">
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={user.lastname}
                    onChange={handleInputChange}
                    placeholder={user ? user.lastname : ""}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="firstname" className="block font-medium text-gray-900 text-sm/6">
                  Prénom
                </label>
                <div className="mt-2">
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={user.firstname}
                    onChange={handleInputChange}
                    placeholder={user ? user.firstname : ""}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="birthday" className="block font-medium text-gray-900 text-sm/6">
                  Date de naissance
                </label>
                <div className="mt-2">
                  <input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={user.birthday ? new Date(user.birthday).toISOString().split("T")[0] : ''}
                    onChange={handleInputChange}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="street_address" className="block font-medium text-gray-900 text-sm/6">
                  Adresse
                </label>
                <div className="mt-2">
                  <input
                    id="street_address"
                    name="street_address"
                    type="text"
                    placeholder={user.street_address ? user.street_address : ""}
                    value={user.street_address ? user.street_address : ""}
                    onChange={handleInputChange}
                    autoComplete="street-address"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block font-medium text-gray-900 text-sm/6">
                  City
                </label>
                <div className="mt-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder={user.city ? user.city : ""}
                    value={user.city ? user.city : ""}
                    onChange={handleInputChange}
                    autoComplete="address-level2"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="postal_code" className="block font-medium text-gray-900 text-sm/6">
                  ZIP / Postal code
                </label>
                <div className="mt-2">
                  <input
                    id="postal_code"
                    name="postal_code"
                    type="text"
                    placeholder={user.postal_code ? user.postal_code : ""}
                    value={user.postal_code ? user.postal_code : ""}
                    onChange={handleInputChange}
                    autoComplete="postal-code"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="email" className="block font-medium text-gray-900 text-sm/6">
                  Contact
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={user ? user.email : ""}
                    value={user ? user.email : ""}
                    onChange={handleInputChange}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="phone_number" className="block font-medium text-gray-900 text-sm/6">
                  Téléphone
                </label>
                <div className="mt-2">
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="text"
                    placeholder={user ? user.phone_number : ""}
                    value={user ? user.phone_number : ""}
                    onChange={handleInputChange}
                    autoComplete="tel"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-primary sm:text-sm/6"
                  />
                </div>
              </div>

            </div>
          </div>
          <div className="flex items-center justify-end px-4 py-4 border-t gap-x-6 border-gray-900/10 sm:px-8">
            <button type="button" className="font-semibold text-gray-900 text-sm/6">
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-red-primary hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-secondary"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default Profil;


