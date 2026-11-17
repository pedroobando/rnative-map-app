import { CustomMap, ThemedPressable, ThemedText } from '@/presentation/components';
import { useLocationStore } from '@/presentation/store';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const MapScreen = () => {
  const getLocation = useLocationStore((state) => state.getLocation);
  const lastKnownLocation = useLocationStore((state) => state.lastKnownLocation);
  const locationError = useLocationStore((state) => state.locationError);

  useEffect(() => {
    if (lastKnownLocation === null) {
      void getLocation().catch(() => {});
    }
  }, [getLocation, lastKnownLocation]);

  if (lastKnownLocation === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {locationError !== null ? (
          <>
            <ThemedText>{locationError}</ThemedText>
            <ThemedPressable onPress={() => void getLocation().catch(() => {})}>
              Reintentar
            </ThemedPressable>
          </>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomMap initialLocation={lastKnownLocation} showUserLocation={true} />
    </View>
  );
};

export default MapScreen;
