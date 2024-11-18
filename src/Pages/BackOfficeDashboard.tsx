import React, { useEffect, useState } from "react";
import { getDatas } from "../services/api";
import { useAuth } from "../Auth/authContext";
import Aside from "../components/Aside";
import { Title } from "../components/Title";

const BackOfficeDashboard: React.FC = () => {
  // Extract the user and loading state from the authentication context
  const { user, isLoading } = useAuth();

  // State to store statistical data such as rates and revenue
  const [stats, setStats] = useState<{
    dailyReservations: number;
    monthlyReservations: number;
    yearlyReservations: number;
    dailyTickets: number;
    monthlyTickets: number;
    yearlyTickets: number;
    dailyRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
  } | null>(null);

  // State to store error messages
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Asynchronous function to fetch statistics data
    const fetchStats = async () => {
      try {
        const statsData = await getDatas("/reservations/stats");
        setStats(statsData);
      } catch (error) {
        // Handle errors during data fetching
        setError("Error while loading statistics.");
        console.error(error);
      }
    };

    // Fetch statistics only if a user is authenticated
    if (user) fetchStats();
  }, [user]);

  // If the app is loading, display a loading message
  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;

  // Component to display a message for small screens
  const SmallScreenMessage = () => (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <p className="text-center text-xl font-semibold">
        This page is only available on desktop. Please use a larger screen to access the content.
      </p>
    </div>
  );

  return (
    <>
      {/* Affiche le message sur les petits écrans */}
			<div className="lg:hidden">
        <SmallScreenMessage />
      </div>

      {/* Affiche le contenu normal sur les écrans moyens et grands */}
      <div className="hidden lg:flex h-screen bg-gray-100">
        <Aside />
        <div className="flex-1 overflow-auto">
        <div className="flex bg-white min-h-screen">
     
      <div className="flex flex-col items-start p-8 w-full">
        <div className="mb-10">
          <Title>Dashboard</Title>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="overflow-x-auto w-full py-4 mt-8">
          <table className="table-auto w-full border-collapse border-separate border-spacing-2 border-slate-500 text-lg">
            <thead>
              <tr>
                <th className="px-6 py-4 bg-white-700 text-white rounded-md text-left">Taux / Catégorie</th>
                <th className="px-8 py-6 bg-black text-white rounded-md">Journée précédente</th>
                <th className="px-8 py-6 bg-black text-white rounded-md">Mois précédent</th>
                <th className="px-8 py-6 bg-black text-white rounded-md">Année actuelle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 bg-black text-white rounded-md text-left">Nombre de réservations</td>
                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">
                  {stats ? stats.dailyReservations : "N/A"}
                </td>
                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">
                  {stats ? stats.monthlyReservations : "N/A"}
                </td>
                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">
                  {stats ? stats.yearlyReservations : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 bg-black text-white rounded-md text-left">Nombre de tickets</td>
                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">
                  {stats ? stats.dailyTickets : "N/A"}
                </td>
                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">
                  {stats ? stats.monthlyTickets : "N/A"}
                </td>
                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">
                  {stats ? stats.yearlyTickets : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 bg-black text-white rounded-md text-left">Chiffre d'affaires (€)</td>
                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">
                  {stats ? stats.dailyRevenue.toFixed(2) : "N/A"}
                </td>
                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">
                  {stats ? stats.monthlyRevenue.toFixed(2) : "N/A"}
                </td>
                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">
                  {stats ? stats.yearlyRevenue.toFixed(2) : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
        </div>
      </div>
  </>
    
  );
};

export default BackOfficeDashboard;
