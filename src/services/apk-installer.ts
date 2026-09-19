// note: SDK 54+ এ নতুন FileSystem API এসেছে, কিন্তু resumable download +
// progress callback পুরনো ("legacy") API তে আছে — তাই এখানে legacy ইম্পোর্ট
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

const APK_DIR = `${FileSystem.cacheDirectory}apk-updates/`;
const APK_PATH = `${APK_DIR}update.apk`;

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(APK_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(APK_DIR, { intermediates: true });
  }
}

export type DownloadProgress = {
  progress: number; // 0 থেকে 1
  bytesWritten: number;
  totalBytes: number;
};

let activeDownload: FileSystem.DownloadResumable | null = null;

export async function downloadApk(
  url: string,
  onProgress?: (p: DownloadProgress) => void
): Promise<string> {
  if (Platform.OS !== 'android') {
    throw new Error('APK auto-update শুধু Android এ সাপোর্টেড');
  }

  await ensureDir();

  const existing = await FileSystem.getInfoAsync(APK_PATH);
  if (existing.exists) {
    await FileSystem.deleteAsync(APK_PATH, { idempotent: true });
  }

  activeDownload = FileSystem.createDownloadResumable(
    url,
    APK_PATH,
    {},
    ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
      onProgress?.({
        progress:
          totalBytesExpectedToWrite > 0
            ? totalBytesWritten / totalBytesExpectedToWrite
            : 0,
        bytesWritten: totalBytesWritten,
        totalBytes: totalBytesExpectedToWrite,
      });
    }
  );

  const result = await activeDownload.downloadAsync();
  activeDownload = null;

  if (!result || result.status !== 200) {
    throw new Error(`APK ডাউনলোড ব্যর্থ হয়েছে (status: ${result?.status})`);
  }

  return result.uri; // local file:// path
}

export function cancelDownload() {
  activeDownload?.pauseAsync().catch(() => {});
  activeDownload = null;
}

export async function installApk(fileUri: string): Promise<void> {
  if (Platform.OS !== 'android') return;

  // Step 1 এ বানানো FileProvider দিয়ে local file:// কে content:// তে কনভার্ট
  const contentUri = await FileSystem.getContentUriAsync(fileUri);

  await IntentLauncher.startActivityAsync('android.intent.action.INSTALL_PACKAGE', {
    data: contentUri,
    flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
    type: 'application/vnd.android.package-archive',
  });
}

// Fallback: কিছু OEM (Xiaomi/Oppo ইত্যাদি) তে auto-prompt কাজ না করলে
// ম্যানুয়ালি settings screen এ পাঠানোর জন্য
export async function openUnknownSourcesSettings(): Promise<void> {
  const pkg = Application.applicationId ?? 'com.oerp.app';
  await IntentLauncher.startActivityAsync(
    'android.settings.MANAGE_UNKNOWN_APP_SOURCES',
    { data: `package:${pkg}` }
  );
}