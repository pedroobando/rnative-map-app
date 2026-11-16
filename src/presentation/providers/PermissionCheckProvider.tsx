import { PermissionStatus } from '@/infrastructure';
import { router } from 'expo-router';
import { PropsWithChildren, useEffect } from 'react';
import { AppState } from 'react-native';
import { usePermissionsStore } from '../store/usePermissions';

const PermissionCheckProvider = ({ children }: PropsWithChildren) => {
  const { locationsStatus, checkLocationPermission } = usePermissionsStore();

  useEffect(() => {
    checkLocationPermission();
  }, [checkLocationPermission]);

  useEffect(() => {
    if (locationsStatus === PermissionStatus.GRANTED) {
      router.replace('/map');
    } else if (locationsStatus !== PermissionStatus.CHECKING) {
      router.replace('/permissions');
    }
  }, [locationsStatus]);

  useEffect(() => {
    const suscription = AppState.addEventListener('change', (nextAppState) => {
      // console.log({ nextAppState });
      if (nextAppState === 'active') {
        checkLocationPermission();
      }
    });

    return () => {
      suscription.remove();
    };
  }, []);

  return <>{children}</>;
};

export default PermissionCheckProvider;
