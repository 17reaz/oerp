const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// 1. AndroidManifest.xml এ permission + FileProvider যোগ করে
const withApkInstallerManifest = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const app = manifest.manifest.application[0];

    // --- Permissions ---
    manifest.manifest['uses-permission'] = manifest.manifest['uses-permission'] || [];
    const permissions = [
      'android.permission.REQUEST_INSTALL_PACKAGES',
      'android.permission.INTERNET',
    ];
    permissions.forEach((perm) => {
      const exists = manifest.manifest['uses-permission'].some(
        (p) => p.$['android:name'] === perm
      );
      if (!exists) {
        manifest.manifest['uses-permission'].push({ $: { 'android:name': perm } });
      }
    });

    // --- FileProvider (APK ফাইল share করার জন্য) ---
    app.provider = app.provider || [];
    const providerExists = app.provider.some(
      (p) => p.$['android:name'] === 'androidx.core.content.FileProvider'
    );
    if (!providerExists) {
      app.provider.push({
        $: {
          'android:name': 'androidx.core.content.FileProvider',
          'android:authorities': `${config.android.package}.provider`,
          'android:exported': 'false',
          'android:grantUriPermissions': 'true',
        },
        'meta-data': [
          {
            $: {
              'android:name': 'android.support.FILE_PROVIDER_PATHS',
              'android:resource': '@xml/provider_paths',
            },
          },
        ],
      });
    }

    return config;
  });
};

// 2. provider_paths.xml রিসোর্স ফাইল বানায়
const withProviderPathsXml = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const xmlDir = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/res/xml'
      );
      if (!fs.existsSync(xmlDir)) {
        fs.mkdirSync(xmlDir, { recursive: true });
      }
      const filePath = path.join(xmlDir, 'provider_paths.xml');
      const content = `<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <cache-path name="apk_updates" path="apk-updates/" />
    <external-cache-path name="apk_updates_ext" path="apk-updates/" />
</paths>
`;
      fs.writeFileSync(filePath, content);
      return config;
    },
  ]);
};

module.exports = function withApkInstaller(config) {
  config = withApkInstallerManifest(config);
  config = withProviderPathsXml(config);
  return config;
};