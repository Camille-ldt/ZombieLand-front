import { useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { getDatas, createData, updateData, deleteData } from "../services/api";
import Aside from "../components/Aside";
import UserModal from "../components/UserModal";

interface User {
	id: number;
	firstname: string;
	lastname: string;
	image: string;
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
	image: string;
	role_id: number;
}

const BackOfficeUser: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [userToEdit, setUserToEdit] = useState<User | null>(null);
	const [roles, setRoles] = useState<Role[]>([]);
	const [roleToEdit, setRoleToEdit] = useState<Role[] | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [UserFormData] = await Promise.all([getDatas("/users")]);
				setUsers(UserFormData);
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

	const updateImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
		// On récupère le fichier que l'utilisateur vient de renseigner dans l'input
		const file = evt.target.files[0]; // File

		// On convertit le fichier en data-url
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			setUser({
				...user,
				image: reader.result,
			});
		});
		reader.readAsDataURL(file);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const filteredUser = users.filter(
		(user) =>
			(selectedUsers.length === 0 || selectedUsers.includes(user.id)) &&
			user.name?.toLowerCase().includes(searchTerm.toLowerCase()),
	);

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
				<div className="container p-4 mx-auto">
					<h1 className="mb-4 text-2xl font-bold">
						Administration des Utilisateurs
					</h1>

					<div className="flex mb-4 space-x-4">
						<input
							type="text"
							placeholder="Rechercher un utilisateur..."
							className="flex-grow px-4 py-2 border rounded-md"
							value={searchTerm}
							onChange={handleSearchChange}
						/>
						<select
							className="w-1/5 px-4 py-2 border rounded-md"
							// value={selectedUsers}
							onChange={(e) => setSelectedUsers(e.target.value)}
						>
							<option value="all">Tous les utilisateurs</option>
							{users.map((user) => (
								<option key={user.id} value={user.id.toString()}>
									{user.name}
								</option>
							))}
						</select>
					</div>
					<div className="flex items-center mt-2 gap-x-3">
						{users.image === null ? (
							<UserCircleIcon
								aria-hidden="true"
								className="w-12 h-12 text-gray-300"
							/>
						) : (
							<img
								alt=""
								src={users.image}
								className="inline-block w-12 h-12 rounded-md"
							/>
						)}
						<label
							htmlFor="file-upload"
							className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							Change
							<input
								id="file-upload"
								name="file-upload"
								type="file"
								className="sr-only"
								onInput={updateImage}
							/>
						</label>
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
						onSubmit={isEditModalOpen ? handleUpdateUser : handleCreateUser}
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
										Image
									</th>

									<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
										Rôle
									</th>
									<th className="px-6 py-3" />
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200 ">
								{users.map((user) => (
									<tr key={user.id}>
										{/* ID de l'utilisateur */}
										<td className="px-6 py-4 whitespace-nowrap">{user.id}</td>

										{/* Nom de l'utilisateur */}
										<td className="px-6 py-4 whitespace-nowrap">
											{user.lastname}
										</td>

										{/* Prénom de l'utilisateur */}
										<td className="px-6 py-4">{user.firstname}</td>

										{/* Image de l'utilisateur */}
										<td className="px-6 py-4">
											{user.image ? (
												<img
													className="inline-block w-12 h-12 rounded-md"
													src={user.image}
													alt={`Avatar de l'utilisateur ${user.id}`}
												/>
											) : (
												<UserCircleIcon
													aria-hidden="true"
													className="w-12 h-12 text-gray-300"
												/>
											)}
										</td>

										{/* Rôle de l'utilisateur */}
										<td className="px-6 py-4 whitespace-nowrap ">
											{roles.find((role) => role.id === user.role_id)?.name}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{/* <input
												type="checkbox"
												checked={selectedUsers.includes(user.id)}
												onChange={() => handleSelectionChange(user.id)}
												className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
											/> */}
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
