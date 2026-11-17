import { ThemedView } from '@/presentation/components';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const MapScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <MapView
        style={styles.map}
        // showsPointsOfInterests={false}
        //10.203805, -64.638228
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 10.203805,
          longitude: -64.638228,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            // 10.20439177676589, -64.63794495499742
            latitude: 10.20439177676589,
            longitude: -64.63794495499742,
          }}
          title="Edif. Los Roques"
          description="Edificio muy viejo ubicado en la Av. Bolivar."
        />

        <Marker
          coordinate={{
            //10.212978736214628, -64.64030202273565
            latitude: 10.212978736214628,
            longitude: -64.64030202273565,
          }}
          title="Panaderia"
          description="El rincon del Pan C.A."
        />
      </MapView>
    </ThemedView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
