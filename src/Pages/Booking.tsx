//Import des éléments nécessaires
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import BookingForm from "../components/BookingForm";
import { getDatas } from "../services/api";
import { Title } from "../components/Title";

//Interface pour définir la période
interface Period {
  id: number;
  name: string;
  date_start: string;
  date_end: string;
  price: number;
}

//déclare un composant fonctionnel React nommé UserReservation.
const UserReservation: React.FC = () => {
  //Crée un état periods pour stocker un tableau de périodes.
  const [periods, setPeriods] = useState<Period[]>([]);
  //Crée un état startDate pour la date de début de la réservation.
  const [startDate, setStartDate] = useState<Date | null>(null);
  //Similaire à startDate, mais pour la date de fin de la réservation.
  const [endDate, setEndDate] = useState<Date | null>(null);
  //Crée un état numberOfTickets pour le nombre de billets.
  const [numberOfTickets, setNumberOfTickets] = useState<number>(1);
  //Crée un état totalAmount pour le montant total de la réservation.
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    //Fetch à l'API pour récupérer toutes les périodes de la base de donnée
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

  //gérer la sélection des dates dans le composant UserReservation.
  const handleDateSelect = (start: Date | null, end: Date | null) => {
    //Mise à jour de la date de début
    setStartDate(start);
    //Mise à jour de la date de fin
    setEndDate(end);
  };

  //calculer le montant total d'une réservation en fonction des dates sélectionnées, du nombre de billets, et des périodes tarifaires
  const calculateTotalAmount = () => {
    //Cas où une plage de dates est sélectionnée 
    if (startDate && endDate) {
      //Elle cherche une période qui englobe entièrement la plage de dates sélectionnée.
      //Si une telle période est trouvée : Elle calcule le nombre de jours entre startDate et endDate (inclus).
      //Elle multiplie ce nombre de jours par le prix de la période et le nombre de billets.
      //Elle met à jour totalAmount avec ce résultat.
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
      //Cas où seule une date de début est sélectionnée :
      //Elle cherche la période correspondant à la date de début.
      //Si une période est trouvée :
      //Elle calcule le total en multipliant le prix de la période par le nombre de billets.
      //Elle met à jour totalAmount avec ce résultat.
    } else if (startDate) {
      const period = periods.find(
        (period) =>
          startDate >= new Date(period.date_start) &&
          startDate <= new Date(period.date_end)
      );

      if (period) {
        setTotalAmount(period.price * numberOfTickets);
      }
      //Si aucune date n'est sélectionnée : Elle met totalAmount à 0.
    } else {
      setTotalAmount(0);
    }
  };

  //recalculer le montant total de la réservation chaque fois que certaines dépendances changent. 
  useEffect(() => {
    calculateTotalAmount();
  }, [startDate, endDate, numberOfTickets]);

  //Permet de gérer les changements de nombres de billets
  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfTickets(Number(e.target.value));
  };

  //Gère la soumission de la réservation
  const handleSubmit = () => {
    console.log("Réservation soumise", {
      startDate,
      endDate,
      numberOfTickets,
      totalAmount,
    });
  };

  //Gère le cas ou aucune période n'est trouvée
  if (!periods || periods.length === 0) {
    return <div>Chargement des périodes...</div>;
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="text-center pt-10 px-4 sm:px-10 md:px-20">
        <Title>Calendrier</Title>
      </div>

      <div className="flex flex-col xl:flex-row justify-center items-start gap-10 px-4 sm:px-10 md:px-20 mt-10 grow pb-20">
        <div className="w-full xl:w-[60%] flex justify-center">
          <Calendar
            periods={periods}
            onDateSelect={handleDateSelect}
            startDate={startDate}
            endDate={endDate}
            numberOfTickets={numberOfTickets}
          />
        </div>

        <div className="w-full xl:w-[35%] flex justify-center mt-10 xl:mt-0">
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