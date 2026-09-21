import * as Sharing from "expo-sharing";

export async function shareFile(fileUri: string) {
  const available = await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error(
      "Sharing is not available on this device."
    );
  }

  await Sharing.shareAsync(fileUri);
}