import { useCallback, useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import * as Application from 'expo-application';

export type OtaStatus =
  | 'idle'
  | 'checking'
  | 'downloading'
  | 'applying'
  | 'up-to-date'
  | 'error';

export function useOtaUpdate() {
  const [status, setStatus] = useState<OtaStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const currentInfo = {
    appVersion: Application.nativeApplicationVersion ?? '1.0.0',
    updateId: Updates.updateId ?? 'embedded (no OTA applied yet)',
    createdAt: Updates.createdAt ? new Date(Updates.createdAt).toLocaleString() : 'N/A',
    isEmbedded: Updates.isEmbeddedLaunch,
channel: Updates.channel || 'unknown',  };

  const checkForUpdate = useCallback(async () => {
    if (__DEV__) {
      setStatus('up-to-date');
      return;
    }
    setStatus('checking');
    setErrorMsg('');
    try {
      const result = await Updates.checkForUpdateAsync();
      if (!result.isAvailable) {
        setStatus('up-to-date');
        return;
      }
      setStatus('downloading');
      await Updates.fetchUpdateAsync();

      // এখানেই মূল পরিবর্তন — button এর অপেক্ষা না করে সাথে সাথে reload
      setStatus('applying');
      await Updates.reloadAsync();
      // reloadAsync কল হলেই app instantly নতুন bundle দিয়ে restart হয়ে যায়,
      // এই লাইনের পরের কোড আসলে কখনো রান হয় না (app ইতিমধ্যে reload শুরু করে দিয়েছে)
    } catch (e) {
      setStatus('error');
      setErrorMsg(e instanceof Error ? e.message : 'Update check failed');
    }
  }, []);

  // ম্যানুয়াল trigger এখনো রাখলাম (retry বাটনের জন্য দরকার হতে পারে)
  const applyUpdate = useCallback(async () => {
    await Updates.reloadAsync();
  }, []);

  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  return { status, errorMsg, currentInfo, checkForUpdate, applyUpdate };
}