import React, { useState, KeyboardEvent, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface ActivityFormData {
  title: string;
  description: string;
  category_id: number;
  image: string;
}

interface Activity extends ActivityFormData {
  id: number;
}

interface Category {
  id: number;
  name: string;
}

interface Activity extends ActivityFormData {
  id: number;
}

interface Category {
  id: number;
  name: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activity: ActivityFormData | Activity) => void | Promise<void>;
  categories: Category[];
  activity?: Activity | null;
  setActivity: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, categories, activity}) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    title: '',
    description: '',
    category_id: 0,
    image: ''
  });
  
  useEffect(() => {
    console.log("Activité transmise pour l'édition :", activity);

    if (activity) {
      setFormData({
        title: activity.title,
        description: activity.description,
        category_id: activity.category_id,
        image: activity.image
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category_id: 0,
        image: ''
      });
    }
  }, [activity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`handleChange - Champ : ${name}, Valeur : ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: name === 'category_id' ? Number(value) : value
    }));
    console.log("formData après handleChange :", formData);
  };

  useEffect(() => {
    console.log("formData mis à jour après handleChange :", formData); // Vérifie le changement
}, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Soumission du formulaire dans Modal", formData);
    if (activity) {
      onSubmit({ ...formData, id: activity.id });
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" 
      onClick={handleBackgroundClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {activity ? 'Modifier une activité' : 'Créer une nouvelle activité'}
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fermer"
          >
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value=""
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="passwordVerif" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <textarea
              id="passwordVerif"
              name="passwordVerif"
              value=""
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Modifier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;