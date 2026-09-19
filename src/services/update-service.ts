import * as Application from 'expo-application';
import type { GithubRelease, UpdateInfo } from '@/types/update';

const GITHUB_OWNER = process.env.EXPO_PUBLIC_GITHUB_OWNER!;
const GITHUB_REPO = process.env.EXPO_PUBLIC_GITHUB_REPO!;
const RELEASES_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

// tag_name যেমন "v1.4.2" -> versionCode বের করার জন্য body তে
// আমরা "versionCode: 12" লিখে রাখবো release notes এ (Step 5 এ auto হবে)
function parseVersionCodeFromBody(body: string): number | null {
  const match = body.match(/versionCode:\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

function isMandatory(body: string): boolean {
  // release body তে "[force]" বা "[mandatory]" ট্যাগ থাকলে force update
  return /\[(force|mandatory)\]/i.test(body);
}

function cleanVersion(tag: string): string {
  return tag.replace(/^v/i, '');
}

export async function checkForUpdate(): Promise<UpdateInfo> {
  const currentVersion = Application.nativeApplicationVersion ?? '0.0.0';
  const currentVersionCode = Number(Application.nativeBuildVersion ?? 0);

  const res = await fetch(RELEASES_URL, {
    headers: { Accept: 'application/vnd.github+json' },
  });

  if (!res.ok) {
    throw new Error(`GitHub release fetch failed: ${res.status}`);
  }

  const release: GithubRelease = await res.json();

  if (release.draft || release.prerelease) {
    return {
      available: false,
      mandatory: false,
      currentVersion,
      currentVersionCode,
      latestVersion: currentVersion,
      latestVersionCode: currentVersionCode,
      releaseNotes: '',
      downloadUrl: '',
      apkSizeBytes: null,
    };
  }

  const apkAsset = release.assets.find((a) => a.name.endsWith('.apk'));
  const latestVersion = cleanVersion(release.tag_name);
  const latestVersionCode = parseVersionCodeFromBody(release.body) ?? 0;

  const available =
    latestVersionCode > currentVersionCode && !!apkAsset;

  return {
    available,
    mandatory: available && isMandatory(release.body),
    currentVersion,
    currentVersionCode,
    latestVersion,
    latestVersionCode,
    releaseNotes: release.body,
    downloadUrl: apkAsset?.browser_download_url ?? '',
    apkSizeBytes: apkAsset?.size ?? null,
  };
}