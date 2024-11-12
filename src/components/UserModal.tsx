import React, { useState, KeyboardEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface UserFormData {
	name: string;
	lastname: string;
	image: string;
	role_id: number;
}

interface Role {
	name: string;
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
}) => {
	const [formData, setFormData] = useState<UserFormData>({
		name: "",
		lastname: "",
		image: "",
		role_id: 0,
	});

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name,
				lastname: user.lastname,
				image: "",
				role_id: user.role_id,
			});
		} else {
			setFormData({
				name: "",
				lastname: "",
				image: "",
				role_id: 0,
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
		console.log("Soumission du formulaire dans Modal", formData);
		if (user) {
			onSubmit({ ...formData, id: user.id });
		} else {
			onSubmit(formData);
		}
		onClose();
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
			className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
			onClick={handleBackgroundClick}
			onKeyDown={handleKeyDown}
			role="dialog"
			aria-modal="true"
			tabIndex={-1}
		>
			<div
				className="bg-white rounded-lg p-6 w-full max-w-md"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">
						{user ? "Modifier un utilisateur" : "Créer un nouvel utilisateur"}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
						aria-label="Fermer"
					>
						<FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
					</button>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700"
						>
							Prénom
						</label>
						<input
							type="name"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
							id="lastname"
							name="lastname"
							value={formData.lastname}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="image"
							className="block text-sm font-medium text-gray-700"
						>
							Image
						</label>
						<input
							type="file"
							id="image"
							name="image"
							onChange={(e) => handleImageChange(e)} // Fonction de gestion de fichier
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						/>
					</div>
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
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
							required
						>
							<option value="">Sélectionnez un rôle</option>{" "}
							{/* Option par défaut */}
							{role.map((role) => (
								<option key={role.id} value={role.id}>
									{role.name}
								</option>
							))}
						</select>
					</div>
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
						>
							Annuler
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
