import React from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface CalendarProps {
  startDate?: string | null;
  periodDates?: string[];
  fertileWindow?: string[];
  ovulationDate?: string | null;
}

const generateCycleDates = (startDate: Date, cycleLength: number) => {
  const dates: { [key: string]: any } = {};

  // Create dates for a full year of cycles
  for (let i = 0; i < 12; i++) {
    const cycleStart = new Date(startDate);
    cycleStart.setDate(cycleStart.getDate() + i * cycleLength);

    const periodStart = new Date(cycleStart);
    periodStart.setDate(periodStart.getDate());

    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + 4); // period length of 5 days

    const fertileStart = new Date(periodStart);
    fertileStart.setDate(fertileStart.getDate() + 9); // fertile window starts 9 days after period start

    const ovulationDate = new Date(periodStart);
    ovulationDate.setDate(ovulationDate.getDate() + 14); // ovulation occurs 14 days after period start

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1); // fertile window ends 1 day after ovulation

    // Mark period days
    for (let d = new Date(periodStart); d <= periodEnd; d.setDate(d.getDate() + 1)) {
      dates[d.toISOString().split('T')[0]] = {
        marked: true,
        customStyles: {
          container: { backgroundColor: '#FFB6C1', borderRadius: 5 }, // Rosa pastel
          text: { color: '#FFFFFF' }
        }
      };
    }

    // Mark fertile window days
    for (let d = new Date(fertileStart); d <= fertileEnd; d.setDate(d.getDate() + 1)) {
      dates[d.toISOString().split('T')[0]] = {
        marked: true,
        customStyles: {
          container: { backgroundColor: '#87CEFA', borderRadius: 5 }, // Azul claro
          text: { color: '#FFFFFF' }
        }
      };
    }

    // Mark ovulation date
    dates[ovulationDate.toISOString().split('T')[0]] = {
      marked: true,
      customStyles: {
        container: { backgroundColor: '#B0C4DE', borderRadius: 5 }, // Azul mais claro
        text: { color: '#FFFFFF' }
      }
    };
  }

  return dates;
};

const MyCalendar: React.FC<CalendarProps> = ({
  startDate = null,
  periodDates = [],
  fertileWindow = [],
  ovulationDate = null,
}) => {
  const getMarkedDates = () => {
    if (!startDate) return {};

    const startDateObj = new Date(startDate);
    const cycleLength = 28; // default cycle length

    return generateCycleDates(startDateObj, cycleLength);
  };

  return (
    <View>
      <Calendar
        markedDates={getMarkedDates()}
        markingType={'custom'}
        theme={{
          calendarBackground: 'transparent',
          selectedDayBackgroundColor: 'transparent',
          selectedDayTextColor: 'transparent',
          todayTextColor: '#00adf5',
          dayTextColor: '#000000',
          textDisabledColor: '#d9e1e8',
          arrowColor: '#00adf5',
        }}
      />
    </View>
  );
};

export default MyCalendar;
