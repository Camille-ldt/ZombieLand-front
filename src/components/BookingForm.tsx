import React, { useState, useEffect } from 'react';

interface BookingFormProps {
  startDate: Date | null;
  endDate: Date | null;
  periods: { id: number; name: string; date_start: string; date_end: string; price: number }[];
}

const BookingForm: React.FC<BookingFormProps> = ({ startDate, endDate, periods }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (startDate && endDate) {
      const daysSelected = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;

      const selectedDates = Array.from({ length: daysSelected }, (_, i) =>
        new Date(startDate.getTime() + i * (1000 * 60 * 60 * 24))
      );

      const totalCost = selectedDates.reduce((acc, date) => {
        const period = periods.find(
          (p) =>
            new Date(p.date_start) <= date && date <= new Date(p.date_end)
        );
        return acc + (period ? period.price : 0);
      }, 0);

      setTotalPrice(totalCost * ticketCount);
    }
  }, [startDate, endDate, ticketCount, periods]);

  const handleTicketCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTicketCount(Number(event.target.value));
  };

  return (
    <form className="bg-black p-4 rounded shadow-md w-[50%]">
      <div className="mb-4">
        <label htmlFor="start-date" className="block text-sm font-medium text-white">
          Date de début
        </label>
        <input
          type="text"
          id="start-date"
          className="mt-1 block w-full rounded-md border-white shadow-sm"
          value={startDate ? startDate.toLocaleDateString() : ''}
          readOnly
        />
      </div>

      <div className="mb-4">
        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 text-white">
          Date de fin
        </label>
        <input
          type="text"
          id="end-date"
          className="mt-1 block w-full rounded-md border-white shadow-sm"
          value={endDate ? endDate.toLocaleDateString() : ''}
          readOnly
        />
      </div>

      <div className="mb-4">
        <label htmlFor="ticket-count" className="block text-sm font-medium text-white">
          Nombre de billets
        </label>
        <input
          type="number"
          id="ticket-count"
          className="mt-1 block w-full rounded-md border-white shadow-sm"
          value={ticketCount}
          min="1"
          onChange={handleTicketCountChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="total-price" className="block text-sm font-medium text-white">
          Montant total
        </label>
        <input
          type="text"
          id="total-price"
          className="mt-1 block w-full rounded-md border-white shadow-sm"
          value={`${totalPrice}€`}
          readOnly
        />
      </div>
    </form>
  );
};

export default BookingForm;
