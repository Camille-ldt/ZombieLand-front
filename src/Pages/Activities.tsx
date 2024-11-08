// Dossier: src/Pages/Activities.tsx
import { useEffect, useState } from "react";
import { Card, CardProps } from "../components/ActivityCard";
import { getDatas } from "../services/api";

export interface ActivitiesProps {
	items: CardProps[];
	activitiesButtonText: string;
}

// Interface for API response data (Interface pour les données de réponse API)
interface ActivityData {
	id: number;
	title: string;
	description: string;
	multimedias: { url: string }[];
}

const Activities = () => {
	const [activities, setActivities] = useState<CardProps[]>([]);

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const data: ActivityData[] = await getDatas("/activities");

				// Mapping data to fit CardProps structure
				const mappedActivities: CardProps[] = data.map((activity) => {
					return {
						id: activity.id,
						backgroundImage: activity.multimedias?.[0]?.url || "", // Extracting the first multimedia URL if available
						title: activity.title,
						description: activity.description,
						buttonText: "Découvrir", // Set button text for activities
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

	if (!activities || activities.length === 0) {
		return (
			<p className="text-center text-white">
				Aucune activité disponible pour le moment.
			</p>
		);
	}

	return (
		<div className="bg-black min-h-screen min-w-screen">
			<div className="container mx-auto p-4">
				<h1 className="text-3xl font-bold text-center text-white mb-8">
					Toutes les activités
				</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{activities.map((activity) => (
						<Card
							key={activity.id}
							id={activity.id}
							backgroundImage={activity.backgroundImage}
							title={activity.title}
							description={activity.description}
							buttonText={activity.buttonText}
							to="/activity"
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default Activities;