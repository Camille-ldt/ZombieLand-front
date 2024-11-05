import { useEffect, useState } from "react";
import MyImage from "../assets/img/zombie-accueil.webp";
import { RedLink } from "../components/RedLink";
import { Title } from "../components/Title";
import { Carousel } from "../components/Carousel";
import { CardProps } from "../components/ActivityCard";
import { getDatas } from "../services/api";

const HomePage = () => {
	const [activities, setActivities] = useState<CardProps[]>([]);

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const data = await getDatas("/activities");
				setActivities(data);
			} catch (error) {
				console.error("Erreur lors de la récupération des activités", error);
			}
		};
		fetchActivities();
	}, []);

	return (
		<div className="bg-black min-h-screen">
			<div className="relative">
				<img
					src={MyImage}
					alt="Visuel principal de la page"
					className="w-full h-[70vh] object-cover sm:h-screen" // Réduit la hauteur de l'image en version mobile
				/>
				<div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-center px-4 sm:px-0">
					<p className="text-white max-w-xs sm:max-w-md text-lg sm:text-xl font-semibold bg-gray-800/50 rounded-xl p-4 mb-4">
						Préparez-vous à survivre à l'impensable : entrez dans le monde des
						zombies, où chaque seconde compte !
					</p>
					<RedLink to="" textSize="text-xl" position="">
						Réservation
					</RedLink>
				</div>
			</div>
			<div className="text-center mt-7">
				<Title>Qui sommes nous ?</Title>
				<p className="text-white pb-14 px-60">
					Willkommen in der postapokalyptischen Welt von ZombieLand, einem
					einzigartigen Freizeitpark! Unsere Mission ist es, Sie in eine Welt zu
					entführen, in der Adrenalin und Abenteuer auf immersive, von der
					Apokalypse inspirierte Kulissen treffen. ZombieLand wurde für
					Liebhaber von Nervenkitzel und außergewöhnlichen Erlebnissen
					konzipiert und bietet eine Vielzahl von Aktivitäten, Attraktionen und
					Events, die speziell für die Mutigsten gedacht sind! Machen Sie sich
					bereit, Herausforderungen anzunehmen, Ihre Ängste zu überwinden und
					unvergessliche Momente mit Familie oder Freunden zu erleben. Auf
					eigene Gefahr!
					{/* Bienvenue dans l'univers post-apocalyptique de ZombieLand, un parc d'attraction unique en son genre ! Notre mission est de vous plonger dans un monde où l'adrénaline et l'aventure se rencontrent dans des décors immersifs inspirés de l'apocalypse.
                Conçu pour les amateurs de sensations fortes et d'expériences hors du commun, ZombieLand vous propose une multitude d'activités, d'attractions et d'événements spécialement pensés pour les plus courageux !
                Préparez-vous à relever des défis, à affronter vos peur et à vivre des moments inoubliables en famille ou entre amis.
                À vos risques et périls ! */}
				</p>
			</div>

			{/* Intégration du Carousel */} 
			<div className="">
				<Carousel items={activities} />
			</div>
			<div className="text-center mt-10 pb-10">
				<RedLink to="" textSize="text-xl" position="">
					Voir toutes nos activités
				</RedLink>
			</div>
		</div>
	);
};

export default HomePage;
