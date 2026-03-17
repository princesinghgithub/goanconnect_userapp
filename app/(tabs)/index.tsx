import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type Coords = {
  latitude: number;
  longitude: number;
};

export default function UserHome() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // 1️⃣ Permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          return;
        }

        // 2️⃣ Try last known location (FAST)
        const last = await Location.getLastKnownPositionAsync();
        if (last) {
          setCoords({
            latitude: last.coords.latitude,
            longitude: last.coords.longitude,
          });
          return;
        }

        // 3️⃣ Fallback: get current position
        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setCoords({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
      } catch (e) {
        // 4️⃣ FINAL fallback (Delhi)
        setCoords({
          latitude: 28.6139,
          longitude: 77.2090,
        });
      }
    })();
  }, []);

  if (!coords) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>{error ?? 'Fetching location...'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={coords} title="You are here" />
      </MapView>

      {/* Ola/Uber style search box */}
      <View style={styles.searchBox}>
        <Text style={styles.label}>Pickup</Text>
        <Text style={styles.input}>Current Location</Text>

        <Text style={styles.label}>Drop</Text>
        <Text style={styles.input}>Enter destination</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Book Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    position: 'absolute',
    top: 50,
    left: 15,
    right: 15,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 12,
    color: '#555',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 6,
    marginBottom: 10,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});
