import { useEffect, useState } from "react";
import { getDatas, createData, updateData, deleteData } from "../services/api";
import Aside from "../components/Aside";
import ActivitiesModal from "../components/ActivitiesModal";

interface User {
	id: number;
	name: string;
	lastname: string;
	role_id: number;
}

interface UserData {
	name: string;
	lastname: string;
	role_id: number;
}

const BackOfficeUser: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [userToEdit, setUserToEdit] = useState<User | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [UserData] = await Promise.all([getDatas("/users")]);
				setUsers(UserData);
			} catch (error) {
				console.error("Erreur lors de la récupération des données", error);
			}
		};
		fetchData();
	}, []);

	const handleSelectionChange = (id: number) => {
		setSelectedUsers((prev) =>
			prev.includes(id)
				? prev.filter((userID) => userID !== id)
				: [...prev, id],
		);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const filteredUser = users.filter(
		(user) =>
			(selectedUsers.length === 0 || selectedUsers.includes(user.id)) &&
			user.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (users.length === 0) {
		return (
			<p className="text-center text-white">
				Aucun utilisateur disponible pour le moment.
			</p>
		);
	}

	const handleCreateUser = async (newUser: UserData) => {
		try {
			console.log("Données envoyées au serveur:", newUser);
			const createdUser = await createData("/users", newUser);
			console.log("Utilisateur créé:", createdUser);
			setUsers((prevUsers) => [...prevUsers, createdUser]);
			setIsModalOpen(false);
		} catch (error) {
			console.error("Erreur lors de la création de l'utilisateur:", error);
		}
	};

	const handleEditClick = () => {
		if (selectedUsers.length === 1) {
			const userToEdit = users.find((user) => user.id === selectedUsers[0]);
			if (userToEdit) {
				setUserToEdit(userToEdit);
				setIsEditModalOpen(true);
			}
		}
	};

	const handleUpdateUser = async (updatedUser: UserData) => {
		try {
			if ("id" in updatedUser && typeof updatedUser.id === "number") {
				const updatedUserFromServer = await updateData(
					"/users",
					updatedUser.id,
					updatedUser,
				);
				console.log(
					"Utilisateur mise à jour reçue du serveur",
					updatedUserFromServer,
				);

				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.id === updatedUserFromServer.id ? updatedUserFromServer : user,
					),
				);
				const refreshedUsers = await getDatas("/users");
				setUsers(refreshedUsers);
				setIsEditModalOpen(false);
				setUserToEdit(null);
				setSelectedUsers([]);
			} else {
				console.error("L'utilisateur à mettre à jour n'a pas d'ID valide.");
			}
		} catch (error) {
			console.error("Erreur lors de la mise à jour de l'utilisateur", error);
		}
	};

	const handleDeleteSelectedUser = async () => {
		if (selectedUsers.length === 0) {
			alert("Veuillez sélectionner au moins un utilisateur à supprimer");
			return;
		}
		const confirmDelete = window.confirm(
			`Êtes-vous sur de vouloir supprimer ${selectedUsers.length} activité(s) ?`,
		);
		if (!confirmDelete) return;

		try {
			for (const userId of selectedUsers) {
				await deleteData("/users", userId);
			}
			setUsers((prevUsers) =>
				prevUsers.filter((user) => !selectedUsers.includes(user.id)),
			);
			setSelectedUsers([]);
			console.log("Utilisateurs suprimées avec succès");
		} catch (error) {
			console.error("Erreur lors de la suppression des utilisateurs:", error);
		}
	};

	return (
		<div className="flex h-screen bg-gray-100">
			<Aside />
			<div className="flex-1 overflow-auto">
				<div className="container mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">
						Administration des Utilisateurs
					</h1>

					<div className="mb-4 flex space-x-4">
						<input
							type="text"
							placeholder="Rechercher une activité..."
							className="px-4 py-2 border rounded-md flex-grow"
							value={searchTerm}
							onChange={handleSearchChange}
						/>
						<select
							className="px-4 py-2 border rounded-md w-1/5"
							value={selectedUsers}
							onChange={(e) => setSelectedUsers(e.target.value)}
						>
							<option value="all">Toutes les catégories</option>
							{users.map((user) => (
								<option key={user.id} value={user.id.toString()}>
									{user.name}
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
							disabled={selectedUsers.length !== 1}
						>
							Modifier
						</button>
						<button
							type="button"
							className="bg-grey text-white rounded p-2 hover:bg-gray-700"
							onClick={handleDeleteSelectedUser}
							disabled={selectedUsers.length === 0 || isLoading}
						>
							{isLoading ? "Suppression..." : "Supprimer"}
						</button>
					</div>
					<ActivitiesModal
						isOpen={isModalOpen || isEditModalOpen}
						onClose={() => {
							setIsModalOpen(false);
							setIsEditModalOpen(false);
							setUserToEdit(null);
						}}
						onSubmit={isEditModalOpen ? handleUpdateUser : handleCreateUser}
						categories={users}
						activity={userToEdit}
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
										Prénom
									</th>

									<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
										Rôle
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredUser.map((user) => (
									<tr key={user.id}>
										<td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
										<td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
										<td className="px-6 py-4">{user.lastname}</td>

										<td className="px-6 py-4 whitespace-nowrap">
											{users.find((cat) => cat.id === user.role_id)?.name ||
												"Non catégorisé"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<input
												type="checkbox"
												checked={selectedUsers.includes(user.id)}
												onChange={() => handleSelectionChange(user.id)}
												className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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

export default BackOfficeUser;
