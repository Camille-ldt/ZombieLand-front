import { useEffect, useState } from "react";
import { Card, CardProps } from "../components/ActivityCard";
import { getDatas } from "../services/api";

const Activities = () => {
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

	if (!activities || activities.length === 0) {
		return (
			<p className="text-center text-white">
				Aucune activité disponible pour le moment.
			</p>
		);
	}

	return (
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
						buttonText="Découvrir"
					/>
				))}
			</div>
		</div>
	);
};

export default Activities;
