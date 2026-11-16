import { ThemedPressable, ThemedText, ThemedView } from '@/presentation/components';
import { usePermissionsStore } from '@/presentation/store';

const PermissionsScreen = () => {
  const { locationsStatus, requestLocationPermission } = usePermissionsStore();

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedPressable onPress={requestLocationPermission}>Habilitar Ubicación</ThemedPressable>

      <ThemedText>Estado Actual: {locationsStatus}</ThemedText>
    </ThemedView>
  );
};

export default PermissionsScreen;
