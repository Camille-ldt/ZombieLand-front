import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addDays,
  getDay,
  isSameDay,
  isAfter,
  isWithinInterval,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface Period {
  id: number;
  name: string;
  date_start: string;
  date_end: string;
  price: number;
}

interface CalendarProps {
    periods: Period[];
    onDateSelect: (date: Date) => void;
    startDate: Date | null;
    endDate: Date | null;
  }

const periodColors: { [key: string]: string } = {
  'Basse saison': 'bg-green-200',
  'Moyenne saison': 'bg-yellow-200',
  'Haute saison': 'bg-red-200',
};
const selectedRangeColor = 'bg-blue-300'; // Couleur pour la plage de dates sélectionnée

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const Calendar: React.FC<CalendarProps> = ({ periods, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 1)); // Novembre 2024
  const [startDate, setStartDate] = useState<Date | null>(null); // Date de début de séjour
  const [endDate, setEndDate] = useState<Date | null>(null); // Date de fin de séjour

  const getPeriodForDate = (date: Date): Period | undefined => {
    return periods.find(
      (period) =>
        date >= new Date(period.date_start) && date <= new Date(period.date_end)
    );
  };

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });

    const startDay = getDay(start);
    const daysToAdd = startDay === 0 ? 6 : startDay - 1; // Ajuster pour commencer le lundi

    const previousMonthDays = Array.from({ length: daysToAdd }, (_, i) =>
      addDays(start, -daysToAdd + i)
    );

    return [...previousMonthDays, ...days];
  };

  const days = getDaysInMonth(currentDate);

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    if (startDate && isSameDay(startDate, date)) {
      setStartDate(null);
      setEndDate(null);
    } else if (endDate && isSameDay(endDate, date)) {
      setStartDate(null);
      setEndDate(null);
    } else if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (isAfter(date, startDate)) {
        setEndDate(date);
      } else {
        setStartDate(date);
      }
    }
  };

  const isWithinRange = (day: Date) => {
    return startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate });
  };

  return (
    <body className="bg-black w-[100%] h-[100%]">
      <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
        <div className="md:pr-14">
          <div className="flex items-center">
            <h2 className="flex-auto text-sm font-semibold text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goToNextMonth}
              className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-white">
            <div>L</div>
            <div>M</div>
            <div>M</div>
            <div>J</div>
            <div>V</div>
            <div>S</div>
            <div>D</div>
          </div>
          <div className="mt-2 grid grid-cols-7 text-sm">
            {days.map((day) => {
              const period = getPeriodForDate(day);
              const isSelectedStart = startDate && isSameDay(startDate, day);
              const isSelectedEnd = endDate && isSameDay(endDate, day);
              const isInRange = isWithinRange(day);

              return (
                <div key={day.toString()} className="py-2">
                  <button
                    type="button"
                    onClick={() => handleDateClick(day)}
                    className={classNames(
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                      period ? periodColors[period.name] : '',
                      isToday(day) ? 'bg-indigo-600 text-white' : '',
                      isSelectedStart || isSelectedEnd || isInRange ? selectedRangeColor : '',
                      isSameMonth(day, currentDate) ? 'text-gray-900' : 'text-gray-400'
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                  </button>
                  {period && isSameMonth(day, currentDate) && (
                    <div className="text-xs mt-1 text-center text-white">{period.price}€</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <section className="mt-12 md:mt-0 md:pl-14">
          <h2 className="text-base font-semibold text-white">Légende des périodes</h2>
          <div className="mt-6 space-y-6">
            {Object.entries(periodColors).map(([name, color]) => (
              <div key={name} className="flex items-center">
                <div className={`w-4 h-4 ${color} rounded-full mr-2`}></div>
                <span className="text-sm text-gray-700 text-white">{name}</span>
              </div>
            ))}
            <div className="flex items-center">
              <div className={`w-4 h-4 ${selectedRangeColor} rounded-full mr-2`}></div>
              <span className="text-sm text-gray-700 text-white">Plage de séjour sélectionnée</span>
            </div>
          </div>
        </section>
      </div>
    </body>
  );
};

export default Calendar;
