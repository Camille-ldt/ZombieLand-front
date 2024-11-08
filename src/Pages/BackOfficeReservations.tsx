import { useEffect, useState } from "react";
import { getDatas, createData, deleteData, updateData } from '../services/api';
import Aside from "../components/Aside";
import ReservationModal from "../components/ReservationModal";

interface Reservation {
  id: number;
  date_start: string;
  date_end: string;
  number_tickets: number;
  user_id: number;
  period_id: number;
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

interface ReservationFormData {
  id?: number; // optionnel pour la création
  date_start: string; // format "yyyy-MM-dd"
  date_end: string; // format "yyyy-MM-dd"
  number_tickets: number;
  user_id: number;
  period_id: number;
}

const BackOfficeReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedReservations, setSelectedReservations] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservationToEdit, setReservationToEdit] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservationsData, usersData, periodsData] = await Promise.all([
          getDatas("/bookings"),
          getDatas("/users"),
          getDatas("/periods")
        ]);
        setReservations(reservationsData);
        setUsers(usersData);
        setPeriods(periodsData);

        // Logs pour le débogage
        console.log("Utilisateurs récupérés:", usersData);
        console.log("Réservations récupérées:", reservationsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };
    fetchData();
  }, []);

  const handleSelectionChange = (id: number) => {
    setSelectedReservations(prev =>
      prev.includes(id) ? prev.filter(reservationId => reservationId !== id) : [...prev, id]
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredReservations = reservations.filter(reservation => {
    // Chercher l'utilisateur et la période associés à la réservation
    const user = users.find(user => user.id === reservation.user_id);
    const period = periods.find(period => period.id === reservation.period_id);

    // Appliquer les filtres de période
    const matchesPeriodFilter = selectedPeriod === "all" || reservation.period_id.toString() === selectedPeriod;

    // Vérification de la recherche dans le nom de l'utilisateur et le nom de la période
    const matchesSearchFilter = searchTerm === "" || (
      // Recherche dans le prénom et nom de l'utilisateur
      (user && (
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase())
      )) ||
      // Recherche dans le nom de la période
      (period?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      // Recherche dans les dates
      reservation.date_start.includes(searchTerm) ||
      reservation.date_end.includes(searchTerm)
    );

    return matchesPeriodFilter && matchesSearchFilter;
  });

  const handleCreateReservation = async (newReservation: ReservationFormData) => {
    try {
      console.log('Données envoyées au serveur :', newReservation);
      const createdReservation = await createData('/bookings', newReservation);
      console.log('Réservation créée :', createdReservation);
      setReservations(prevReservations => [...prevReservations, createdReservation]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
    }
  };

  const handleEditClick = () => {
    if (selectedReservations.length === 1) {
      const reservationToEdit = reservations.find(reservation => reservation.id === selectedReservations[0]);
      console.log("Reservation sélectionnée pour l'édition:", reservationToEdit);
      if (reservationToEdit) {
        setReservationToEdit(reservationToEdit);
        setIsModalOpen(true);
      }
    }
  };

  const handleUpdateReservation = async (updatedReservation: ReservationFormData) => {
    try {
      if (updatedReservation.id) {
        const updatedReservationFromServer = await updateData('/bookings', updatedReservation.id, updatedReservation);
        setReservations(prevReservations => prevReservations.map(reservation =>
          reservation.id === updatedReservationFromServer.id ? updatedReservationFromServer : reservation
        ));
        setIsModalOpen(false);
        setReservationToEdit(null);
        setSelectedReservations([]);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réservation:", error);
    }
  };

  const handleDeleteSelectedReservations = async () => {
    if (selectedReservations.length === 0) {
      alert("Veuillez sélectionner au moins une réservation à supprimer");
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReservations.length} réservation(s)?`)) {
      try {
        for (const reservationId of selectedReservations) {
          await deleteData('/bookings', reservationId);
        }
        setReservations(prevReservations => prevReservations.filter(reservation => !selectedReservations.includes(reservation.id)));
        setSelectedReservations([]);
        console.log('Réservations supprimées avec succès');
      } catch (error) {
        console.error("Erreur lors de la suppression des réservations:", error);
      }
    }
  };

  console.log(reservationToEdit);

  return (
    <div className="flex h-screen bg-gray-100">
      <Aside />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Administration des Réservations</h1>
          <div className="mb-4 flex space-x-4">
            <input
              type="text"
              placeholder="Rechercher une réservation..."
              className="px-4 py-2 border rounded-md flex-grow"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <select
              className="px-4 py-2 border rounded-md w-1/5"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="all">Toutes les périodes</option>
              {periods.map(period => (
                <option key={period.id} value={period.id.toString()}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex space-x-4 justify-end ">
            <button
              type="button"
              className="bg-gray-600 text-white rounded p-2 hover:bg-gray-700"
              onClick={() => { 
                setIsModalOpen(true); 
                setReservationToEdit(null); // Reset pour nouvelle réservation
              }}
            >
              Créer
            </button>
            <button
              type="button"
              className="bg-gray-600 text-white rounded p-2 hover:bg-gray-700"
              onClick={handleEditClick}
              disabled={selectedReservations.length !== 1}
            >
              Modifier
            </button>
            <button
              type="button"
              className="bg-gray-600 text-white rounded p-2 hover:bg-gray-700"
              onClick={handleDeleteSelectedReservations}
              disabled={selectedReservations.length === 0}
            >
              Supprimer
            </button>
          </div>
          <ReservationModal
            isOpen={isModalOpen}
            onClose={() => { 
              setIsModalOpen(false); 
              setReservationToEdit(null); 
            }}
            onSubmit={reservationToEdit ? handleUpdateReservation : handleCreateReservation}
            periods={periods}
            users={users}
            reservation={reservationToEdit}
          />
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th>ID</th>
                  <th>Date de début</th>
                  <th>Date de fin</th>
                  <th>Nombre de tickets</th>
                  <th>Utilisateur</th>
                  <th>Période</th>
                  <th>Sélection</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => {
                  const user = users.find(user => user.id === reservation.user_id);
                  const period = periods.find(period => period.id === reservation.period_id);
                  return (
                    <tr key={reservation.id}>
                      <td className="text-center">{reservation.id}</td>
                      <td className="text-center">{new Date(reservation.date_start).toLocaleDateString()}</td>
                      <td className="text-center">{new Date(reservation.date_end).toLocaleDateString()}</td>
                      <td className="text-center">{reservation.number_tickets}</td>
                      <td className="text-center">{user?.firstname} {user?.lastname}</td>
                      <td className="text-center">{period?.name}</td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={selectedReservations.includes(reservation.id)}
                          onChange={() => handleSelectionChange(reservation.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackOfficeReservations;
