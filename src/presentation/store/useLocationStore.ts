import { getCurrentLocation, watchCurrentPosition } from '@/core/actions/locations/location';
import { ILatLng } from '@/infrastructure';
import { LocationSubscription } from 'expo-location';
import { create } from 'zustand';

interface LocationState {
  lastKnownLocation: ILatLng | null;
  userLocationList: ILatLng[];
  watchSuscriptionID: LocationSubscription | null;

  getLocation: () => Promise<ILatLng>;
  watchLocation: () => void;
  clearWatchLocation: () => void;
}

export const useLocationStore = create<LocationState>()((set, get) => ({
  lastKnownLocation: null,
  userLocationList: [],
  watchSuscriptionID: null,

  getLocation: async () => {
    const location = await getCurrentLocation();
    set({ lastKnownLocation: location });
    return location;
  },

  watchLocation: async () => {
    const oldSuscription = get().watchSuscriptionID;

    if (oldSuscription !== null) {
      get().clearWatchLocation();
    }

    const watchSuscription = await watchCurrentPosition((latlng) => {
      // console.log(get().userLocationList);

      set({
        lastKnownLocation: latlng,
        userLocationList: [...get().userLocationList, latlng],
      });
    });

    set({ watchSuscriptionID: watchSuscription });
  },

  clearWatchLocation: () => {
    const subcription = get().watchSuscriptionID;
    if (subcription !== null) {
      subcription.remove();
    }
  },
}));
