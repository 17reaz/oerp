import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

import { AuthProvider } from "./features/auth/auth-provider";
import { useAppUpdate } from "./features/update/hooks/use-app-update";
import { UpdateScreen } from "./features/update/components/update-screen";

export default function RootLayout() {
  const { updateInfo } = useAppUpdate();
  const [dismissed, setDismissed] = useState(false);

  const showUpdate = updateInfo?.available && !(dismissed && !updateInfo.mandatory);

  return (
    <AuthProvider>
      <StatusBar style="dark" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>

      {showUpdate && (
        <UpdateScreen updateInfo={updateInfo} onDismiss={() => setDismissed(true)} />
      )}
    </AuthProvider>
  );
}