import React, { useState, KeyboardEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface UserFormData {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	role_id: number;
}

interface User extends UserFormData {
	id: number;
}

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (user: UserFormData | User) => void | Promise<void>;
	user?: User | null;
	role: { id: number; name: string }[];
}

const UserModal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	user,
	role, // Ajout des rôles ici
}) => {
	const [formData, setFormData] = useState<UserFormData>({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		role_id: 2,
	});

	useEffect(() => {
		if (user) {
			setFormData({
				firstname: user.firstname,
				lastname: user.lastname,
				password: "",
				email: user.email,
				role_id: user.role_id,
			});
		} else {
			setFormData({
				firstname: "",
				lastname: "",
				email: "",
				password: "",
				role_id: 2,
			});
		}
	}, [user]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "role_id" ? Number(value) : value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.email) {
			alert("Les champs email et mot de passe sont requis.");
			return;
		}
		try {
			console.log("Données soumises :", formData);
			if (user) {
				onSubmit({ ...formData, id: user.id });
			} else {
				onSubmit(formData);
			}
			onClose();
		} catch (error) {
			console.error("Erreur lors de la soumission :", error);
		}
	};

	const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Escape") {
			onClose();
		}
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
			onClick={handleBackgroundClick}
			onKeyDown={handleKeyDown}
			role="dialog"
			aria-modal="true"
			tabIndex={-1}
		>
			<div
				className="w-full max-w-md p-6 bg-white rounded-lg"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold">
						{user ? "Modifier un utilisateur" : "Créer un nouvel utilisateur"}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
						aria-label="Fermer"
					>
						<FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
					</button>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="firstname"
							className="block text-sm font-medium text-gray-700"
						>
							Prénom
						</label>
						<input
							type="text"
							id="firstname"
							name="firstname"
							value={formData.firstname}
							onChange={handleChange}
							className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="lastname"
							className="block text-sm font-medium text-gray-700"
						>
							Nom
						</label>
						<input
							type="text"
							id="lastname"
							name="lastname"
							value={formData.lastname}
							onChange={handleChange}
							className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							type="text"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							required
						/>
					</div>

					{!user && (
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Mot de passe
							</label>
							<input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
								required
							/>
						</div>
					)}
					<div>
						<label
							htmlFor="role_id"
							className="block text-sm font-medium text-gray-700"
						>
							Rôle
						</label>
						<select
							id="role_id"
							name="role_id"
							value={formData.role_id}
							onChange={handleChange}
							className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							required
						>
							<option value="0">Sélectionnez un rôle</option>
							{role.map((r) => (
								<option key={r.id} value={r.id}>
									{r.name}
								</option>
							))}
						</select>
					</div>
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
						>
							Annuler
						</button>
						<button
							type="submit"
							onSubmit={handleSubmit}
							className="px-4 py-2 text-white bg-red-primary rounded hover:bg-red-secondary"
						>
							{user ? "Modifier" : "Créer"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UserModal;
