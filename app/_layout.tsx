import { AuthProvider } from "@/context/authContext/AuthContext";
import { ViajesProvider } from "@/context/viajeContext/ViajeContext";
import { Stack } from "expo-router";


export default function RootLayout() {
  return (
    <AuthProvider>
      <ViajesProvider>  

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" />
          <Stack.Screen name="(app)" />
        </Stack>
      </ViajesProvider>
    </AuthProvider>
  );
}
