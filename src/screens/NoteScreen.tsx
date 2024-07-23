// src/screens/NoteScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Note {
  title: string;
  text: string;
  dateCreated: string;
  dateEdited: string;
}

const NoteScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    }
  };

  const handleSaveNote = async () => {
    if (newTitle.trim() !== '' && newNote.trim() !== '') {
      const newNotes = [
        ...notes,
        {
          title: newTitle,
          text: newNote,
          dateCreated: new Date().toLocaleString(),
          dateEdited: new Date().toLocaleString(),
        },
      ];
      try {
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
        setNotes(newNotes);
        setNewNote('');
        setNewTitle('');
        setIsAddingNote(false);
      } catch (error) {
        console.error('Erro ao salvar nota:', error);
      }
    }
  };

  const handleEditNote = async () => {
    if (selectedNote) {
      const updatedNotes = notes.map(note =>
        note.dateCreated === selectedNote.dateCreated
          ? { ...note, title: newTitle, text: newNote, dateEdited: new Date().toLocaleString() }
          : note
      );
      try {
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
        setSelectedNote(null);
        setIsEditingNote(false);
      } catch (error) {
        console.error('Erro ao editar nota:', error);
      }
    }
  };

  const handleDeleteNote = async (noteToDelete: Note) => {
    const newNotes = notes.filter(note => note.dateCreated !== noteToDelete.dateCreated);
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
      setNotes(newNotes);
      if (isEditingNote) {
        setIsEditingNote(false);
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Erro ao deletar nota:', error);
    }
  };

  return (
    <View style={styles.container}>
      {!isAddingNote && !isEditingNote && (
        <>
          <FlatList
            data={notes}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.noteCard}
                onPress={() => {
                  setSelectedNote(item);
                  setNewTitle(item.title);
                  setNewNote(item.text);
                  setIsEditingNote(true);
                }}
              >
                <Text style={styles.noteTitle}>{item.title}</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.noteText}>
                  {item.text}
                </Text>
                <Text style={styles.noteDate}>Última edição: {item.dateEdited}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.dateCreated}
            numColumns={2} // Display 2 columns
          />
          <Button title="Adicionar Nota" onPress={() => setIsAddingNote(true)} />
        </>
      )}

      {(isAddingNote || isEditingNote) && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={isAddingNote || isEditingNote}
          onRequestClose={() => {
            setIsAddingNote(false);
            setIsEditingNote(false);
          }}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Digite o título aqui"
            />
            <TextInput
              style={styles.input}
              value={newNote}
              onChangeText={setNewNote}
              placeholder="Digite sua nota aqui"
              multiline
            />
            <Button
              title={isAddingNote ? "Salvar Nota" : "Salvar Edição"}
              onPress={isAddingNote ? handleSaveNote : handleEditNote}
            />
            <Button
              title="Cancelar"
              onPress={() => {
                setIsAddingNote(false);
                setIsEditingNote(false);
              }}
            />
            {isEditingNote && selectedNote && (
              <Button
                title="Deletar Nota"
                onPress={() => handleDeleteNote(selectedNote)}
              />
            )}
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noteCard: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    flex: 1,
    minWidth: '40%',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 16,
    color: '#333',
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default NoteScreen;
