import * as Location from 'expo-location';

import { PermissionStatus } from '@/infrastructure';
import { Alert, Linking } from 'react-native';

export const requestLocationPermission = async (): Promise<PermissionStatus> => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    if (status === 'denied') {
      manualPermissionRequest();
    }
    return PermissionStatus.DENIED;
  }

  return PermissionStatus.GRANTED;
};

export const checkLocationPermission = async () => {
  const { status } = await Location.getForegroundPermissionsAsync();

  switch (status) {
    case 'granted':
      return PermissionStatus.GRANTED;

    case 'denied':
      return PermissionStatus.DENIED;

    default:
      return PermissionStatus.UNDERTERMINED;
  }
};

export const manualPermissionRequest = async () => {
  Alert.alert(
    'Permiso de ubicacion necesario',
    'Para continuar debes de habilitar el permiso de locations o ubicacion, en los ajustes de la app',
    [
      {
        text: `Abrir Ajustes`,
        style: 'default',
        onPress: () => {
          Linking.openSettings();
        },
      },
      {
        text: 'Cancel',
        style: 'destructive',
      },
    ],
  );
};
