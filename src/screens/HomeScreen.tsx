import React, { useState } from 'react';
import { View, Button, Modal, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import DatePicker from '../components/DatePicker';
import MyCalendar from '../components/Calendar';

const HomeScreen: React.FC = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [periodDates, setPeriodDates] = useState<string[]>([]);
  const [fertileWindow, setFertileWindow] = useState<string[]>([]);
  const [ovulationDate, setOvulationDate] = useState<string | null>(null);

  // States for modal data
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sexualActivity, setSexualActivity] = useState<{protected: boolean, unprotected: boolean}>({protected: false, unprotected: false});
  const [feelings, setFeelings] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [contraceptive, setContraceptive] = useState<{today: boolean, yesterday: boolean, none: boolean}>({today: false, yesterday: false, none: false});
  const [notes, setNotes] = useState('');

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

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const handleSave = () => {
    // Save the data (sexualActivity, feelings, symptoms, contraceptive, notes) for the selected date
    // Implement your logic here
    setModalVisible(false);
  };

  const toggleSexualActivity = (activity: 'protected' | 'unprotected') => {
    setSexualActivity((prev) => ({
      ...prev,
      [activity]: !prev[activity],
    }));
  };

  const toggleContraceptive = (option: 'today' | 'yesterday' | 'none') => {
    setContraceptive((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const toggleFeeling = (feeling: string) => {
    setFeelings((prev) => {
      if (prev.includes(feeling)) {
        return prev.filter((f) => f !== feeling);
      } else {
        return [...prev, feeling];
      }
    });
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) => {
      if (prev.includes(symptom)) {
        return prev.filter((s) => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const emotions = ['normal', 'triste', 'feliz', 'emotiva', 'depressiva', 'exausta', 'estressada'];
  const symptomOptions = ['acne', 'piriri', 'dor abdominal', 'dor de cabeça', 'dor nas costas', 'enxaqueca'];

  return (
    <View>
      <DatePicker onDateChange={handleDateChange} />
      <MyCalendar
        startDate={startDate}
        periodDates={periodDates}
        fertileWindow={fertileWindow}
        ovulationDate={ovulationDate}
        onDayPress={handleDayPress}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView>
          <View style={styles.modalContent}>
            <Text>Data: {selectedDate}</Text>
            <Text>Atividade Sexual</Text>
            <View style={styles.sexualActivityContainer}>
              <TouchableOpacity
                style={[
                  styles.sexualActivityButton,
                  sexualActivity.protected && styles.selectedButton
                ]}
                onPress={() => toggleSexualActivity('protected')}
              >
                <Text style={styles.buttonText}>Protegido</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sexualActivityButton,
                  sexualActivity.unprotected && styles.selectedButton
                ]}
                onPress={() => toggleSexualActivity('unprotected')}
              >
                <Text style={styles.buttonText}>Desprotegido</Text>
              </TouchableOpacity>
            </View>
            <Text>Emoções</Text>
            <ScrollView horizontal style={styles.emotionsContainer}>
              {emotions.map((emotion) => (
                <TouchableOpacity
                  key={emotion}
                  style={[
                    styles.emotionButton,
                    feelings.includes(emotion) && styles.selectedButton
                  ]}
                  onPress={() => toggleFeeling(emotion)}
                >
                  <Text style={styles.buttonText}>{emotion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text>Sintomas</Text>
            <ScrollView horizontal style={styles.emotionsContainer}>
              {symptomOptions.map((symptom) => (
                <TouchableOpacity
                  key={symptom}
                  style={[
                    styles.emotionButton,
                    symptoms.includes(symptom) && styles.selectedButton
                  ]}
                  onPress={() => toggleSymptom(symptom)}
                >
                  <Text style={styles.buttonText}>{symptom}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text>Anticoncepcional</Text>
            <View style={styles.contraceptiveContainer}>
              <TouchableOpacity
                style={[
                  styles.contraceptiveButton,
                  contraceptive.today && styles.selectedButton
                ]}
                onPress={() => toggleContraceptive('today')}
              >
                <Text style={styles.buttonText}>Hoje</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.contraceptiveButton,
                  contraceptive.yesterday && styles.selectedButton
                ]}
                onPress={() => toggleContraceptive('yesterday')}
              >
                <Text style={styles.buttonText}>Ontem</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.contraceptiveButton,
                  contraceptive.none && styles.selectedButton
                ]}
                onPress={() => toggleContraceptive('none')}
              >
                <Text style={styles.buttonText}>Não tem</Text>
              </TouchableOpacity>
            </View>
            <Text>Anotação</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="..."
              multiline
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <Button title="Salvar" onPress={handleSave} />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  sexualActivityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
},
sexualActivityButton: {
  padding: 10,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#ccc',
},
selectedButton: {
  backgroundColor: '#ccc',
},
buttonText: {
  color: '#000',
},
emotionsContainer: {
  flexDirection: 'row',
  marginBottom: 10,
},
emotionButton: {
  padding: 10,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#ccc',
  marginHorizontal: 5,
},
contraceptiveContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginBottom: 10,
},
contraceptiveButton: {
  padding: 10,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#ccc',
},
});

export default HomeScreen;
