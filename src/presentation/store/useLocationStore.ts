import {
  clearWatchCurrentPosition,
  getCurrentLocation,
  watchCurrentPosition,
} from '@/core/actions/locations/location';
import { ILatLng } from '@/infrastructure';
import { create } from 'zustand';

interface LocationState {
  lastKnownLocation: ILatLng | null;
  userLocationList: ILatLng[];
  isWatching: boolean;
  locationError: string | null;

  getLocation: () => Promise<ILatLng>;
  watchLocation: () => Promise<void>;
  clearWatchLocation: () => void;
}

export const useLocationStore = create<LocationState>()((set, get) => ({
  lastKnownLocation: null,
  userLocationList: [],
  isWatching: false,
  locationError: null,

  getLocation: async () => {
    set({ locationError: null });

    try {
      const location = await getCurrentLocation();
      set({ lastKnownLocation: location });
      return location;
    } catch (error) {
      // Se guarda para que la pantalla pueda mostrar un mensaje y un botón de
      // reintento en vez de quedarse en el spinner para siempre.
      set({ locationError: 'No se pudo obtener la ubicación' });
      throw error;
    }
  },

  watchLocation: async () => {
    // Antes se guardaba la suscripción en el store y al limpiarla no se ponía
    // a null, por eso siempre se intentaba eliminar una suscripción ya muerta.
    // Ahora la suscripción vive en core/actions/location.ts (objeto nativo, no
    // serializable) y el store solo expone un booleano para la UI.
    if (get().isWatching) {
      get().clearWatchLocation();
    }

    try {
      await watchCurrentPosition(
        (latlng) => {
          set({
            lastKnownLocation: latlng,
            userLocationList: [...get().userLocationList, latlng],
          });
        },
        (reason) => console.warn(`watchLocation - ${reason}`),
      );
      set({ isWatching: true });
    } catch (error) {
      console.warn('No se pudo iniciar el seguimiento de la ubicación', error);
      set({ isWatching: false });
    }
  },

  clearWatchLocation: () => {
    clearWatchCurrentPosition();
    set({ isWatching: false });
  },
}));
