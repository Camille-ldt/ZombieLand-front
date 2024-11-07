import React, { useEffect, useState } from "react";
import { getDatas } from "../services/api";
import { useAuth } from "../Auth/authContext";
import Aside from "../components/Aside";
import { Title } from "../components/Title";

interface Dashboard {
	reservation: number;
	users: number;
	revenue: number;
	partnerReservations: number;
	dailyRate: number;
	dailyGrowth: number;
	monthlyRate: number;
	monthlyGrowth: number;
	yearlyRate: number;
	yearlyGrowth: number;
}

const BackOfficeDashboard: React.FC = () => {
	const { user, isLoading } = useAuth();
	const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
	const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getDatas("/dashboard");
				setDashboardData(data);
			} catch (error) {
				setError("Erreur lors du chargement des données.");
			}
		};

		if (user) fetchData();
	}, [user]);

	if (isLoading)
		return <p className="text-center text-gray-500">Chargement...</p>;
	// !! Ne surtout pas effacer ce code, c'est le code qui demande à un administrateur de se connecter avant de se rendre sur la page !!
	// if (!user) return <p className="text-center text-red-500">Veuillez vous connecter pour accéder au tableau de bord.</p>;
	// !! Don't touch my tralalala code !
     
    // Fonction pour gérer le changement dans le champ de recherche
     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        console.log("Valeur de recherche:", e.target.value);
    };

    // Fonction pour gérer le changement dans le filtre de catégorie
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        console.log("Catégorie sélectionnée:", e.target.value);
    };

    // Filtrage des données basées sur la recherche et la catégorie
    const filteredData = () => {
        if (!dashboardData) return null;

        // Filtrer les données en fonction de `selectedCategory`et `searchTerm`
        let data = { ...dashboardData };

        // Exemple de filtrage
        if (selectedCategory !== "all") {
            // Filtrage par catégorie
            data = {
                ...data,
                // Ajoute
            }
        }
        return data;
    };

    const displayedData = filteredData();

    return (
        <div className="flex bg-white min-h-screen">
            {/* Sidebar */}
            <Aside />

            {/* Main Content */}
            <div className="flex flex-col items-start p-8 w-full">
                <div className="mb-10">
                    <Title>Dashboard</Title>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Barre de recherche et filtre de catégorie */}
                <div className="mb-6 flex space-x-4 w-full">
                    <input
                        type="text"
                        placeholder="Rechercher une période..."
                        className="px-4 py-2 border rounded-md flex-grow"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <select
                        className="px-4 py-2 border rounded-md w-1/5"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="all">Toutes les années</option>
                        {/* Ajoute ici des catégories spécifiques si tu en as */}
                        <option value="reservations">2024</option>
                        <option value="users">2023</option>
                        <option value="revenue">2022</option>
                        <option value="partnerReservations">2021</option>
                    </select>
                </div>

                {/* Tableau */}
                <div className="overflow-x-auto w-full py-4">
                    <table className="table-auto w-full border-collapse border-separate border-spacing-2 border-slate-500 text-lg">
                        <thead>
                            <tr>
                                <th className="px-6 py-4 bg-white-700 text-white rounded-md text-left">Taux / Catégorie</th>
                                <th className="px-8 py-6 bg-black text-white rounded-md">Taux à la journée N-1</th>
                                <th className="px-8 py-6 bg-black text-white rounded-md">Taux au mois N-1</th>
                                <th className="px-8 py-6 bg-black text-white rounded-md">Taux à l'année N-1</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-6 py-4 bg-black text-white rounded-md text-left">Nombre de réservations</td>
                                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">{displayedData?.dailyRate ?? "N/A"}</td>
                                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">{displayedData?.monthlyRate ?? "N/A"}</td>
                                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">{displayedData?.yearlyRate ?? "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 bg-black text-white rounded-md text-left">Nombre d'utilisateurs inscrits</td>
                                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">{displayedData?.dailyGrowth ?? "N/A"}%</td>
                                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">{displayedData?.monthlyGrowth ?? "N/A"}%</td>
                                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">{displayedData?.yearlyGrowth ?? "N/A"}%</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 bg-black text-white rounded-md text-left">Chiffre d'affaires</td>
                                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">{displayedData?.revenue ?? "N/A"}</td>
                                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">{displayedData?.revenue ?? "N/A"}</td>
                                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">{displayedData?.revenue ?? "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 bg-black text-white rounded-md text-left">Nombre de réservations partenaires</td>
                                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">{displayedData?.partnerReservations ?? "N/A"}</td>
                                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">{displayedData?.partnerReservations ?? "N/A"}</td>
                                <td className="px-8 py-6 bg-gray-500 text-white text-center rounded-md">{displayedData?.partnerReservations ?? "N/A"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default BackOfficeDashboard;
