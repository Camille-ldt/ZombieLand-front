
import { NavLink } from 'react-router-dom';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuItems } from '@headlessui/react';
import { Bars3Icon,  XMarkIcon } from '@heroicons/react/24/outline';
import { RedLink } from './RedLink';

// Interface pour définir la structure d'un élément de navigation
// Interface to define the structure pf a navigation item
interface NavigationItem {
    name: string;
    to: string;
    current: boolean;
};

// Liste des éléments de navigation
// List of navigation items
const navigation: NavigationItem[] = [
    { name: 'Accueil', to: '/', current: true },
    { name: 'Nos activités', to: '/activities', current: false },
    { name: 'Réservation', to: '/bookings', current: false },
    { name: 'Informations utiles', to: '/informations-utiles', current: false },
];

// Fonction utilitaire pour concaténer les classes conditionnelles
// Utility function to concatenate conditional classes
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Composant Navbar
// Navbar component
const Navbar = () => {

    return (
        <Disclosure as="nav" className="bg-grey">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Conteneur principal de la barre de navigation */}
          {/* Main container for the navigation bar */}
          <div className="flex h-16 justify-between">

            {/* Section de gauche contenant le logo et les éléments */}
            {/* Left section containing the logo and navigations items */}
            <div className="flex">

              {/* Bouton de menu mobile, visible seulement sur petits écrans */}
              {/* Mobile menu button, visible only a small screens */}
              <div className="-ml-2 mr-2 flex items-center md:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {/* Icône du menu "hamburger" pour ouvrir le menu */}
                  {/* "Hanburger" menu icon to open the menu */}
                  <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                  {/* Icône "X" pour fermer le menu lorsque le menu est ouvert */}
                  {/* "X" icon to close the menu when it's open */}
                  <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>

              {/* Logo du site */}
              {/* Website logo */}
              <div className="flex flex-shrink-0 items-center">
                <img
                  alt="Logo"
                  src="src/assets/img/logo.png"
                  className="h-11 w-auto "
                />
              </div>

              {/* Menu navigation visible sur les écrans moyens et grands */}
              {/* Navigation menu visible on medium and large screens */}
              <div className="navigation hidden md:ml-6 md:flex md:items-center md:space-x-4">
                
                {navigation.map((item: NavigationItem) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'text-white' : 'text-white',
                      'rounded-md px-3 py-2 text-sm font-medium', 
                    )}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Section de droite contenant les boutons Réservation et Connexion */}
            {/* Right section containing the Reservation ang Login buttons */}
            <div className="flex items-center gap-3">
              {/* <div className="flex-shrink-0 "> */}

              {/* Bouton Réservation */}
              {/* Reservation button */}
                <RedLink to='/' textSize='text-sm'>Réservation</RedLink>

                {/* Bouton Connexion */}
                {/* Login button */}
                <RedLink to='/login' textSize='text-sm'>Connexion</RedLink>


              {/* Menu utilisateur pour les actions de connexion, affiché uniquement sur les écrans moyens et grands */}
              {/* User menu for login actions, displayed only on medium */}
              <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                
                <Menu as="div" className="relative ml-3">
                  
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                  {/* MenuItems est vide ici mais peut contenir des options de menu utilisateur  */}
                  {/* MenuItems is empty here but can contain user menu options */}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
        </div>
  
        {/* Menu mobile affiché dans un panneau repliable */}
        {/* Mobile menu displayed in a collapsible panel */}
        <DisclosurePanel className="md:hidden">
          <div className="navigation-mobile space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navigation.map((item) => (
              <NavLink to={item.to} key={item.name}>
                  <DisclosureButton
                    as="div"
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                  item.current ? 'text-white' : 'text-white hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
              </NavLink>
            ))}
          </div>

        </DisclosurePanel>
      </Disclosure>
    )
};

export default Navbar;