import { PermissionStatus } from '@/infrastructure';
import { router } from 'expo-router';
import { PropsWithChildren, useEffect } from 'react';
import { AppState } from 'react-native';
import { usePermissionsStore } from '../store/usePermissionsStore';

const PermissionCheckProvider = ({ children }: PropsWithChildren) => {
  const locationsStatus = usePermissionsStore((state) => state.locationsStatus);
  const checkLocationPermissionStatus = usePermissionsStore(
    (state) => state.checkLocationPermissionStatus,
  );

  useEffect(() => {
    checkLocationPermissionStatus();
  }, [checkLocationPermissionStatus]);

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
        checkLocationPermissionStatus();
      }
    });

    return () => {
      suscription.remove();
    };
  }, [checkLocationPermissionStatus]);

  return <>{children}</>;
};

export default PermissionCheckProvider;
