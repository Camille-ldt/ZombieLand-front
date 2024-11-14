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

    if (!periods || periods.length === 0) {
        return <div>Chargement des périodes...</div>;
    }

    return (
        <body className="bg-black w-screen h-screen">
            <div className="text-center pt-10 sm:px-10 md:px-60">
                <Title>Calendrier</Title>
            </div>
            <div className="flex justify-center items-start space-x-10 px-10 mt-10">
                {/* Calendrier à gauche */}
                <div className="flex-1 max-w-[50%] flex justify-center pl-10">
                    <Calendar 
                        periods={periods} 
                        onDateSelect={handleDateSelect}
                        startDate={startDate}
                        endDate={endDate}
                    />
                </div>
                
                {/* Formulaire à droite */}
                <div className="flex-1 max-w-[50%] flex justify-center">
                    <BookingForm 
                        startDate={startDate} 
                        endDate={endDate} 
                        periods={periods} 
                    />
                </div>
            </div>
        </body>
    );
}

export default UserReservation;
