// Dossier: src/Pages/Activities.tsx
import { useEffect, useState } from "react";
import { Card, CardProps } from "../components/ActivityCard";
import { getDatas } from "../services/api";

interface Category {
  id: number;
  name: string;
}

interface ActivityWithCategory extends CardProps {
  category: Category | null;
}

// Interface for API response data (Interface pour les données de réponse API)
interface ActivityData {
	id: number;
	title: string;
	description: string;
	multimedias: { url: string }[];
}

// Interface for API response data (Interface pour les données de réponse API)
interface ActivityData {
	id: number;
	title: string;
	description: string;
	multimedias: { url: string }[];
}

const Activities = () => {
  const [activities, setActivities] = useState<ActivityWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesData, categoriesData] = await Promise.all([
          getDatas("/activities"),
          getDatas("/categories"),
        ]);

        // Si l'API te renvoie déjà l'objet complet de la catégorie pour chaque activité,
        // nous n'avons pas besoin de rechercher la catégorie manuellement.
        // Par exemple, `activity.category` peut être directement l'objet { id, name }.

        // Ajout de la catégorie à chaque activité
        const activitiesWithCategories = activitiesData.map((activity: CardProps) => {
          // Si la catégorie est déjà incluse dans `activity.category`, pas besoin de recherche supplémentaire.
          const category = categoriesData.find(
            (cat: Category) => cat.id === activity.category?.id
          );
          return {
            ...activity,
            category: category || null, // Si aucune catégorie trouvée, on met `null`
          };
        });

        setActivities(activitiesWithCategories);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesCategory =
      selectedCategory === "all" || activity.category?.id.toString() === selectedCategory;
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filteredActivities.length === 0) {
    return <p className="text-center text-white">Aucune activité ne correspond à votre recherche.</p>;
  }

  return (
    <div className="bg-black min-h-screen min-w-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Toutes les activités</h1>

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
            onChange={handleCategoryChange}
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <Card
              key={activity.id}
              id={activity.id}
              backgroundImage={activity.backgroundImage}
              title={activity.title}
              description={activity.description}
              buttonText="Découvrir"
              to={`/activity/${activity.id}`}  // Assure-toi que le lien contient l'ID correct
              category={activity.category}     // Passe la catégorie directement
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;