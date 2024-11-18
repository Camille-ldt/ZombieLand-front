import React, { useEffect, useState } from "react";
import { getDatas } from "../services/api";
import { useAuth } from "../Auth/authContext";
import Aside from "../components/Aside";
import { Title } from "../components/Title";

const BackOfficeDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<{
    dailyRate: number;
    monthlyRate: number;
    yearlyRate: number;
    dailyRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await getDatas("/reservations/stats"); // Correction de l'URL
        setStats(statsData);
      } catch (error) {
        setError("Erreur lors du chargement des statistiques.");
        console.error(error);
      }
    };

    if (user) fetchStats();
  }, [user]);

  if (isLoading) return <p className="text-center text-gray-500">Chargement...</p>;

  return (
    <div className="flex bg-white min-h-screen">
      <Aside />
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
                  {stats ? stats.dailyRate : "N/A"}
                </td>
                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">
                  {stats ? stats.monthlyRate : "N/A"}
                </td>
                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">
                  {stats ? stats.yearlyRate : "N/A"}
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
  );
};

export default BackOfficeDashboard;
