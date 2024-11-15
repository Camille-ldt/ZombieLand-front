import React, { useState, KeyboardEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { updateDataPassword } from '../services/api';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user:
    {
      id: number;
      password: string;
    }
}

const PasswordModal: React.FC<ModalProps> = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({ password: '', passwordVerif: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log('données dans le modal', formData);
  
  const handleSubmit = async (e: React.FormEvent) => {
    console.log('dans le submit de la modal');
    e.preventDefault();

    console.log('Password:', formData.password);
    console.log('Password Verification:', formData.passwordVerif);

    if (formData.password !== formData.passwordVerif) {
      setError(' Les mots de passe ne correspondent pas.');
      return;
    }
    console.log(user.id);
    console.log('données dans le submit dela modal', {password: formData});
    
    // Appel de la fonction onSubmit avec les données
    await updateDataPassword('auth/update-password', user.id, { password: formData.password });

    // Réinitialise le formulaire et ferme la modal
    setError('');
    setFormData({ password: '', passwordVerif: '' });
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
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Modifier votre mot de passe</h2>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-secondary focus:ring focus:ring-red-secondary focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="passwordVerif" className="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="passwordVerif"
              name="passwordVerif"
              value={formData.passwordVerif}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-secondary focus:ring focus:ring-red-secondary focus:ring-opacity-50"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-primary text-white rounded hover:bg-red-secondary"
            >
              Modifier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;