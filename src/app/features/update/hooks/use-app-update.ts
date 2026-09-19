import { useCallback, useEffect, useState } from 'react';
import { checkForUpdate } from '@/services/update-service';
import type { UpdateInfo } from '@/types/update';

export function useAppUpdate() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    setChecking(true);
    setError(null);
    try {
      const info = await checkForUpdate();
      setUpdateInfo(info);
    } catch (e) {
      // network error হলে silently fail করি — update check কখনো
      // app ব্যবহার আটকাবে না, শুধু mandatory update ছাড়া
      setError(e instanceof Error ? e.message : 'Update check failed');
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return { updateInfo, checking, error, recheck: check };
}