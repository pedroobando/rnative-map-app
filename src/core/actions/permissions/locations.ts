import * as Location from 'expo-location';

import { PermissionStatus } from '@/infrastructure';

const mapToPermissionStatus = (
  response: Location.LocationPermissionResponse,
): PermissionStatus => {
  switch (response.status) {
    case Location.PermissionStatus.GRANTED: {
      const accuracy = response.ios?.accuracy ?? response.android?.accuracy;

      return accuracy === 'reduced' || accuracy === 'coarse'
        ? PermissionStatus.LIMITED
        : PermissionStatus.GRANTED;
    }

    case Location.PermissionStatus.UNDETERMINED:
      return PermissionStatus.UNDETERMINED;

    case Location.PermissionStatus.DENIED:
      return response.canAskAgain ? PermissionStatus.DENIED : PermissionStatus.BLOCKED;

    default:
      return PermissionStatus.UNAVAILABLE;
  }
};

const readPermission = async (
  getResponse: () => Promise<Location.LocationPermissionResponse>,
): Promise<PermissionStatus> => {
  try {
    return mapToPermissionStatus(await getResponse());
  } catch {
    return PermissionStatus.UNAVAILABLE;
  }
};

export const requestLocationPermission = (): Promise<PermissionStatus> =>
  readPermission(() => Location.requestForegroundPermissionsAsync());

export const checkLocationPermission = (): Promise<PermissionStatus> =>
  readPermission(() => Location.getForegroundPermissionsAsync());
