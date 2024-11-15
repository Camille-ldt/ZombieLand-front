import React from "react";
import { format, isSameDay } from 'date-fns';

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
  onSubmit: () => void;
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
  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <div className="bg-black text-white p-5 rounded-lg shadow-lg w-full max-w-md mx-auto mt-5">
      <h2 className="text-2xl font-semibold mb-4 text-center">Réservation</h2>

      {startDate && (
        <div className="mt-5 text-center">
          <p>
            Dates sélectionnées:{" "}
            <strong>
              {formatDate(startDate)}
              {endDate && !isSameDay(startDate, endDate) && ` - ${formatDate(endDate)}`}
            </strong>
          </p>
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
          onClick={onSubmit}
          type="button"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={!startDate || numberOfTickets < 1}
        >
          Réserver
        </button>
      </div>
    </div>
  );
};

export default BookingForm;