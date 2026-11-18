import {
  clearWatchCurrentPosition,
  getCurrentLocation,
  watchCurrentPosition,
} from '@/core/actions/locations/location';
import { ILatLng } from '@/infrastructure';
import { create } from 'zustand';

// Se conservan solo los últimos puntos: sin tope, el array crece sin límite
// y en cada actualización se copia entero y se reenvía al Polyline nativo.
// Otras opciones válidas según el producto:
//   B) ignorar puntos demasiado cerca del anterior (p. ej. < 10 m usando
//      Haversine) y además aplicar este tope, para quitar el ruido del GPS.
//   C) persistir el historial completo (AsyncStorage/SQLite) y dibujar solo
//      una ventana, si se necesita la ruta de toda la sesión.
// 600 puntos ≈ 24 km con distanceInterval de 40 m: cubre una media maratón
// (~528 puntos) con margen para oscilaciones del GPS.
const MAX_POINTS = 600;

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
            userLocationList: [...get().userLocationList, latlng].slice(-MAX_POINTS),
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
