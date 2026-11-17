import { create } from 'zustand';

import {
  checkLocationPermission,
  requestLocationPermission,
} from '@/core/actions/permissions/locations';
import { PermissionStatus } from '@/infrastructure';

interface IPermissionsState {
  locationsStatus: PermissionStatus;

  requestLocationPermission: () => Promise<PermissionStatus>;
  checkLocationPermission: () => Promise<PermissionStatus>;
}

export const usePermissionsStore = create<IPermissionsState>()((set) => ({
  locationsStatus: PermissionStatus.CHECKING,

  requestLocationPermission: async () => {
    const status = await requestLocationPermission();
    set({ locationsStatus: status });
    return status;
  },

  checkLocationPermission: async () => {
    const status = await checkLocationPermission();
    set({ locationsStatus: status });
    return status;
  },
}));
