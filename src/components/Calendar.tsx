import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, isSameDay, addDays } from 'date-fns';
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
  onDateSelect: (startDate: Date | null, endDate: Date | null) => void;
  startDate: Date | null;
  endDate: Date | null;
  numberOfTickets: number;
}

const periodColors: { [key: string]: string } = {
  'Basse saison': 'bg-green-200',
  'Moyenne saison': 'bg-orange-200',
  'Haute saison': 'bg-red-200',
};

const selectedRangeColor = 'bg-blue-300';
const selectedDateColor = 'bg-blue-600 text-white';
const todayColor = 'bg-purple-500 text-white';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const Calendar: React.FC<CalendarProps> = ({ periods, onDateSelect, startDate, endDate, numberOfTickets }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 1));
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const getPeriodForDate = (date: Date): Period | undefined => {
    return periods.find(
      (period) => date >= new Date(period.date_start) && date <= new Date(period.date_end)
    );
  };

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });
    const startDay = getDay(start);
    const daysToAdd = startDay === 0 ? 6 : startDay - 1;
    const previousMonthDays = Array.from({ length: daysToAdd }, (_, i) => addDays(start, -daysToAdd + i));
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
    if (startDate && !endDate) {
      if (isSameDay(date, startDate)) {
        onDateSelect(null, null);
      } else if (date < startDate) {
        onDateSelect(date, startDate);
      } else {
        onDateSelect(startDate, date);
      }
    } else if (startDate && endDate) {
      if (isSameDay(date, startDate)) {
        onDateSelect(null, null);
      } else {
        onDateSelect(date, null);
      }
    } else {
      onDateSelect(date, null);
    }
  };

  const calculateTotalPrice = () => {
    if (!startDate) return 0;
    const end = endDate || startDate;
    let total = 0;
    eachDayOfInterval({ start: startDate, end }).forEach((day) => {
      const period = getPeriodForDate(day);
      if (period) total += period.price;
    });
    return total * numberOfTickets;
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [startDate, endDate, numberOfTickets]);

  const getPeriodPrice = (date: Date) => {
    const period = getPeriodForDate(date);
    return period ? `${period.price}€` : '';
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isStartOrEndDate = (date: Date) => {
    return isSameDay(date, startDate) || isSameDay(date, endDate);
  };

  return (
    <div className="bg-black w-screen h-600">
      <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
        <div className="md:pr-14">
          <div className="flex items-center">
            <h2 className="flex-auto text-sm font-semibold text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button type="button" onClick={goToPreviousMonth} className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={goToNextMonth} className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
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
              const isInRange = isDateInRange(day);
              const isSelected = isStartOrEndDate(day);
              const price = getPeriodPrice(day);
              const periodBackgroundColor = period ? periodColors[period.name] : '';
              const backgroundColor = isSelected ? selectedDateColor : isInRange ? selectedRangeColor : periodBackgroundColor;
              const finalBackgroundColor = isToday(day) ? todayColor : backgroundColor;

              return (
                <div key={day.toString()} className="py-2">
                  <button
                    type="button"
                    onClick={() => handleDateClick(day)}
                    className={classNames(
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                      finalBackgroundColor,
                      isToday(day) ? 'text-white' : '',
                      isSameMonth(day, currentDate) ? 'text-gray-900' : 'text-gray-400'
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                  </button>
                  {price && <div className="text-xs mt-1 text-center text-white">{price}</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="md:pl-14 pt-5">
          <h3 className="text-white font-semibold">Légende</h3>
          <ul className="text-white text-xs mt-4 space-y-2">
            <li className="flex items-center">
              <div className="w-4 h-4 bg-red-200 rounded-full mr-2"></div> Haute Saison
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-orange-200 rounded-full mr-2"></div> Moyenne Saison
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-green-200 rounded-full mr-2"></div> Basse Saison
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-blue-300 rounded-full mr-2"></div> Plage de Dates Sélectionnées
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div> Date de Début / Date de Fin
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div> Jour Actuel
            </li>
          </ul>
          
        </div>
      </div>
    </div>
  );
};

export default Calendar;