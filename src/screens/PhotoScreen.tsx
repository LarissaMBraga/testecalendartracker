import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, FlatList, TouchableOpacity, StyleSheet, TextInput, Platform, Modal, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PHOTO_KEY = 'photos'; // Key for storing photos in AsyncStorage

const PhotoScreen: React.FC = () => {
  const [photos, setPhotos] = useState<{ uri: string; caption?: string }[]>([]);
  const [addingPhoto, setAddingPhoto] = useState<boolean>(false);
  const [newCaption, setNewCaption] = useState<string>('');
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);
  const [selectedPhotoCaption, setSelectedPhotoCaption] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Desculpe, precisamos de permissões para acessar a galeria de fotos.');
          return;
        }
        // Fetch existing photos from AsyncStorage
        try {
          const savedPhotos = await AsyncStorage.getItem(PHOTO_KEY);
          if (savedPhotos) {
            setPhotos(JSON.parse(savedPhotos));
          }
        } catch (error) {
          console.error('Error fetching photos from AsyncStorage:', error);
        }
      }
    };

    fetchPhotos();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAddingPhoto(true);
      setSelectedPhotoUri(result.assets[0].uri!);
    }
  };

  const addCaption = () => {
    if (selectedPhotoUri) {
      setPhotos([...photos, { uri: selectedPhotoUri, caption: newCaption }]);
      setSelectedPhotoUri(null);
      setNewCaption('');
      setAddingPhoto(false);
    }
  };

  const removePhoto = (uri: string) => {
    setPhotos(photos.filter(photo => photo.uri !== uri));
  };

  const handleDone = async () => {
    try {
      await AsyncStorage.setItem(PHOTO_KEY, JSON.stringify(photos));
      alert('Fotos adicionadas à galeria do aplicativo!');
    } catch (error) {
      console.error('Error saving photos to AsyncStorage:', error);
    }
  };

  const renderItem = ({ item }: { item: { uri: string; caption?: string } }) => (
    <View style={styles.photoItem}>
      <TouchableOpacity onPress={() => { setSelectedPhotoUri(item.uri); setSelectedPhotoCaption(item.caption || ''); setModalVisible(true); }}>
        <Image source={{ uri: item.uri }} style={styles.photo} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removePhoto(item.uri)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {!addingPhoto ? (
        <>
          <Button title="Adicionar Foto" onPress={pickImage} />
          <FlatList
            data={photos}
            renderItem={renderItem}
            keyExtractor={(item) => item.uri}
            numColumns={2} // Ensure 2 photos per row
            columnWrapperStyle={styles.row}
          />
        </>
      ) : (
        <View style={styles.addPhotoContainer}>
          <Image source={{ uri: selectedPhotoUri! }} style={styles.previewPhoto} />
          <TextInput
            value={newCaption}
            onChangeText={setNewCaption}
            placeholder="Adicionar uma legenda..."
            style={styles.captionInput}
          />
          <TouchableOpacity onPress={addCaption} style={styles.addButton}>
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal for Expanding Photo */}
      {selectedPhotoUri && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Image source={{ uri: selectedPhotoUri }} style={styles.modalImage} />
            {selectedPhotoCaption && (
              <Text style={styles.modalCaption}>{selectedPhotoCaption}</Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
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
  photoItem: {
    position: 'relative',
    margin: 5,
  },
  photo: {
    width: Dimensions.get('window').width / 2 - 20, // Adjust width to fit 2 photos per row with padding
    height: 100,
    borderRadius: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ff6f61',
    padding: 5,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    justifyContent: 'space-between',
  },
  addPhotoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewPhoto: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.7,
    borderRadius: 10,
  },
  modalCaption: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
  },
  closeButtonText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000',
  },
});

export default PhotoScreen;
