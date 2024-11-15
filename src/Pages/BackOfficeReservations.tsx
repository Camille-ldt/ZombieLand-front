import { useEffect, useState } from "react";
import { getDatas, createData, deleteData, updateData } from "../services/api";
import Aside from "../components/Aside";
import ReservationModal from "../components/ReservationModal";

interface Reservation {
	id: number;
	date_start: string;
	date_end: string;
	number_tickets: number;
	user_id: number;
	period_id: number;
}

interface User {
	id: number;
	firstname: string;
	lastname: string;
}

interface Period {
	id: number;
	name: string;
}

interface ReservationFormData {
	id?: number; // optionnel pour la création
	date_start: string; // format "yyyy-MM-dd"
	date_end: string; // format "yyyy-MM-dd"
	number_tickets: number;
	user_id: number;
	period_id: number;
}

const BackOfficeReservations: React.FC = () => {
	// Stocke la liste des réservations
	const [reservations, setReservations] = useState<Reservation[]>([]);
	// Stocke la liste des utilisateurs
	const [users, setUsers] = useState<User[]>([]);
	// Stocke la liste des périodes
	const [periods, setPeriods] = useState<Period[]>([]);
	// Garde une trace des IDs des réservations sélectionnées
	const [selectedReservations, setSelectedReservations] = useState<number[]>(
		[],
	);
	// Stocke le terme de recherche actuel
	const [searchTerm, setSearchTerm] = useState("");
	// Stocke la période sélectionnée pour le filtrage
	const [selectedPeriod, setSelectedPeriod] = useState("all");
	// Contrôle l'ouverture/fermeture du modal de réservation
	const [isModalOpen, setIsModalOpen] = useState(false);
	// Stocke la réservation en cours d'édition (null si création d'une nouvelle réservation)
	const [reservationToEdit, setReservationToEdit] =
		useState<Reservation | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			// Définition d'une fonction asynchrone pour récupérer les données
			try {
				// Utilisation de Promise.all pour effectuer plusieurs requêtes en parallèle
				const [reservationsData, usersData, periodsData] = await Promise.all([
					getDatas("/bookings"), // Récupération des réservations
					getDatas("/users"), // Récupération des utilisateurs
					getDatas("/periods"), // Récupération des périodes
				]);
				// Mise à jour des états avec les données récupérées
				setReservations(reservationsData);
				setUsers(usersData);
				setPeriods(periodsData);

				// Logs pour le débogage
				console.log("Utilisateurs récupérés:", usersData);
				console.log("Réservations récupérées:", reservationsData);
			} catch (error) {
				// Gestion des erreurs en cas d'échec de la récupération des données
				console.error("Erreur lors de la récupération des données", error);
			}
		};
		// Appel de la fonction fetchData
		fetchData();
		// Le tableau vide [] comme second argument signifie que cet effet
		// ne s'exécutera qu'une seule fois, au montage du composant
	}, []);

	const handleSelectionChange = (id: number) => {
		// Cette fonction gère la sélection ou la désélection d'une réservation
		setSelectedReservations((prev) =>
			// Si l'ID est déjà dans la liste des réservations sélectionnées
			prev.includes(id)
				? // Alors on le retire de la liste (désélection)
					prev.filter((reservationId) => reservationId !== id)
				: // Sinon, on l'ajoute à la liste (sélection)
					[...prev, id],
		);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Cette fonction gère le changement du terme de recherche
		setSearchTerm(e.target.value);
	};

	const filteredReservations = reservations.filter((reservation) => {
		// Chercher l'utilisateur et la période associés à la réservation
		const user = users.find((user) => user.id === reservation.user_id);
		const period = periods.find(
			(period) => period.id === reservation.period_id,
		);

		// Appliquer les filtres de période
		const matchesPeriodFilter =
			selectedPeriod === "all" ||
			reservation.period_id.toString() === selectedPeriod;

		// Vérification de la recherche dans le nom de l'utilisateur et le nom de la période
		const matchesSearchFilter =
			searchTerm === "" ||
			// Recherche dans le prénom et nom de l'utilisateur
			(user &&
				(user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.lastname.toLowerCase().includes(searchTerm.toLowerCase()))) ||
			// Recherche dans le nom de la période
			period?.name
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			// Recherche dans les dates
			reservation.date_start.includes(searchTerm) ||
			reservation.date_end.includes(searchTerm);

		return matchesPeriodFilter && matchesSearchFilter;
	});

	const handleCreateReservation = async (
		newReservation: ReservationFormData,
	) => {
		// Cette fonction gère la création d'une nouvelle réservation
		try {
			// Affiche les données de la nouvelle réservation dans la console (pour le débogage)
			console.log("Données envoyées au serveur :", newReservation);
			// Appel à l'API pour créer la nouvelle réservation
			const createdReservation = await createData("/bookings", newReservation);
			// Affiche la réservation créée dans la console (pour le débogage)
			console.log("Réservation créée :", createdReservation);
			// Met à jour l'état local des réservations en ajoutant la nouvelle réservation
			setReservations((prevReservations) => [
				...prevReservations,
				createdReservation,
			]);
			// Ferme le modal après la création réussie
			setIsModalOpen(false);
		} catch (error) {
			// Gère les erreurs qui peuvent survenir lors de la création
			console.error("Erreur lors de la création de la réservation:", error);
		}
	};

	const handleEditClick = () => {
		// Cette fonction gère le clic sur le bouton "Modifier"
		// Vérifie si une seule réservation est sélectionnée
		if (selectedReservations.length === 1) {
			// Recherche la réservation sélectionnée dans la liste des réservations
			const reservationToEdit = reservations.find(
				(reservation) => reservation.id === selectedReservations[0],
			);
			// Affiche la réservation sélectionnée dans la console (pour le débogage)
			console.log(
				"Reservation sélectionnée pour l'édition:",
				reservationToEdit,
			);
			// Si une réservation correspondante est trouvée
			if (reservationToEdit) {
				// Met à jour l'état avec la réservation à éditer
				setReservationToEdit(reservationToEdit);
				// Ouvre le modal d'édition
				setIsModalOpen(true);
			}
		}
	};

	const handleUpdateReservation = async (
		updatedReservation: ReservationFormData,
	) => {
		// Cette fonction gère la mise à jour d'une réservation existante
		try {
			// Vérifie si la réservation à mettre à jour a un ID
			if (updatedReservation.id) {
				// Appel à l'API pour mettre à jour la réservation
				const updatedReservationFromServer = await updateData(
					"/bookings",
					updatedReservation.id,
					updatedReservation,
				);
				// Met à jour l'état local des réservations
				setReservations((prevReservations) =>
					prevReservations.map((reservation) =>
						// Si l'ID correspond, remplace l'ancienne réservation par la nouvelle
						reservation.id === updatedReservationFromServer.id
							? updatedReservationFromServer
							: reservation,
					),
				);
				// Ferme le modal après la mise à jour réussie
				setIsModalOpen(false);
				// Réinitialise la réservation en cours d'édition
				setReservationToEdit(null);
				// Efface la sélection de réservations
				setSelectedReservations([]);
			}
		} catch (error) {
			// Gère les erreurs qui peuvent survenir lors de la mise à jour
			console.error("Erreur lors de la mise à jour de la réservation:", error);
		}
	};

	const handleDeleteSelectedReservations = async () => {
		// Vérifie si des réservations sont sélectionnées pour la suppression
		if (selectedReservations.length === 0) {
			alert("Veuillez sélectionner au moins une réservation à supprimer");
			return;
		}
		// Demande une confirmation à l'utilisateur avant de procéder à la suppression
		if (
			window.confirm(
				`Êtes-vous sûr de vouloir supprimer ${selectedReservations.length} réservation(s)?`,
			)
		) {
			try {
				// Supprime chaque réservation sélectionnée
				for (const reservationId of selectedReservations) {
					await deleteData("/bookings", reservationId);
				}
				// Met à jour l'état local en filtrant les réservations supprimées
				setReservations((prevReservations) =>
					prevReservations.filter(
						(reservation) => !selectedReservations.includes(reservation.id),
					),
				);
				// Réinitialise la liste des réservations sélectionnées
				setSelectedReservations([]);
				console.log("Réservations supprimées avec succès");
			} catch (error) {
				// Gère les erreurs qui peuvent survenir pendant la suppression
				console.error("Erreur lors de la suppression des réservations:", error);
			}
		}
	};
	console.log(reservationToEdit);

	return (
		<div className="flex h-screen bg-gray-100">
			<Aside />
			<div className="flex-1 overflow-auto">
				<div className="container mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">
						Administration des Réservations
					</h1>
					<div className="mb-4 flex space-x-4">
						<input
							type="text"
							placeholder="Rechercher une réservation..."
							className="px-4 py-2 border rounded-md flex-grow focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							value={searchTerm}
							onChange={handleSearchChange}
						/>
						<select
							className="px-4 py-2 border rounded-md w-1/5 focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							value={selectedPeriod}
							onChange={(e) => setSelectedPeriod(e.target.value)}
						>
							<option value="all">Toutes les périodes</option>
							{periods.map((period) => (
								<option key={period.id} value={period.id.toString()}>
									{period.name}
								</option>
							))}
						</select>
					</div>
					<div className="mb-4 flex space-x-4 justify-end ">
						<button
							type="button"
							className="bg-grey text-white rounded p-2 hover:bg-gray-700"
							onClick={() => {
								setIsModalOpen(true);
								setReservationToEdit(null); // Reset pour nouvelle réservation
							}}
						>
							Créer
						</button>
						<button
							type="button"
							className="bg-grey text-white rounded p-2 hover:bg-gray-700"
							onClick={handleEditClick}
							disabled={selectedReservations.length !== 1}
						>
							Modifier
						</button>
						<button
							type="button"
							className="bg-grey text-white rounded p-2 hover:bg-gray-700"
							onClick={handleDeleteSelectedReservations}
							disabled={selectedReservations.length === 0}
						>
							Supprimer
						</button>
					</div>
					<ReservationModal
						isOpen={isModalOpen}
						onClose={() => {
							setIsModalOpen(false);
							setReservationToEdit(null);
						}}
						onSubmit={
							reservationToEdit
								? handleUpdateReservation
								: handleCreateReservation
						}
						periods={periods}
						users={users}
						reservation={reservationToEdit}
						reservations={reservations}
					/>
					<div className="bg-white shadow-md rounded-lg overflow-hidden">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-grey">
								<tr>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										ID
									</th>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										Date de début
									</th>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										Date de fin
									</th>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										Nombre de tickets
									</th>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										Utilisateur
									</th>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										Période
									</th>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										Sélection
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredReservations.map((reservation) => {
									const user = users.find(
										(user) => user.id === reservation.user_id,
									);
									const period = periods.find(
										(period) => period.id === reservation.period_id,
									);
									return (
										<tr key={reservation.id}>
											<td className="text-center">{reservation.id}</td>
											<td className="text-center">
												{new Date(reservation.date_start).toLocaleDateString()}
											</td>
											<td className="text-center">
												{new Date(reservation.date_end).toLocaleDateString()}
											</td>
											<td className="text-center">
												{reservation.number_tickets}
											</td>
											<td className="text-center">
												{user?.firstname} {user?.lastname}
											</td>
											<td className="text-center">{period?.name}</td>
											<td className="text-center px-6 py-4 whitespace-nowrap">
												<input
													type="checkbox"
													checked={selectedReservations.includes(
														reservation.id,
													)}
													onChange={() => handleSelectionChange(reservation.id)}
													className="h-4 w-4 text-red-primary focus:ring-red-secondary border-gray-300 rounded"
												/>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BackOfficeReservations;
