import React, { useState } from 'react';
import { View } from 'react-native';
import DatePicker from '../components/DatePicker';
import MyCalendar from '../components/Calendar';

const HomeScreen: React.FC = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [periodDates, setPeriodDates] = useState<string[]>([]);
  const [fertileWindow, setFertileWindow] = useState<string[]>([]);
  const [ovulationDate, setOvulationDate] = useState<string | null>(null);

  const handleDateChange = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setStartDate(formattedDate);
    calculatePeriodDates(date);
  };

  const calculatePeriodDates = (date: Date) => {
    const periodLength = 5; // default period length
    const fertileWindowLength = 9; // fertile window starts 9 days after menstruation
    const ovulationOffset = 14; // ovulation 14 days after menstruation

    const periodStart = new Date(date);
    const periodEnd = new Date(date);
    periodEnd.setDate(periodStart.getDate() + periodLength - 1);

    const fertileStart = new Date(date);
    fertileStart.setDate(fertileStart.getDate() + fertileWindowLength);
    const fertileEnd = new Date(date);
    fertileEnd.setDate(fertileEnd.getDate() + fertileWindowLength + 5); // Fertile window ends 1 day after ovulation

    const ovulation = new Date(date);
    ovulation.setDate(ovulation.getDate() + ovulationOffset);

    const periodDatesArray: string[] = [];
    const fertileWindowArray: string[] = [];

    for (let d = new Date(periodStart); d <= periodEnd; d.setDate(d.getDate() + 1)) {
      periodDatesArray.push(formatDate(d));
    }

    for (let d = new Date(fertileStart); d <= fertileEnd; d.setDate(d.getDate() + 1)) {
      fertileWindowArray.push(formatDate(d));
    }

    setPeriodDates(periodDatesArray);
    setFertileWindow(fertileWindowArray);
    setOvulationDate(formatDate(ovulation));
  };

  // Helper function to format dates
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  return (
    <View>
      <DatePicker onDateChange={handleDateChange} />
      <MyCalendar
        startDate={startDate}
        periodDates={periodDates}
        fertileWindow={fertileWindow}
        ovulationDate={ovulationDate}
      />
    </View>
  );
};

export default HomeScreen;
