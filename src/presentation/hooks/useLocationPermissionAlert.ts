import { useCallback } from 'react';
import { Alert, Linking, Platform } from 'react-native';

import { PermissionStatus } from '@/infrastructure';

type AlertContent = {
  title: string;
  message: string;
};

const DEFAULT_CONTENT: AlertContent = {
  title: 'Ubicación no disponible',
  message: 'No se pudo consultar el permiso de ubicación. Inténtalo de nuevo.',
};

const CONTENT: Partial<Record<PermissionStatus, AlertContent>> = {
  [PermissionStatus.BLOCKED]: {
    title: 'Permiso de ubicación necesario',
    message: 'Activa la ubicación en Ajustes > Maps App > Ubicación para continuar.',
  },
  [PermissionStatus.DENIED]: {
    title: 'Permiso de ubicación denegado',
    message: 'Necesitamos acceso a tu ubicación. Puedes habilitarlo en los ajustes de la app.',
  },
  [PermissionStatus.LIMITED]: {
    title: 'Ubicación aproximada',
    message: 'Activa la ubicación precisa en Ajustes para que el mapa funcione correctamente.',
  },
  [PermissionStatus.UNAVAILABLE]: DEFAULT_CONTENT,
};

export const useLocationPermissionAlert = () =>
  useCallback((status: PermissionStatus) => {
    if (status === PermissionStatus.GRANTED || status === PermissionStatus.UNDERTERMINED) {
      return;
    }

    const { title, message } = CONTENT[status] ?? DEFAULT_CONTENT;

    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      return;
    }

    const actions =
      status === PermissionStatus.UNAVAILABLE
        ? [{ text: 'Entendido', style: 'cancel' as const }]
        : [
            {
              text: 'Abrir ajustes',
              onPress: () => void Linking.openSettings().catch(() => {}),
            },
            { text: 'Cancelar', style: 'cancel' as const },
          ];

    Alert.alert(title, message, actions);
  }, []);
