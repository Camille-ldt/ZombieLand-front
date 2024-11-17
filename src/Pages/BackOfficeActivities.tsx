//Importation des éléments necessaires
import { useCallback, useEffect, useState } from "react";
import { getDatas, createData, updateData, deleteData } from "../services/api";
import Aside from "../components/Aside";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import ActivitiesModal from "../components/ActivitiesModal";

interface ActiProps {
	id: number;
	multimedias?: { url: string }[];
	title: string;
	description: string;
	category_id: number;
}
//Interface pour les catégories
interface Category {
	id: number;
	name: string;
}
//Interface poyr les informations émises par le formulaire de création/modification des activités
interface ActivityFormData {
	id?: number;
	title: string;
	description: string;
	category_id: number;
}

interface Activity {
	id: number;
	title: string;
	description: string;
	image: string;
	category: number;
}

const BackOfficeActivities: React.FC = () => {
	//Definition des variables d'etat necessaires pour le backoffice des activités
	//Définit la liste des activités disponibles et retourne un tableau d'objet de type Activity qui est au départ vide puis se remplit avec les données de l'API
	const [activities, setActivities] = useState<Activity[]>([]);
	//Idem que activities
	const [categories, setCategories] = useState<Category[]>([]);
	// Contient l'id des activités sélectionnées et retourne un tableau de nombres (commence avec un tableau vide)
	const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
	//Stocke le terme recherché par l'utilisateur, est de type chaine de caractère et est vide par défaut
	const [searchTerm, setSearchTerm] = useState("");
	//Contient la catégorie sélectionnée pour filtrer les catégories, c'est une chaine de caractère et sa valeur initiale est "all" pour afficher toutes les caté par défaut
	const [selectedCategory, setSelectedCategory] = useState("all");
	//Permet de gérer l'état d'ouverture de la Modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	//Permet de modifier éléments pendant des temps de chargement (ex : texte d'un bouton)
	const [isLoading, setIsLoading] = useState(false);
	//Stocke l'activité selectionnée pour modification, il renvoit soit l'activité soit null
	const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
	//Permet de gérer l'état d'ouverture de la modal de modification
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	// Définition d'une fonction asynchrone pour récupérer les données
	const fetchData = useCallback(async () => {
		try {
			// Utilisation de Promise.all pour effectuer plusieurs requêtes en parallèle
			const [activitiesData, categoriesData] = await Promise.all([
				getDatas("/activities"),
				getDatas("/categories"),
			]);

			const activitiesDatas: Activity[] = activitiesData.map(
				(activity: ActiProps) => {
					return {
						id: activity.id,
						image: activity.multimedias?.[0]?.url || "", // Extracting the first multimedia URL if available
						title: activity.title,
						description: activity.description,
						category: activity.category_id,
					};
				},
			);

			setActivities(activitiesDatas);
			setCategories(categoriesData);
		} catch (error) {
			// Gestion des erreurs en cas d'échec de la récupération des données
			console.error("Erreur lors de la récupération des données", error);
		}
	}, []);

	useEffect(() => {
		// Appel de la fonction fetchData
		fetchData();
		// Le tableau vide [] comme second argument signifie que cet effet
		// ne s'exécutera qu'une seule fois, au montage du composant
	}, [fetchData]);

	console.table(activities);
	const handleSelectionChange = (id: number) => {
		// Met à jour l'état des activités sélectionnées
		setSelectedActivities((prev) =>
			// Si l'ID est déjà dans la liste des activités sélectionnées alors on le retire de la liste (désélection) sinon, on l'ajoute à la liste (sélection)
			prev.includes(id)
				? prev.filter((activityId) => activityId !== id)
				: [...prev, id],
		);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Met à jour le terme de recherche lorsque l'utilisateur tape dans le champ de recherche
		setSearchTerm(e.target.value);
	};

	const filteredActivities = activities.filter(
		(activity) =>
			// Vérifie deux conditions pour chaque activité

			// Condition 1 : Filtre par catégorie
			// Si "all" est sélectionné, toutes les catégories sont incluses
			// Sinon, vérifie si la catégorie de l'activité correspond à la catégorie sélectionnée
			(selectedCategory === "all" ||
				activity.category.toString() === selectedCategory) &&
			// Condition 2 : Filtre par terme de recherche
			// Vérifie si le titre de l'activité (en minuscules) inclut le terme de recherche (en minuscules)
			activity.title
				.toLowerCase()
				.includes(searchTerm.toLowerCase()),
	);

	if (activities.length === 0) {
		// Si le tableau d'objet des activités est vide alors on affiche le texte "Aucune activité disponible pour le moment"
		return (
			<p className="text-center text-white">
				Aucune activité disponible pour le moment.
			</p>
		);
	}

	const handleCreateActivity = async (newActivity: ActivityFormData) => {
		// Gère la création d'une nouvelle activité
		try {
			// Log pour indiquer que la fonction a été déclenchée
			console.log("handleCreateActivity déclenché");
			// Affiche les données de la nouvelle activité avant l'envoi au serveur
			console.log("Données envoyées au serveur:", newActivity);
			// Appel à l'API pour créer la nouvelle activité
			const createdActivity = await createData("/activities", newActivity);
			console.log("Activité créée:", createdActivity); // Pour le débogage
			// Met à jour l'état local en ajoutant la nouvelle activité à la liste existante
			setActivities((prevActivities) => [...prevActivities, createdActivity]);
			// Ferme le modal après la création réussie
			setIsModalOpen(false);
		} catch (error) {
			// En cas d'erreur lors de la création, affiche l'erreur dans la console
			console.error("Erreur lors de la création de l'activité:", error);
		}
	};

	const handleEditClick = () => {
		// Gère le clic sur le bouton "Modifier"
		// Vérifie si une seule activité est sélectionnée
		if (selectedActivities.length === 1) {
			// Recherche l'activité sélectionnée dans la liste des activités
			const activityToEdit = activities.find(
				(activity) => activity.id === selectedActivities[0],
			);
			// Si l'activité est trouvée
			if (activityToEdit) {
				console.log(
					"Activité à éditer avant la mise à jour de l'état :",
					activityToEdit,
				);
				// Met à jour l'état avec l'activité à éditer
				setActivityToEdit(activityToEdit);
				// Ouvre le modal d'édition
				setIsEditModalOpen(true);
			}
		}
	};

	const handleUpdateActivity = async (updatedActivity: ActivityFormData) => {
		// Gère la mise à jour d'une activité existante
		try {
			// Vérifie si l'activité à mettre à jour a un ID valide
			if ("id" in updatedActivity && typeof updatedActivity.id === "number") {
				// Vérifiez si `category_id` est défini
				if (
					updatedActivity.category_id === undefined ||
					updatedActivity.category_id === null
				) {
					console.error(
						"category_id est manquant dans les données de mise à jour.",
					);
					return; // Arrête la fonction si `category_id` est `undefined` ou `null`
				}

				console.log("Données mises à jour envoyées:", updatedActivity);

				// Appel à l'API pour mettre à jour l'activité
				const updatedActivityFromServer = await updateData(
					"/activities",
					updatedActivity.id,
					updatedActivity,
				);
				console.log(
					"Activité mise à jour reçue du serveur:",
					updatedActivityFromServer,
				);

				// Met à jour l'état local des activités avec l'activité mise à jour
				setActivities((prevActivities) =>
					prevActivities.map((activity) =>
						activity.id === updatedActivityFromServer.id
							? updatedActivityFromServer
							: activity,
					),
				);
				// Récupère à nouveau toutes les activités du serveur pour s'assurer d'avoir les données les plus récentes
				const refreshedActivities = await getDatas("/activities");
				setActivities(refreshedActivities);
				// Ferme le modal d'édition
				setIsEditModalOpen(false);
				// Réinitialise l'activité en cours d'édition
				setActivityToEdit(null);
				// Efface la sélection d'activités
				setSelectedActivities([]);
			} else {
				// Affiche une erreur si l'ID de l'activité n'est pas valide
				console.error("L'activité à mettre à jour n'a pas d'ID valide");
			}
		} catch (error) {
			// Gère les erreurs qui peuvent survenir lors de la mise à jour
			console.error("Erreur lors de la mise à jour de l'activité:", error);
		}
	};

	const handleDeleteSelectedActivities = async () => {
		// Cette fonction gère la suppression des activités sélectionnées
		// Vérifie si au moins une activité est sélectionnée
		if (selectedActivities.length === 0) {
			alert("Veuillez sélectionner au moins une activité à supprimer");
			return;
		}
		// Demande une confirmation à l'utilisateur avant de procéder à la suppression
		const confirmDelete = window.confirm(
			`Êtes-vous sur de vouloir supprimer ${selectedActivities.length} activité(s) ?`,
		);
		if (!confirmDelete) return; // Si l'utilisateur annule, on arrête la fonction

		try {
			// Boucle sur chaque ID d'activité sélectionnée pour les supprimer une par une
			for (const activityId of selectedActivities) {
				await deleteData("/activities", activityId);
			}
			// Met à jour l'état local en filtrant les activités supprimées
			setActivities((prevActivities) =>
				prevActivities.filter(
					(activity) => !selectedActivities.includes(activity.id),
				),
			);
			// Réinitialise la liste des activités sélectionnées
			setSelectedActivities([]);
			console.log("Activités supprimées avec succès");
		} catch (error) {
			// Gère les erreurs qui peuvent survenir pendant la suppression
			console.error("Erreur lors de la suppression des activités:", error);
		}
	};

	return (
		<div className="flex h-screen bg-gray-100">
			<Aside />
			<div className="flex-1 overflow-auto">
				<div className="container mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">
						Administration des Activités
					</h1>

					<div className="mb-4 flex space-x-4 ">
						<input
							type="text"
							placeholder="Rechercher une activité..."
							className="px-4 py-2 border rounded-md flex-grow focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							value={searchTerm}
							onChange={handleSearchChange}
						/>
						<select
							className="px-4 py-2 border rounded-md w-1/5 focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
						>
							<option value="all">Toutes les catégories</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id.toString()}>
									{category.name}
								</option>
							))}
						</select>
					</div>
					<div className="mb-4 flex space-x-4 justify-end ">
						<button
							type="button"
							className="bg-grey text-white rounded p-2 hover:bg-gray-700"
							onClick={() => setIsModalOpen(true)}
						>
							Créer
						</button>
						<button
							type="button"
							className="bg-grey text-white rounded p-2 hover:bg-gray-700"
							onClick={handleEditClick}
							disabled={selectedActivities.length !== 1}
						>
							Modifier
						</button>
						<button
							type="button"
							className="bg-grey text-white rounded p-2 hover:bg-gray-700"
							onClick={handleDeleteSelectedActivities}
							disabled={selectedActivities.length === 0 || isLoading}
						>
							{isLoading ? "Suppression..." : "Supprimer"}
						</button>
					</div>
					<ActivitiesModal
						isOpen={isModalOpen || isEditModalOpen}
						onClose={() => {
							setIsModalOpen(false);
							setIsEditModalOpen(false);
							setActivityToEdit(null);
						}}
						onSubmit={async (formData) => {
							await (isEditModalOpen
								? handleUpdateActivity
								: handleCreateActivity)(formData);
							fetchData();
						}}
						categories={categories}
						activity={activityToEdit}
						setActivity={setActivityToEdit}
					/>

					<div className="bg-white shadow-md rounded-lg overflow-hidden">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-grey">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
										ID
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
										Nom
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
										Image
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
										Description
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
										Catégorie
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
										Sélection
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredActivities.map((activity) => (
									<tr key={activity.id}>
										<td className="px-6 py-4 whitespace-nowrap">
											{activity.id}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{activity.title}
										</td>
										<td>
											<div className="flex gap-2 items-center mt-2 gap-x-3">
												{activity.image === null ? (
													<UserCircleIcon
														aria-hidden="true"
														className="w-12 h-12 text-gray-300"
													/>
												) : (
													<img
														alt=""
														src={activity.image}
														className="inline-block h-14 w-14 rounded-md"
													/>
												)}
											</div>
										</td>
										<td className="px-6 py-4">{activity.description}</td>

										<td className="px-6 py-4 whitespace-nowrap">
											{categories.find((cat) => cat.id === activity.category)
												?.name || "Non catégorisé"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<input
												type="checkbox"
												checked={selectedActivities.includes(activity.id)}
												onChange={() => handleSelectionChange(activity.id)}
												className="h-4 w-4 text-red-primary focus:ring-red-secondary border-gray-300 rounded"
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BackOfficeActivities;