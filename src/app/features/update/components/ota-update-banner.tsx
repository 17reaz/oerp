import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useOtaUpdate } from '../hooks/use-ota-update';

export function OtaUpdateBanner() {
  const { status, currentInfo, applyUpdate, checkForUpdate } = useOtaUpdate();

  return (
    <View style={styles.wrap}>
      <Text style={styles.versionText}>
        App v{currentInfo.appVersion} · Update: {currentInfo.updateId.slice(0, 8)}
        {'\n'}Channel: {currentInfo.channel} · Loaded: {currentInfo.createdAt}
      </Text>

      {status === 'checking' && (
        <View style={styles.row}>
          <ActivityIndicator size="small" color="#208AEF" />
          <Text style={styles.statusText}>Update চেক হচ্ছে...</Text>
        </View>
      )}

      {status === 'downloading' && (
        <View style={styles.row}>
          <ActivityIndicator size="small" color="#208AEF" />
          <Text style={styles.statusText}>নতুন Update ডাউনলোড হচ্ছে...</Text>
        </View>
      )}

      {status === 'applying' && (
  <View style={styles.row}>
    <ActivityIndicator size="small" color="#208AEF" />
    <Text style={styles.statusText}>নতুন আপডেট চালু হচ্ছে...</Text>
  </View>
)}

      {status === 'up-to-date' && (
        <Text style={styles.statusText}>✓ Latest version-ই চলছে</Text>
      )}

      {status === 'error' && (
        <TouchableOpacity style={styles.btnRetry} onPress={checkForUpdate}>
          <Text style={styles.btnText}>আবার চেষ্টা করুন</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 10, backgroundColor: '#F5FAFF', borderRadius: 10, gap: 6 },
  versionText: { fontSize: 11, color: '#888' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusText: { fontSize: 13, color: '#333' },
  btn: { backgroundColor: '#208AEF', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnRetry: { backgroundColor: '#999', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
});