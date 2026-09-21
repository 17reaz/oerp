import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export async function downloadAndShareImage(
  imageUrl: string,
  fileName = "passport.jpg",
) {
  if (!imageUrl) {
    throw new Error("Image URL is missing.");
  }

  const available = await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error(
      "Native sharing is not available on this device.",
    );
  }

  if (!FileSystem.cacheDirectory) {
    throw new Error("Cache directory is unavailable.");
  }

  const safeFileName = fileName.replace(
    /[^a-zA-Z0-9._-]/g,
    "_",
  );

  const localUri = `${FileSystem.cacheDirectory}${safeFileName}`;

  const result = await FileSystem.downloadAsync(
    imageUrl,
    localUri,
  );

  await Sharing.shareAsync(result.uri, {
    mimeType: "image/jpeg",
    dialogTitle: "Share Passport",
    UTI: "public.jpeg",
  });
}