import axios from 'axios'; // Assurez-vous d'avoir installé axios

interface Activity {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  to: string;
}

async function fetchActivities(fetchURL: string): Promise<Activity[]> {
  try {
    const response = await axios.get(fetchURL);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des activités:", error);
    return [];
  }
};

export default fetchActivities;