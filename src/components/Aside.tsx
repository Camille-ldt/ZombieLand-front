import React from 'react';
import { Link } from 'react-router-dom';

const Aside: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <ul className="space-y-8 mt-8">
        <li>
          <Link
            to="/seebookings"
            className="transform transition-transform duration-400 hover:scale-110 inline-flex items-center rounded-md bg-red-primary px-3 py-2 font-semibold text-white shadow-sm hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 whitespace-nowrap"
          >
            Consulter les réservations
          </Link>
        </li>
        <li>
          <Link
            to="/seeactivities"
            className="transform transition-transform duration-400 hover:scale-110 inline-flex items-center rounded-md bg-red-primary px-3 py-2 font-semibold text-white shadow-sm hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 whitespace-nowrap"
          >
            Consulter les activités
          </Link>
        </li>
        <li>
          <Link
            to="/moderation"
            className="transform transition-transform duration-400 hover:scale-110 inline-flex items-center rounded-md bg-red-primary px-3 py-2 font-semibold text-white shadow-sm hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 whitespace-nowrap"
          >
            Modération
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Aside;