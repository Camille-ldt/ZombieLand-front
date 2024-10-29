import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuItems } from '@headlessui/react';
import { Bars3Icon,  XMarkIcon } from '@heroicons/react/24/outline';

interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
};

const navigation: NavigationItem[] = [
    { name: 'Accueil', href: '#', current: true },
    { name: 'Nos activités', href: '#', current: false },
    { name: 'Réservation', href: '#', current: false },
    { name: 'À propos', href: '#', current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
const Navbar = () => {

    return (
        <Disclosure as="nav" className="bg-grey">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="-ml-2 mr-2 flex items-center md:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>
              <div className="flex flex-shrink-0 items-center">
                <img
                  alt="Logo"
                  src="src/assets/img/logo.png"
                  className="h-11 w-auto "
                />
              </div>
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                
                {navigation.map((item: NavigationItem) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'text-white' : 'text-white hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* <div className="flex-shrink-0 "> */}
                <button
                  type="button"
                  className="relative inline-flex items-center rounded-md bg-red-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Réservation
                </button>

                <button
                  type="button"
                  className="relative inline-flex items-center rounded-md bg-red-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Connexion
                </button>
              {/* </div> */}
              <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                
                <Menu as="div" className="relative ml-3">
                  
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                  
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
        </div>
  
        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'text-white' : 'text-white hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>

        </DisclosurePanel>
      </Disclosure>
    )
};

export default Navbar;