import { ILatLng } from '@/infrastructure';
import { useLocationStore } from '@/presentation/store';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { FAB } from '../shared/fab';

interface Props extends ViewProps {
  initialLocation: ILatLng;
  showUserLocation?: boolean;
}

export const CustomMap = ({ initialLocation, showUserLocation = false, ...rest }: Props) => {
  const mapRef = useRef<MapView>(null);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [isRouterUser, setIsRouterUser] = useState(false);

  // Selectores individuales: sin ellos, cada actualización del GPS
  // re-renderizaría el MapView aunque no se usara ese campo del store.
  const lastKnownLocation = useLocationStore((state) => state.lastKnownLocation);
  const userLocationList = useLocationStore((state) => state.userLocationList);
  const getLocation = useLocationStore((state) => state.getLocation);

  const moveCamaraToLocation = (latlng: ILatLng) => {
    if (!mapRef.current) return;

    mapRef.current.animateCamera({
      center: latlng,
    });
  };

  const moveToCurrentLocation = async () => {
    moveCamaraToLocation(lastKnownLocation ?? initialLocation);

    try {
      const location = await getLocation();
      moveCamaraToLocation(location);
    } catch (error) {
      // Si el mapa ya está visible, MapScreen no muestra errores: se registra
      // aquí para no dejar la failure silenciosa.
      console.warn('No se pudo obtener la ubicación actual', error);
    }
  };

  useEffect(() => {
    if (lastKnownLocation && isFollowingUser) {
      moveCamaraToLocation(lastKnownLocation);
    }
  }, [lastKnownLocation, isFollowingUser]);

  return (
    <View {...rest}>
      <MapView
        ref={mapRef}
        style={styles.map}
        // showsPointsOfInterests={false}

        onTouchStart={() => setIsFollowingUser(false)}
        showsUserLocation={showUserLocation}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {isRouterUser && (
          <Polyline coordinates={userLocationList} strokeColor={'black'} strokeWidth={5} />
        )}
      </MapView>

      <FAB
        onPress={() => setIsRouterUser(!isRouterUser)}
        style={{ bottom: 180, right: 20 }}
        iconName={isRouterUser ? 'eye-outline' : 'eye-off-outline'}
      />

      <FAB
        onPress={() => setIsFollowingUser(!isFollowingUser)}
        style={{ bottom: 120, right: 20 }}
        iconName={isFollowingUser ? 'walk-outline' : 'accessibility-outline'}
      />

      <FAB
        onPress={() => void moveToCurrentLocation()}
        style={{ bottom: 60, right: 20 }}
        iconName="compass-outline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
