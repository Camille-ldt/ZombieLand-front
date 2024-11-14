import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import BookingForm from "../components/BookingForm";
import { getDatas } from "../services/api";
import { Title } from "../components/Title";

interface Period {
  id: number;
  name: string;
  date_start: string;
  date_end: string;
  price: number;
}

const UserReservation: React.FC = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [numberOfTickets, setNumberOfTickets] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const periodsData = await getDatas("/periods");
        setPeriods(periodsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des périodes", error);
      }
    };

    fetchPeriods();
  }, []);

  const handleDateSelect = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate && date > startDate) {
      setEndDate(date);
    } else {
      setStartDate(date);
    }
  };

  const calculateTotalAmount = () => {
    if (startDate && endDate) {
      const period = periods.find(
        (period) =>
          startDate >= new Date(period.date_start) &&
          endDate <= new Date(period.date_end)
      );

      if (period) {
        const numberOfDays =
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
          ) + 1;
        const total = numberOfDays * period.price * numberOfTickets;
        setTotalAmount(total);
      }
    } else {
      setTotalAmount(0);
    }
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [startDate, endDate, numberOfTickets]);

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfTickets(Number(e.target.value));
  };

  const handleSubmit = () => {
    console.log("Réservation soumise", {
      startDate,
      endDate,
      numberOfTickets,
      totalAmount,
    });
  };

  if (!periods || periods.length === 0) {
    return <div>Chargement des périodes...</div>;
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Titre */}
      <div className="text-center pt-10 px-4 sm:px-10 md:px-20">
        <Title>Calendrier</Title>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-10 px-4 sm:px-10 md:px-20 mt-10 grow pb-20">
        {/* Calendrier */}
        <div className="flex-1 max-w-full md:max-w-[50%] flex justify-center">
          <Calendar
            periods={periods}
            onDateSelect={handleDateSelect}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        {/* Formulaire */}
        <div className="flex-1 w-[90%] sm:w-[90%] md:w-[50%] flex justify-center items-center mx-auto">
  <BookingForm
    startDate={startDate}
    endDate={endDate}
    periods={periods}
    totalAmount={totalAmount}
    numberOfTickets={numberOfTickets}
    onTicketChange={handleTicketChange}
    onSubmit={handleSubmit}
  />
</div>

      </div>
    </div>
  );
};

export default UserReservation;
