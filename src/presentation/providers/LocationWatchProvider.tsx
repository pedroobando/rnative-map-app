import { PermissionStatus } from '@/infrastructure';
import { useLocationStore, usePermissionsStore } from '@/presentation/store';
import { PropsWithChildren, useEffect } from 'react';

/**
 * El watch de ubicación es un recurso global: antes lo iniciaba y detenía
 * CustomMap, de modo que al desmontar el mapa se mataba para cualquier otro
 * consumidor. Ahora vive en un provider que está por encima de la navegación y
 * sigue el ciclo de vida del permiso.
 */
const LocationWatchProvider = ({ children }: PropsWithChildren) => {
  const locationsStatus = usePermissionsStore((state) => state.locationsStatus);
  const watchLocation = useLocationStore((state) => state.watchLocation);
  const clearWatchLocation = useLocationStore((state) => state.clearWatchLocation);

  useEffect(() => {
    if (locationsStatus !== PermissionStatus.GRANTED) {
      return;
    }

    void watchLocation();

    return () => clearWatchLocation();
  }, [locationsStatus, watchLocation, clearWatchLocation]);

  return <>{children}</>;
};

export default LocationWatchProvider;
