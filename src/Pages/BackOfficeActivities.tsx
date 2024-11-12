import { useEffect, useState } from "react";
import { getDatas, createData } from "../services/api";
import Aside from "../components/Aside";
import Modal from '../components/Modal';
import { UserCircleIcon } from '@heroicons/react/24/solid'

interface Activity {
    id: number;
    title: string;
    description: string;
    category_id: number;
}

interface Category {
    id: number;
    name: string;
}

interface ActivityFormData {
    title: string;
    description: string;
    category_id: number;
}

interface Multimedia {
    id: number;
    name: string;
    url: string;
}

const BackOfficeActivities: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [multimedias, setMultimedias] = useState<Multimedia[]>([]);
    const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isModalOpen, setIsModalOpen]= useState(false);

    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activitiesData, categoriesData, multimediasData] = await Promise.all([
                    getDatas("/activities"),
                    getDatas("/categories"),
                    getDatas("/:activityId/multimedia")
                ]);
                setActivities(activitiesData);
                setCategories(categoriesData);
                setMultimedias(multimediasData);
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error);
            }
        };
        fetchData();
    }, []);

    const updateImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
        // On récupère le fichier que l'utilisateur vient de renseigner dans l'input
        const file = evt.target.files[0]; // File
    
        // On convertit le fichier en data-url
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          setUser({
            ...user,
            image: reader.result
          });
        });
        reader.readAsDataURL(file);
    };

    const handleSelectionChange = (id: number) => {
        setSelectedActivities(prev =>
            prev.includes(id) ? prev.filter(activityId => activityId !== id) : [...prev, id]
        );
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredActivities = activities.filter(activity =>
        (selectedCategory === "all" || activity.category_id.toString() === selectedCategory) &&
        activity.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activities.length === 0) {
        return <p className="text-center text-white">Aucune activité disponible pour le moment.</p>;
    }

    const handleCreateActivity = async (newActivity: ActivityFormData) => {
        try {
          console.log('Données envoyées au serveur:', newActivity); // Pour le débogage
          const createdActivity = await createData('/activities', newActivity);
          console.log('Activité créée:', createdActivity); // Pour le débogage
          setActivities(prevActivities => [...prevActivities, createdActivity]);
          setIsModalOpen(false);
        } catch (error) {
          console.error("Erreur lors de la création de l'activité:", error);
         
        }
      };

    return (
        <div className="flex h-screen bg-gray-100">
            <Aside/>
            <div className="flex-1 overflow-auto">
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Administration des Activités</h1>
                    
                    <div className="mb-4 flex space-x-4">
                        <input
                            type="text"
                            placeholder="Rechercher une activité..."
                            className="px-4 py-2 border rounded-md flex-grow"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <select
                            className="px-4 py-2 border rounded-md w-1/5"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">Toutes les catégories</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 flex space-x-4 justify-end ">
                        <button type="button" className="bg-grey text-white rounded p-2 hover:bg-gray-700" onClick={() => setIsModalOpen(true)}>Créer</button>
                        <button type="button" className="bg-grey text-white rounded p-2 hover:bg-gray-700">Modifier</button>
                        <button type="button" className="bg-grey text-white rounded p-2 hover:bg-gray-700">Supprimer</button>
                    </div>
                    <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateActivity}
                    categories={categories}
                    />

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-grey">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Catégorie</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Sélection</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredActivities.map((activity) => (
                                    <tr key={activity.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{activity.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{activity.title}</td>
                                        <td>
                                            <div className="flex items-center mt-2 gap-x-3">
                                                {user.image === null ? (
                                                  <UserCircleIcon aria-hidden="true" className="w-12 h-12 text-gray-300" />
                                                ) : (
                                                  <img
                                                    alt=""
                                                    src={user.image}
                                                    className="inline-block h-12 w-12 rounded-md"
                                                  />
                                                )}
                                                <label htmlFor="file-upload" className="rounded-md bg-white px-2.5 py-1.5 text-sm   font-semibold                         text-gray-900 shadow-sm ring-1 ring-inset   ring-gray-300 hover:bg-gray-50">
                                                  Change
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only"  onInput={updateImage} />
                                                </label>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{activity.description}</td>
                                        
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {categories.find(cat => cat.id === activity.category_id)?.name || 'Non catégorisé'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedActivities.includes(activity.id)}
                                                onChange={() => handleSelectionChange(activity.id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackOfficeActivities;