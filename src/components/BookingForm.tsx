import React from "react";

interface Period {
  id: number;
  name: string;
  date_start: string;
  date_end: string;
  price: number;
}

interface BookingFormProps {
  startDate: Date | null;
  endDate: Date | null;
  periods: Period[];
  totalAmount: number;
  numberOfTickets: number;
  onTicketChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;  // Nouvelle prop pour la soumission du formulaire
}

const BookingForm: React.FC<BookingFormProps> = ({
  startDate,
  endDate,
  periods,
  totalAmount,
  numberOfTickets,
  onTicketChange,
  onSubmit,
}) => {
  return (
    <div className="bg-black text-white p-5 rounded-lg shadow-lg w-full max-w-md mx-auto mt-5">
      <h2 className="text-2xl font-semibold mb-4 text-center">Réservation</h2>

      {startDate && endDate ? (
        <div className="mt-5 text-center">
          <p>
            Dates sélectionnées:{" "}
            <strong>{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</strong>
          </p>
        </div>
      ) : (
        <div className="mt-5 text-center">
          <p>Aucune date sélectionnée.</p>
        </div>
      )}

      <div className="mt-5 w-full">
        <label htmlFor="tickets" className="block text-sm font-medium text-center">
          Nombre de billets
        </label>
        <input
          id="tickets"
          type="number"
          value={numberOfTickets}
          onChange={onTicketChange}
          className="mt-1 p-2 border border-gray-300 text-black rounded-md w-full"
          min="1"
        />
      </div>

      <div className="mt-5 text-center">
        <p className="text-lg font-semibold">Montant total: {totalAmount}€</p>
      </div>

      <div className="mt-5 w-full">
        <button
          onClick={onSubmit}  // Gérer la soumission ici
          type="button"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Réserver
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
