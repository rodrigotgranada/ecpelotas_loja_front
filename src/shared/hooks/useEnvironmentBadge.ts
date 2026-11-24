'use client';

import { useEffect, useState, useRef } from 'react';
import { systemService, EnvTestResponse } from '@/services/system.service';

export const useEnvironmentBadge = () => {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [envData, setEnvData] = useState<EnvTestResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return { status, envData, isOpen, setIsOpen, containerRef };
};
