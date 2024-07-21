// src/types.ts
import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  NotFound: undefined;
};

export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

export interface CalendarProps {
  startDate: string | null;
}

export interface DatePickerProps {
  onDateChange: (date: Date) => void;
}

export interface DateObject {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

export interface DayPressEvent {
  dateString: string;
  day: number;
  month: number;
  year: number;
}
