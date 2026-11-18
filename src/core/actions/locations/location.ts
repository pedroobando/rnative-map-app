import { ILatLng } from '@/infrastructure';
import * as Location from 'expo-location';

const ACCURACY: Location.LocationAccuracy = Location.Accuracy.Balanced;

// La suscripción es un objeto nativo no serializable y solo debe existir una
// activa a la vez, por eso se guarda a nivel de módulo y no dentro del store
// de Zustand (que quedaría expuesto a re-renders y a serialización).
let subscription: Location.LocationSubscription | null = null;

export const getCurrentLocation = async (): Promise<ILatLng> => {
  try {
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: ACCURACY,
    });

    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  } catch (error) {
    throw new Error('No se pudo obtener la ubicación', { cause: error });
  }
};

export const watchCurrentPosition = async (
  locationCallback: (location: ILatLng) => void,
  errorCallback?: (reason: string) => void,
): Promise<void> => {
  // Si ya había una suscripción activa, se libera antes para no dejar fugas.
  clearWatchCurrentPosition();

  subscription = await Location.watchPositionAsync(
    {
      accuracy: ACCURACY,
      distanceInterval: 40,
    },
    ({ coords }) => {
      locationCallback({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    },
    (reason) => errorCallback?.(reason),
  );
};

export const clearWatchCurrentPosition = (): void => {
  subscription?.remove();
  subscription = null;
};
