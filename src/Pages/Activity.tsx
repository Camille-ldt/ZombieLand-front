import { useLocation } from "react-router-dom";
import { CardProps, Card } from "../components/ActivityCard";

const Activity = () => {
	const location = useLocation();
	const activity = location.state?.activity as CardProps;

	if (!activity) {
		return <p className="text-center">Aucune activité sélectionnée.</p>;
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-800 p-4">
			<div className="w-full max-w-3xl">
				<Card
					id={activity.id}
					backgroundImage={activity.backgroundImage}
					title={activity.title}
					description={activity.description}
					buttonText="Retour"
					to="/"
				/>
			</div>
		</div>
	);
};

export default Activity;
