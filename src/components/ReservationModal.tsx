import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface ReservationFormData {
    id?: number; // id optionnel pour la création
    date_start: string;
    date_end: string;
    number_tickets: number;
    user_id: number;
    period_id: number;
}

interface Reservation extends ReservationFormData {
    id: number;
}

interface User {
    id: number;
    firstname: string; 
    lastname: string; 
}

interface Period {
    id: number;
    name: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reservation: ReservationFormData | Reservation) => void | Promise<void>;
    periods: Period[];
    users: User[];
    reservation?: Reservation | null; 
}

const ReservationModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, periods, users, reservation }) => {
    
   const [formData, setFormData] = useState<ReservationFormData>({
       date_start: '',
       date_end: '',
       number_tickets: 0,
       user_id: 0,
       period_id: 0
   });

   useEffect(() => {
       if (reservation) {
           setFormData({
               date_start: reservation.date_start,
               date_end: reservation.date_end,
               number_tickets: reservation.number_tickets,
               user_id: reservation.user_id,
               period_id: reservation.period_id,
           });
       } else {
           setFormData({
               date_start:'',
               date_end:'',
               number_tickets :0,
               user_id :0,
               period_id :0,
           });
       }
   }, [reservation]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
       const { name, value } = e.target;

       setFormData(prev => ({
           ...prev,
           [name]: name === 'number_tickets' || name === 'user_id' || name === 'period_id' ? Number(value) : value,
       }));
   };

   const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();
       
       // Formatage des dates au format "yyyy-MM-dd"
       const formattedData = {
           ...formData,
           date_start: new Date(formData.date_start).toISOString().slice(0,10), // Formatage pour la date de début
           date_end: new Date(formData.date_end).toISOString().slice(0,10) // Formatage pour la date de fin
       };

       console.log("Soumission du formulaire dans Modal", formattedData);

       if (reservation) {
           onSubmit({ ...formattedData, id: reservation.id });
       } else {
           onSubmit(formattedData);
       }
       
       onClose();
   };

   const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
       if (e.target === e.currentTarget) {
           onClose();
       }
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
       if (e.key === 'Escape') {
           onClose();
       }
   };

   if (!isOpen) return null;

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
                 <h2 className="text-xl font-bold">{reservation ? 'Modifier une réservation' : 'Créer une nouvelle réservation'}</h2>
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
                     <label htmlFor="date_start" className="block text-sm font-medium text-gray-700">Date de début</label>
                     <input
                         type="date"
                         id="date_start"
                         name="date_start"
                         value={formData.date_start}
                         onChange={handleChange}
                         required
                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                     />
                 </div>

                 <div>
                     <label htmlFor="date_end" className="block text-sm font-medium text-gray-700">Date de fin</label>
                     <input
                         type="date"
                         id="date_end"
                         name="date_end"
                         value={formData.date_end}
                         onChange={handleChange}
                         required
                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                     />
                 </div>

                 <div>
                     <label htmlFor="number_tickets" className="block text-sm font-medium text-gray-700">Nombre de tickets</label>
                     <input
                         type="number"
                         id="number_tickets"
                         name="number_tickets"
                         value={formData.number_tickets}
                         onChange={handleChange}
                         required
                         min={1} // Ensure at least one ticket is selected
                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                     />
                 </div>

                 <div>
                     <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">Utilisateur</label>
                     <select
                         id="user_id"
                         name="user_id"
                         value={formData.user_id}
                         onChange={handleChange}
                         required
                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                     >
                      {/* Options for users */}
                      {users.map(user => (
                          <option key={user.id} value={user.id}>{user.firstname} {user.lastname}</option>
                      ))}
                     </select>
                 </div>

                 <div>
                     <label htmlFor="period_id" className="block text-sm font-medium text-gray-700">Période</label>
                     <select
                         id="period_id"
                         name="period_id"
                         value={formData.period_id}
                         onChange={handleChange}
                         required
                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                     >
                      {/* Options for periods */}
                      {periods.map(period => (
                          <option key={period.id} value={period.id}>{period.name}</option>
                      ))}
                     </select>
                 </div>

                 {/* Buttons to submit or cancel */}
                 <div className='flex justify-end space-x-2'>
                    <button type="button" onClick={onClose} className={`px-4 py-${reservation ? '2' : '3'} bg-gray-${reservation ? '200' : '500'} text-gray-${reservation ? '800' : 'white'} rounded hover:bg-${reservation ? 'gray' : 'blue'}-${reservation ? '300' : '600'}`}>
                        Annuler
                    </button>

                    {/* Submit button */}
                    <button type='submit' className='px-3 py-3 bg-blue-600 text-white rounded hover:bg-blue-700'>
                        Valider
                    </button> 
                  </div> 
                </form> 
              </div> 
            </div> 
          ); 
      };
      
      export default ReservationModal; 