import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GreenLink } from "../GreenLink";
import Select from "../Select/Select";
import { SelectOptionItem } from "../Select/Select.type";
import { UsefulInformationContentItem } from "./UsefulInformation.type";
import AboutUs from "../../Pages/AboutUs";
import SiteMap from "../../Pages/SiteMap";
import LegalNotices from "../../Pages/LegalNotices";
import CGV from "../../Pages/CGV";
import Newletter from "../../Pages/Newsletter";
import Glossary from "../../Pages/Glossary";
import Support from "../../Pages/Support";

export const UsefulInformation = () => {
	const [selectedItem, setSelectedItem] =
		useState<UsefulInformationContentItem>("aboutus");
	const location = useLocation();

	// Détection de l'ancre dans l'URL pour choisir la section correspondante
	useEffect(() => {
		if (location.hash) {
			const hashValue = location.hash.substring(1);
			if (optionItems.some((item) => item.value === hashValue)) {
				setSelectedItem(hashValue as UsefulInformationContentItem);
			}
		}
	}, [location]);

	// Fonction pour remonter en haut de la page lors de la navigation
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Déclaration des options disponibles pour le Select, sous forme d'un tableau d'objets
	const optionItems: SelectOptionItem<UsefulInformationContentItem>[] = [
		{ name: "À propos", value: "aboutus" },
		{ name: "Plan du site", value: "sitemap" },
		{ name: "Mentions légales", value: "legal-notices" },
		{ name: "CGV", value: "cgv" },
		{ name: "Newsletter", value: "newsletter" },
		{ name: "Glossaire", value: "glossary" },
		{ name: "Support", value: "support" },
	];

	return (
		<div className="block min-h-screen bg-black p-11">
			<div className="flex-wrap items-center justify-center hidden gap-4 py-8 lg:flex sm:text-sm lg:text-lg xl:text-xl">
				{/* Utilisation de map pour afficher tous les GreenLinks */}
				{optionItems.map((item) => (
					<GreenLink
						key={item.value}
						onClick={() => {
							setSelectedItem(item.value);
							scrollToTop();
						}}
						textSize="text-sm"
						position="relative"
					>
						{item.name}
					</GreenLink>
				))}
			</div>

			<div>
				<div className="block lg:hidden">
					<Select
						label="Sélectionne ton choix"
						items={optionItems}
						selectedItem={selectedItem}
						onSelectedItem={(
							nextSelectedItem: UsefulInformationContentItem,
						) => {
							setSelectedItem(nextSelectedItem);
							scrollToTop();
						}}
					/>
				</div>

				{/* Affichage d'une page lors du click sur un Item */}
				{selectedItem === "aboutus" && <AboutUs />}
				{selectedItem === "sitemap" && <SiteMap />}
				{selectedItem === "legal-notices" && <LegalNotices />}
				{selectedItem === "cgv" && <CGV />}
				{selectedItem === "newsletter" && <Newletter />}
				{selectedItem === "glossary" && <Glossary />}
				{selectedItem === "support" && <Support />}
			</div>
		</div>
	);
};
