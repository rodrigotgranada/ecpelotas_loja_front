'use client';

import { useEffect, useState } from 'react';
import { systemService, EnvTestResponse } from '@/services/system.service';

export const useEnvironmentBadge = () => {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [envData, setEnvData] = useState<EnvTestResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const data = await systemService.getEnvTest();
        if (!mounted) return;
        setEnvData(data);
        setStatus('ok');
      } catch {
        if (!mounted) return;
        setStatus('error');
      }
    };
    check();
    return () => {
      mounted = false;
    };
  }, []);

  return { status, envData };
};
