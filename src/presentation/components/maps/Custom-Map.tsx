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
  const { watchLocation, clearWatchLocation, lastKnownLocation, getLocation, userLocationList } =
    useLocationStore();

  const moveCamaraToLocation = (latlng: ILatLng) => {
    if (!mapRef.current) return;

    mapRef.current.animateCamera({
      center: latlng,
    });
  };

  const moveToCurrentLocation = async () => {
    if (!lastKnownLocation) {
      moveCamaraToLocation(initialLocation);
    } else {
      moveCamaraToLocation(lastKnownLocation);
    }

    const location = await getLocation();
    if (!location) return;
    moveCamaraToLocation(location);
  };

  useEffect(() => {
    watchLocation();
    return () => {
      clearWatchLocation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        onPress={() => moveToCurrentLocation}
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
