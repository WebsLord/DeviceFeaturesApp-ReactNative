import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';

// Bildirimlerin ön planda (uygulama açıkken) nasıl görüneceğini ayarlıyoruz
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function LocationScreen() {
  const [coords, setCoords] = useState(null);

  const getLocation = async () => {
    // 1. Konum izni iste
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location permission required');
      return;
    }

    // 2. Mevcut konumu al
    const location = await Location.getCurrentPositionAsync({});
    setCoords(location.coords);

    // 3. Bildirim izni iste ve bildirim gönder
    const notifStatus = await Notifications.requestPermissionsAsync();
    
    if (notifStatus.status === 'granted') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Location Retrieved',
          body: 'Your GPS location was successfully fetched.',
        },
        trigger: null, // null = hemen gönder
      });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Get Current Location" onPress={getLocation} />
      
      {coords && (
        <Text style={styles.text}>
          Lat: {coords.latitude} {"\n"}
          Lng: {coords.longitude}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});