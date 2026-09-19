export type UpdateInfo = {
  available: boolean;
  mandatory: boolean;
  currentVersion: string;
  currentVersionCode: number;
  latestVersion: string;
  latestVersionCode: number;
  releaseNotes: string;
  downloadUrl: string;
  apkSizeBytes: number | null;
};

export type GithubReleaseAsset = {
  name: string;
  browser_download_url: string;
  size: number;
};

export type GithubRelease = {
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  assets: GithubReleaseAsset[];
};