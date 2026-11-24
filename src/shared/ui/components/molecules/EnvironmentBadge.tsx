'use client';

import React from 'react';
import { useEnvironmentBadge } from '@/shared/hooks/useEnvironmentBadge';
import { LayoutContainer } from '../atoms/LayoutContainer';
import { Text } from '../atoms/Text';
import { ENVIRONMENT_BADGE_TEXTS } from './EnvironmentBadge.constants';

export const EnvironmentBadge = () => {
  const { status, envData } = useEnvironmentBadge();

  const isProd = status === 'ok' && envData?.stage === 'PROD';

  const circleClass =
    status === 'loading'
      ? 'bg-neutral-500/30 border-neutral-400/60 animate-pulse'
      : status === 'error'
        ? 'bg-[#ea580c]/35 border-[#ea580c]/80'
        : isProd
          ? 'bg-emerald-500/35 border-emerald-400/80'
          : 'bg-yellow-500/35 border-yellow-400/80';

  const label =
    status === 'loading'
      ? ENVIRONMENT_BADGE_TEXTS.LOADING
      : status === 'error'
        ? ENVIRONMENT_BADGE_TEXTS.ERROR
        : isProd
          ? ENVIRONMENT_BADGE_TEXTS.PROD
          : ENVIRONMENT_BADGE_TEXTS.DEV;

  return (
    <LayoutContainer
      className={`fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full border-2 backdrop-blur-md shadow-lg flex items-center justify-center select-none ${circleClass}`}
      title={`${ENVIRONMENT_BADGE_TEXTS.TITLE_PREFIX} ${label}`}
    >
      <Text as="span" className="text-xs font-black tracking-wider text-white">
        {label}
      </Text>
    </LayoutContainer>
  );
};
