import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect } from 'react';
import type { UpdateInfo } from '@/types/update';
import { downloadApk, installApk } from '@/services/apk-installer';
import { UpdateProgressBar } from './update-progress-bar';

type Props = {
  updateInfo: UpdateInfo;
  onDismiss: () => void; // শুধু non-mandatory হলে কল হবে
};

type Stage = 'idle' | 'downloading' | 'ready-to-install' | 'error';

export function UpdateScreen({ updateInfo, onDismiss }: Props) {
  const [stage, setStage] = useState<Stage>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Mandatory update এর সময় hardware back button block করা (Android)
  useEffect(() => {
    if (!updateInfo.mandatory) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [updateInfo.mandatory]);

  const handleUpdate = async () => {
    setStage('downloading');
    setErrorMsg('');
    try {
      const fileUri = await downloadApk(updateInfo.downloadUrl, (p) =>
        setProgress(p.progress)
      );
      setStage('ready-to-install');
      await installApk(fileUri);
      // installApk কল হলেই Android এর install screen ওভারলে হয়ে যায়
    } catch (e) {
      setStage('error');
      setErrorMsg(e instanceof Error ? e.message : 'কিছু একটা সমস্যা হয়েছে');
      Alert.alert(
        'আপডেট ব্যর্থ',
        'ডাউনলোড বা ইনস্টল করা যায়নি। আবার চেষ্টা করুন বা ইন্টারনেট চেক করুন।'
      );
    }
  };

  return (
    <Modal visible animationType="fade" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {updateInfo.mandatory ? 'আপডেট আবশ্যক' : 'নতুন আপডেট এসেছে'}
          </Text>

          <Text style={styles.version}>
            v{updateInfo.currentVersion} → v{updateInfo.latestVersion}
          </Text>

          {!!updateInfo.releaseNotes && (
            <Text style={styles.notes} numberOfLines={5}>
              {updateInfo.releaseNotes.replace(/\[(force|mandatory)\]/gi, '').trim()}
            </Text>
          )}

          {stage === 'downloading' && (
            <View style={styles.progressWrap}>
              <UpdateProgressBar progress={progress} />
              <Text style={styles.progressText}>
                {Math.round(progress * 100)}% ডাউনলোড হচ্ছে...
              </Text>
            </View>
          )}

          {stage === 'ready-to-install' && (
            <View style={styles.progressWrap}>
              <ActivityIndicator color="#208AEF" />
              <Text style={styles.progressText}>ইনস্টলার খোলা হচ্ছে...</Text>
            </View>
          )}

          <View style={styles.actions}>
            {!updateInfo.mandatory && stage === 'idle' && (
              <TouchableOpacity style={styles.secondaryBtn} onPress={onDismiss}>
                <Text style={styles.secondaryBtnText}>পরে করবো</Text>
              </TouchableOpacity>
            )}

            {stage !== 'downloading' && (
              <TouchableOpacity style={styles.primaryBtn} onPress={handleUpdate}>
                <Text style={styles.primaryBtnText}>
                  {stage === 'error' ? 'আবার চেষ্টা করুন' : 'আপডেট করুন'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  version: { fontSize: 14, color: '#666', marginBottom: 12 },
  notes: { fontSize: 14, color: '#333', marginBottom: 16, lineHeight: 20 },
  progressWrap: { marginVertical: 12, gap: 8 },
  progressText: { fontSize: 13, color: '#666', textAlign: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  primaryBtn: {
    backgroundColor: '#208AEF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600' },
  secondaryBtn: { paddingVertical: 10, paddingHorizontal: 12 },
  secondaryBtnText: { color: '#666', fontWeight: '500' },
});