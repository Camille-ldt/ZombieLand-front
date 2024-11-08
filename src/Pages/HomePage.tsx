// Dossier: src/Pages/HomePage.tsx
import { useEffect, useState } from "react";
import MyImage from "../assets/img/zombie-accueil.webp";
import { RedLink } from "../components/RedLink";
import { Title } from "../components/Title";
import { Carousel } from "../components/Carousel";
import { CardProps } from "../components/ActivityCard";
import { getDatas } from "../services/api";

// Interface for API response data (Interface pour les données de réponse API)
interface ActivityData {
    id: number;
    title: string;
    description: string;
    multimedias: { url: string }[];
}

const HomePage = () => {
    const [activities, setActivities] = useState<CardProps[]>([]);

    useEffect(() => {
        const fetchActivities = async (): Promise<void> => {
            try {
                const data: ActivityData[] = await getDatas("/activities");

                // Mapping data to fit CardProps structure
                const mappedActivities: CardProps[] = data.map((activity) => {
                    return {
                        id: activity.id,
                        backgroundImage: activity.multimedias?.[0]?.url || "", // Extracting the first multimedia URL if available
                        title: activity.title,
                        description: activity.description,
                        buttonText: "Learn More", // You can modify this according to your needs
                        to: `/activity/${activity.id}`
                    };
                });

                setActivities(mappedActivities);
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
                    className="w-full h-[50vh] object-cover sm:h-[70vh] md:h-screen" // Ajustement des hauteurs pour un meilleur responsive
                />
                <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-center px-4 sm:px-2 md:px-0">
                    <p className="text-white max-w-xs sm:max-w-sm md:max-w-md text-lg sm:text-lg md:text-xl font-semibold bg-gray-800/50 rounded-xl p-4 mb-4">
                        Préparez-vous à survivre à l'impensable : entrez dans le monde des zombies, où chaque seconde compte !
                    </p>
                    <RedLink to="" textSize="text-lg sm:text-xl" position="">
                        Réservation
                    </RedLink>
                </div>
            </div>
            <div className="text-center mt-7 px-4 sm:px-10 md:px-60">
                <Title>Qui sommes nous ?</Title>
                <p className="text-white pb-14">
                    Bienvenue dans l'univers post-apocalyptique de ZombieLand, un parc d'attraction unique en son genre ! Notre mission est de vous plonger dans un monde où l'adrénaline et l'aventure se rencontrent dans des décors immersifs inspirés de l'apocalypse. Conçu pour les amateurs de sensations fortes et d'expériences hors du commun, ZombieLand vous propose une multitude d'activités, d'attractions et d'événements spécialement pensés pour les plus courageux ! Préparez-vous à relever des défis, à affronter vos peur et à vivre des moments inoubliables en famille ou entre amis. À vos risques et périls !
                </p>
            </div>

            {/* Intégration du Carousel */} 
            <div className="px-4 sm:px-10 md:px-20">
                <Carousel items={activities} carouselButtonText="Découvrir" />
            </div>
            <div className="text-center mt-10 pb-10">
                <RedLink to="/activities" textSize="text-lg sm:text-xl" position="">
                    Voir toutes nos activités
                </RedLink>
            </div>
        </div>
    );
};

export default HomePage;