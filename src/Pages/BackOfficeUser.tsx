import { useEffect, useState } from "react";
import { getDatas, createData, updateData, deleteData } from "../services/api";
import Aside from "../components/Aside";
import UserModal from "../components/UserModal";

interface User {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	role_id: number;
}

interface Role {
	id: number;
	name: string;
}

interface UserFormData {
	id?: number;
	firstname: string;
	lastname: string;
	password: string;
	email: string;
	role_id: number;
}

const BackOfficeUser: React.FC = () => {
	// Tableau des utilisateurs récupérés depuis l'API
	const [users, setUsers] = useState<User[]>([]);
	// Tableau des utilisateurs sélectionnés avec les checkboxes
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

	// Filtre des utilisateurs par nom ou prénom
	const [searchTerm, setSearchTerm] = useState("");
	// Filtre des utilisateurs par rôle
	const [searchRole, setSearchRole] = useState("all");

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [userToEdit, setUserToEdit] = useState<User | null>(null);
	const [roles, setRoles] = useState<Role[]>([]);
	const [roleToEdit, setRoleToEdit] = useState<Role[] | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	// Tableau des utilisateurs à afficher, il est construit à partir
	// des utilisateurs récupérés depuis l'API et des filtres de recherche
	const usersToDisplay = users.filter((user) => {
		// 1. on vérifie si l'utilisateur correspond au filtre de recherche par nom/prénom
		// (vrai si on n'a pas de filtre actuellement)
		let matchesSearchTerm = true;
		if (searchTerm !== "") {
			matchesSearchTerm =
				user.firstname.toLowerCase().includes(searchTerm) ||
				user.lastname.toLowerCase().includes(searchTerm);
		}

		// 2. on vérifie si l'utilisateur correspond au filtre de recherche par rôle
		// (vrai si le filtre actuel est sur "tous les rôles")
		let matchesSearchRole = true;
		if (searchRole !== "all") {
			matchesSearchRole = user.role_id === Number.parseInt(searchRole);
		}

		// 3. on retourne true si l'utilisateur correspond à tous les filtres
		return matchesSearchTerm && matchesSearchRole;
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const users = await getDatas("/users");
				setUsers(users);
			} catch (error) {
				console.error("Erreur lors de la récupération des données", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const rolesData = await getDatas("/roles");
				setRoles(rolesData);
			} catch (error) {
				console.error("Erreur lors de la récupération des rôles", error);
			}
		};
		fetchRoles();
	}, []);

	const handleSelectionChange = (id: number) => {
		setSelectedUsers((prev) =>
			prev.includes(id)
				? prev.filter((userID) => userID !== id)
				: [...prev, id],
		);
	};

	/**
	 * Met à jour filtre de recherche par nom/prénom
	 * @param {Event} event L'événement survenu sur le champ de recherche
	 */
	const handleSearch = (event: React.UIEvent<HTMLInputElement>) => {
		// 1. on lit la valeur qui est actuellement dans notre <input>
		const value = event.target.value.toLowerCase();

		// 2. on met à jour le state avec le nouveau filtre de recherche par nom/prénom
		setSearchTerm(value);
	};

	/**
	 * Met à jour filtre de recherche par rôle
	 * @param {Event} event L'événement survenu sur le champ de recherche
	 */
	const handleRoleSearch = (event: React.UIEvent<HTMLSelectElement>) => {
		// 1. on lit la valeur qui est actuellement sélectionnée dans notre <select>
		const roleId = event.target.value;

		// 2. on met à jour le state avec le nouveau filtre de recherche par rôle
		setSearchRole(roleId);
	};

	if (users.length === 0) {
		return (
			<p className="text-center text-white">
				Aucun utilisateur disponible pour le moment.
			</p>
		);
	}

	const handleCreateUser = async (newUser: UserFormData) => {
		try {
			console.log("Données envoyées au serveur:", newUser);
			const createdUser = await createData("/users", newUser);
			console.log("Utilisateur créé:", createdUser);
			setUsers([...users, createdUser]);
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

	const handleUpdateUser = async (updatedUser: UserFormData) => {
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

				const userIndex = users.findIndex(
					(user) => user.id === updatedUserFromServer.id,
				);
				const updatedUsers = users.toSpliced(
					userIndex,
					1,
					updatedUserFromServer,
				);

				setUsers(updatedUsers);
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
			`Êtes-vous sur de vouloir supprimer ${selectedUsers.length} utilisateur(s) ?`,
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

	function fetchData() {
		throw new Error("Function not implemented.");
	}

	return (
		<div className="flex h-screen bg-gray-100">
			<Aside />
			<div className="flex-1 overflow-auto">
				<div className="container p-4 mx-auto">
					<h1 className="mb-4 text-2xl font-bold">
						Administration des Utilisateurs
					</h1>

					<div className="flex mb-4 space-x-4">
						<input
							type="search"
							placeholder="Rechercher un utilisateur..."
							className="flex-grow px-4 py-2 border rounded-md"
							onInput={handleSearch}
						/>
						<select
							className="w-1/5 px-4 py-2 border rounded-md"
							onInput={handleRoleSearch}
						>
							<option value="all">Tous les rôles</option>
							{roles.map((role) => (
								<option key={role.id} value={role.id}>
									{role.name}
								</option>
							))}
						</select>
					</div>
					<div className="flex justify-end mb-4 space-x-4 ">
						<button
							type="button"
							className="p-2 text-white rounded bg-grey hover:bg-gray-700"
							onClick={() => setIsModalOpen(true)}
						>
							Créer
						</button>
						<button
							type="button"
							className="p-2 text-white rounded bg-grey hover:bg-gray-700"
							onClick={handleEditClick}
							disabled={selectedUsers.length !== 1}
						>
							Modifier
						</button>
						<button
							type="button"
							className="p-2 text-white rounded bg-grey hover:bg-gray-700"
							onClick={handleDeleteSelectedUser}
							disabled={selectedUsers.length === 0 || isLoading}
						>
							{isLoading ? "Suppression..." : "Supprimer"}
						</button>
					</div>
					<UserModal
						isOpen={isModalOpen || isEditModalOpen}
						onClose={() => {
							setIsModalOpen(false);
							setIsEditModalOpen(false);
							setUserToEdit(null);
						}}
						onSubmit={userToEdit ? handleUpdateUser : handleCreateUser}
						user={userToEdit}
						role={roles}
					/>
					<div className="overflow-hidden bg-white rounded-lg shadow-md">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-grey">
								<tr>
									<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
										ID
									</th>
									<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
										Nom
									</th>
									<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
										Prénom
									</th>
									<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
										Email
									</th>

									<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
										Rôle
									</th>
									<th className="px-6 py-3" />
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200 ">
								{usersToDisplay.map((user) => (
									<tr key={user.id}>
										{/* ID de l'utilisateur */}
										<td className="px-6 py-4 whitespace-nowrap">{user.id}</td>

										{/* Nom de l'utilisateur */}
										<td className="px-6 py-4 whitespace-nowrap">
											{user.lastname}
										</td>

										{/* Prénom de l'utilisateur */}
										<td className="px-6 py-4">{user.firstname}</td>

										{/* Email de l'utilisateur */}
										<td className="px-6 py-4">{user.email}</td>

										{/* Rôle de l'utilisateur */}
										<td className="px-6 py-4 whitespace-nowrap ">
											{roles.find((role) => role.id === user.role_id)?.name}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{/* Checkbox pour modifier ou supprimer un utilisateur */}
											<input
												type="checkbox"
												checked={selectedUsers.includes(user.id)}
												onChange={() => handleSelectionChange(user.id)}
												className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
