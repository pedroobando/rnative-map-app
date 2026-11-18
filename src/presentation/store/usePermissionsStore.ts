import { create } from 'zustand';

import {
  checkLocationPermission,
  requestLocationPermission,
} from '@/core/actions/permissions/locations';
import { PermissionStatus } from '@/infrastructure';

interface IPermissionsState {
  locationsStatus: PermissionStatus;

  // Se prefijan con `set`/`check` para diferenciarlas de las acciones de
  // core/actions/permissions, que tienen el mismo nombre.
  setLocationPermission: () => Promise<PermissionStatus>;
  checkLocationPermissionStatus: () => Promise<PermissionStatus>;
}

export const usePermissionsStore = create<IPermissionsState>()((set) => ({
  locationsStatus: PermissionStatus.CHECKING,

  setLocationPermission: async () => {
    const status = await requestLocationPermission();
    set({ locationsStatus: status });
    return status;
  },

  checkLocationPermissionStatus: async () => {
    const status = await checkLocationPermission();
    set({ locationsStatus: status });
    return status;
  },
}));
