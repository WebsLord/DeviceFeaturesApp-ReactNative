import { View, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

export default function CameraScreen() {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    // Galeri izni iste
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission required');
      return;
    }

    // Galeriyi aç
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // PDF'te eksik olabilir, eklemek güvenlidir
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // Başarılı seçimde titreşim ver (Medium impact)
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const takePhoto = async () => {
    // Kamera izni iste
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Camera permission required');
      return;
    }

    // Kamerayı aç
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // Başarılı çekimde bildirim titreşimi ver (Success)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick from Gallery" onPress={pickImage} />
      <Button title="Take Photo" onPress={takePhoto} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 20,
    justifyContent: 'center', // Butonları ortalamak için
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 20,
    resizeMode: 'contain', // Resmin oranını koruması için
  },
});