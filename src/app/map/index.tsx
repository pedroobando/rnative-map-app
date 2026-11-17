import { CustomMap } from '@/presentation/components';
import { useLocationStore } from '@/presentation/store';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const MapScreen = () => {
  const { getLocation, lastKnownLocation: lastknownLocation } = useLocationStore();

  useEffect(() => {
    if (lastknownLocation === null) {
      getLocation();
    }
  }, []);

  if (lastknownLocation === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomMap
        // initialLocation={{ latitude: 10.203805, longitude: -64.638228 }}
        initialLocation={lastknownLocation}
        showUserLocation={true}
      />
    </View>
  );
};

export default MapScreen;

//
