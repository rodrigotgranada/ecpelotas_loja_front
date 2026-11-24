'use client';

import React from 'react';
import { useEnvironmentBadge } from '@/shared/hooks/useEnvironmentBadge';
import { LayoutContainer } from '../atoms/LayoutContainer';
import { Text } from '../atoms/Text';
import { ENVIRONMENT_BADGE_TEXTS } from './EnvironmentBadge.constants';

export const EnvironmentBadge = () => {
  const { status, envData, isOpen, setIsOpen, containerRef } = useEnvironmentBadge();

  const stage = status === 'ok' ? envData?.stage : undefined;

  const circleClass =
    status === 'loading'
      ? 'bg-neutral-500/30 border-neutral-400/60 animate-pulse'
      : status === 'error'
        ? 'bg-[#ea580c]/35 border-[#ea580c]/80 hover:bg-[#ea580c]/50'
        : stage === 'PROD'
          ? 'bg-emerald-500/35 border-emerald-400/80 hover:bg-emerald-500/50'
          : stage === 'DEV'
            ? 'bg-yellow-500/35 border-yellow-400/80 hover:bg-yellow-500/50'
            : 'bg-sky-500/35 border-sky-400/80 hover:bg-sky-500/50';

  const label =
    status === 'loading'
      ? ENVIRONMENT_BADGE_TEXTS.LOADING
      : status === 'error'
        ? ENVIRONMENT_BADGE_TEXTS.ERROR
        : stage === 'PROD'
          ? ENVIRONMENT_BADGE_TEXTS.PROD
          : stage === 'DEV'
            ? ENVIRONMENT_BADGE_TEXTS.DEV
            : ENVIRONMENT_BADGE_TEXTS.LOCAL;

  const panelTitle =
    status === 'loading'
      ? ENVIRONMENT_BADGE_TEXTS.PANEL_TITLE_LOADING
      : status === 'error'
        ? ENVIRONMENT_BADGE_TEXTS.PANEL_TITLE_ERROR
        : stage === 'PROD'
          ? ENVIRONMENT_BADGE_TEXTS.PANEL_TITLE_PROD
          : stage === 'DEV'
            ? ENVIRONMENT_BADGE_TEXTS.PANEL_TITLE_DEV
            : ENVIRONMENT_BADGE_TEXTS.PANEL_TITLE_LOCAL;

  return (
    <LayoutContainer className="fixed bottom-4 left-4 z-50 flex flex-col items-start">
      <div ref={containerRef} className="flex flex-col items-start">
        {isOpen && (
          <LayoutContainer className="mb-2 w-72 rounded-2xl bg-surface/95 backdrop-blur-md border border-border p-4 shadow-2xl text-xs space-y-2">
            <Text className="font-bold text-sm text-text-primary border-b border-border pb-1.5">
              {panelTitle}
            </Text>

            {status === 'ok' && envData ? (
              <LayoutContainer className="space-y-1.5 pt-1">
                <LayoutContainer className="flex justify-between gap-2">
                  <Text as="span" className="text-text-secondary">
                    {ENVIRONMENT_BADGE_TEXTS.API_LABEL}
                  </Text>
                  <Text as="span" className="font-semibold text-success">
                    {ENVIRONMENT_BADGE_TEXTS.STATUS_OK}
                  </Text>
                </LayoutContainer>
                <LayoutContainer className="flex justify-between gap-2">
                  <Text as="span" className="text-text-secondary">
                    {ENVIRONMENT_BADGE_TEXTS.DB_LABEL}
                  </Text>
                  <Text as="span" className="font-mono font-semibold text-text-primary truncate max-w-[175px]">
                    {envData.databaseLabel || label}
                  </Text>
                </LayoutContainer>
                <LayoutContainer className="flex justify-between gap-2">
                  <Text as="span" className="text-text-secondary">
                    {ENVIRONMENT_BADGE_TEXTS.STORAGE_LABEL}
                  </Text>
                  <Text as="span" className="font-mono font-semibold text-text-primary">
                    {envData.storageProvider || 'firebase'}
                  </Text>
                </LayoutContainer>
              </LayoutContainer>
            ) : status === 'error' ? (
              <Text className="text-[#ea580c] text-xs leading-relaxed">
                {ENVIRONMENT_BADGE_TEXTS.ERROR_HINT}
              </Text>
            ) : null}
          </LayoutContainer>
        )}

        <button
          type="button"
          aria-label={ENVIRONMENT_BADGE_TEXTS.ARIA_LABEL}
          title={panelTitle}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-12 h-12 rounded-full border-2 backdrop-blur-md shadow-lg flex items-center justify-center transition-all cursor-pointer select-none ${circleClass}`}
        >
          <Text as="span" className="text-[10px] font-black tracking-wider text-white">
            {label}
          </Text>
        </button>
      </div>
    </LayoutContainer>
  );
};
