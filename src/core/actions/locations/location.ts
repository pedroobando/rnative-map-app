import { ILatLng } from '@/infrastructure';
import * as Location from 'expo-location';

export const getCurrentLocation = async (): Promise<ILatLng> => {
  try {
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  } catch (error) {
    console.log(`getCurrentLocation - ${error}`);
    throw new Error(`Error getting using location -`);
  }
};

export const watchCurrentPosition = async (locationCallback: (location: ILatLng) => void) => {
  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 10,
    },
    ({ coords }) => {
      locationCallback({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    },
  );
};
