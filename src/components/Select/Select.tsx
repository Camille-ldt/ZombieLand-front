// Importation de composants spécifiques depuis @headlessui/react pour construire un menu déroulant personnalisable
import {
	Label,
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/react";
// Importation d'icônes depuis @heroicons/react pour améliorer l'interface utilisateur du menu déroulant
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
// Importation de hooks React pour la gestion des états et des effets
import { useEffect, useState } from "react";
// Importation du type SelectOptionItem, utilisé pour typer les options du menu déroulant
import { SelectOptionItem } from "./Select.type";

// Définition du type des props pour le composant Select, avec un type générique T pour une meilleure flexibilité
type SelectProps<T> = {
	label: string; // Label affiché au-dessus de la liste déroulante
	items: SelectOptionItem<T>[]; // Liste des options disponibles dans la liste déroulante, typée pour être générique
	selectedItem: T; // Option actuellement sélectionnée, du même type que les items
	onSelectedItem: (item: T) => void; // Fonction de rappel appelée quand une nouvelle option est sélectionnée
};

// Déclaration du composant Select utilisant un type générique <T> pour qu'il puisse gérer divers types d'options
export const Select = <T,>({
	label, // Le label à afficher
	items, // Liste des options disponibles
	selectedItem, // Élément sélectionné actuel
	onSelectedItem, // Callback pour signaler la sélection d'un nouvel élément
}: SelectProps<T>) => {
	// Déclaration d'un état pour gérer l'élément actuellement sélectionné dans l'interface utilisateur
	const [currentSelectedItem, setCurrentSelectedItem] = useState<
		SelectOptionItem<T> | undefined
	>(undefined); // Initialisé à undefined pour l'absence de sélection initiale

	// Utilisation d'un effet pour synchroniser currentSelectedItem avec la valeur de selectedItem
	useEffect(() => {
		// Recherche de l'élément dans items correspondant à selectedItem et mise à jour de currentSelectedItem
		setCurrentSelectedItem(items.find((item) => item.value === selectedItem));
	}, [selectedItem]); // L'effet est déclenché chaque fois que selectedItem change

	return (
		<div className="block">
			{/* Listbox est le conteneur principal pour le menu déroulant, configuré avec la valeur et l'événement onChange */}
			<Listbox
				value={currentSelectedItem} // Définit l'élément sélectionné affiché dans la liste
				onChange={(item) => {
					onSelectedItem(item.value); // Appelle la fonction onSelectedItem avec la valeur de l'élément choisi
				}}
			>
				{/* Label du composant Select pour indiquer l'objet de la liste déroulante */}
				<Label className="block font-medium text-white text-sm/6">
					{label}
				</Label>
				<div className="relative mt-2">
					{/* ListboxButton affiche le texte du choix sélectionné et réagit aux clics pour ouvrir la liste */}
					<ListboxButton className="relative w-full cursor-default rounded-md bg-grey py-1.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-green-low focus:outline-none focus:ring-2 focus:ring-red-primary sm:text-sm/6">
						<span className="flex items-center">
							{/* Affiche le nom de l'option sélectionnée ou un texte par défaut si aucune sélection */}
							<span className="block ml-3 truncate">
								{currentSelectedItem
									? currentSelectedItem?.name // Affiche le nom de l'élément sélectionné si disponible
									: "Sélectionnez une option"}
							</span>
						</span>
						{/* Icône ChevronUpDown indiquant que la liste est déroulante */}
						<span className="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none">
							<ChevronUpDownIcon
								aria-hidden="true"
								className="w-5 h-5 text-gray-400"
							/>
						</span>
					</ListboxButton>

					{/* ListboxOptions affiche les options disponibles sous forme de menu déroulant */}
					<ListboxOptions
						transition // Applique une transition pour l'ouverture et la fermeture de la liste
						className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-grey py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
					>
						{/* items.map pour générer chaque option de la liste à partir des données items */}
						{items.map((item: SelectOptionItem<T>) => (
							<ListboxOption
								key={item.name} // Clé unique pour chaque option basée sur le nom
								value={item} // Valeur de l'option
								className="group relative cursor-default select-none py-2 pl-3 pr-9 text-white data-[focus]:bg-red-primary data-[focus]:text-white"
							>
								<div className="flex items-center">
									{/* Affiche le nom de l'option */}
									<span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
										{item.name}
									</span>
								</div>

								{/* Icône Check affichée si l'option est sélectionnée */}
								<span className="absolute inset-y-0 right-0 flex items-center pr-4 text-red-primary group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
									<CheckIcon aria-hidden="true" className="w-5 h-5" />
								</span>
							</ListboxOption>
						))}
					</ListboxOptions>
				</div>
			</Listbox>
		</div>
	);
};

export default Select;
