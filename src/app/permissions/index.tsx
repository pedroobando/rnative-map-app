import { PermissionStatus } from '@/infrastructure';
import { ThemedPressable, ThemedText, ThemedView } from '@/presentation/components';
import { useLocationPermissionAlert } from '@/presentation/hooks/useLocationPermissionAlert';
import { usePermissionsStore } from '@/presentation/store';

const PermissionsScreen = () => {
  const { locationsStatus, requestLocationPermission } = usePermissionsStore();
  const showLocationPermissionAlert = useLocationPermissionAlert();

  const handleRequest = async () => {
    const status = await requestLocationPermission();

    if (status !== PermissionStatus.GRANTED) {
      showLocationPermissionAlert(status);
    }
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedPressable onPress={handleRequest}>Habilitar ubicación</ThemedPressable>

      <ThemedText>Estado actual: {locationsStatus}</ThemedText>
    </ThemedView>
  );
};

export default PermissionsScreen;
