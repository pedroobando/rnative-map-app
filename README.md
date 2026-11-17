# Maps App

Aplicación de [Expo](https://expo.dev) / React Native organizada con Expo Router. Esta primera etapa prepara **el flujo de permisos de ubicación** que utilizará el mapa. La pantalla del mapa todavía es un marcador de lugar; lo importante en este punto es la infraestructura de permisos.

Como parte de esta guía, también estamos revisando la [documentación oficial de MapView de Expo](https://docs.expo.dev/versions/latest/sdk/map-view/) para preparar la siguiente etapa: mostrar la ubicación del usuario en un mapa interactivo.

Como referencia complementaria, el repositorio de [react-native-maps en GitHub](https://github.com/react-native-maps/react-native-maps) reúne ejemplos y componentes —como marcadores, polilíneas, círculos o ventanas de información— que podremos incorporar al mapa.

## Pantalla de permisos

<p align="center">
  <img src=".pi/docs/part-01.jpeg" alt="Pantalla de permisos de ubicación con el estado DENIED" width="240" />
</p>

En `src/app/permissions/index.tsx` se muestra el estado actual del permiso y el botón **Habilitar ubicación**. Al pulsarlo se solicita el acceso. Si la respuesta no es `GRANTED`, se muestra una alerta explicando al usuario qué hacer; cuando el permiso está bloqueado o denegado, la alerta ofrece abrir los ajustes de la aplicación.

## Cómo funciona el flujo

1. `PermissionCheckProvider`, montado en `src/app/_layout.tsx`, consulta el permiso al iniciar la app.
2. `usePermissionsStore` mantiene el estado en `CHECKING` mientras se realiza la consulta.
3. Las acciones de `src/core/actions/permissions/locations.ts` llaman a `expo-location` y convierten su respuesta en un valor de `PermissionStatus`, independiente de la librería nativa.
4. Si el permiso es `GRANTED`, el provider navega a `/map`. En cualquier otro estado se muestra `/permissions`.
5. Cuando la app vuelve a estar en primer plano, el provider vuelve a verificar el permiso. Así se detecta que el usuario lo cambió desde los ajustes del sistema.

## Un flujo de permisos reutilizable

Aunque el primer caso de uso es el mapa, este diseño no está limitado a la ubicación:

- `PermissionStatus` define estados comunes (`GRANTED`, `DENIED`, `BLOCKED`, `LIMITED`, etc.) desacoplados de `expo-location`.
- Las acciones del núcleo actúan como adaptadores: traducen la respuesta de cada API nativa a esos estados comunes.
- `usePermissionsStore` centraliza el estado y las acciones asíncronas. Hoy expone ubicación porque es el servicio implementado, pero puede extenderse para cámara, notificaciones, Bluetooth u otros servicios.
- El provider se encarga de la navegación y la pantalla solo consume el hook, sin llamar directamente a la API nativa.
- La capa de presentación decide cómo informar al usuario para cada estado.

De esta forma, al incorporar un nuevo servicio basta con crear su adaptador y sus estados de permiso, y reutilizar la misma estructura de hook, provider y pantalla.

## Estructura principal

```text
src/
├── app/
│   ├── _layout.tsx                     # Provider de permisos y navegación
│   └── permissions/index.tsx           # Pantalla para solicitar el permiso
├── core/actions/permissions/
│   └── locations.ts                    # Consulta y normaliza el permiso de ubicación
├── infrastructure/interface/
│   └── location.ts                     # Enum PermissionStatus
└── presentation/
    ├── hooks/useLocationPermissionAlert.ts
    ├── providers/PermissionCheckProvider.tsx
    └── store/usePermissions.ts         # Hook/store de estado de permisos
```

## Ejecutar el proyecto

El repositorio usa Bun:

```bash
bun install
bunx expo start
```

Verificaciones antes de entregar cambios:

```bash
bunx expo lint
bunx tsc --noEmit
```
