'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Form,
  FormField,
  Input,
  Button,
  Spinner,
} from '@/shared/ui/components';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { usePdvSettings } from '../../hooks/usePdvSettings';
import { PdvShell } from '../components/PdvShell';

export const PdvSettingsFeature = () => {
  const { settings, isLoading, isSaving, updateField, handleSubmit } = usePdvSettings();

  return (
    <PdvShell>
      <LayoutContainer className="max-w-3xl space-y-6">
        <LayoutContainer className="space-y-1">
          <Title level="h1" className="text-2xl font-extrabold text-text-primary flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary shrink-0" />
            {PDV_TEXTS.SETTINGS_TITLE}
          </Title>
          <Text className="text-sm text-text-secondary">{PDV_TEXTS.SETTINGS_SUBTITLE}</Text>
        </LayoutContainer>

        {isLoading ? (
          <Spinner text={PDV_TEXTS.SETTINGS_LOADING} />
        ) : (
          <Form
            onSubmit={handleSubmit}
            className="bg-surface border border-border rounded-2xl p-6 space-y-4"
          >
            <FormField label={PDV_TEXTS.SETTINGS_FIELD_NAME} required>
              <Input
                value={settings.storeName}
                onChange={(e) => updateField('storeName', e.target.value)}
                disabled={isSaving}
              />
            </FormField>

            <FormField label={PDV_TEXTS.SETTINGS_FIELD_WHATSAPP} required>
              <Input
                value={settings.whatsappNumber}
                onChange={(e) => updateField('whatsappNumber', e.target.value)}
                disabled={isSaving}
              />
            </FormField>

            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label={PDV_TEXTS.SETTINGS_FIELD_OPEN_HOUR} required>
                <Input
                  value={settings.openHour}
                  onChange={(e) => updateField('openHour', e.target.value)}
                  disabled={isSaving}
                />
              </FormField>

              <FormField label={PDV_TEXTS.SETTINGS_FIELD_CLOSE_HOUR} required>
                <Input
                  value={settings.closeHour}
                  onChange={(e) => updateField('closeHour', e.target.value)}
                  disabled={isSaving}
                />
              </FormField>
            </LayoutContainer>

            <FormField label={PDV_TEXTS.SETTINGS_FIELD_WORKDAYS} required>
              <Input
                value={settings.workingDays}
                onChange={(e) => updateField('workingDays', e.target.value)}
                disabled={isSaving}
              />
            </FormField>

            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label={PDV_TEXTS.SETTINGS_FIELD_TTL} required>
                <Input
                  type="number"
                  min={30}
                  max={1440}
                  value={settings.reservationTtlMinutes}
                  onChange={(e) =>
                    updateField('reservationTtlMinutes', Number(e.target.value) || 180)
                  }
                  disabled={isSaving}
                />
              </FormField>

              <FormField label={PDV_TEXTS.SETTINGS_FIELD_MAX_OPEN} required>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={settings.maxOpenReservationsPerUser}
                  onChange={(e) =>
                    updateField('maxOpenReservationsPerUser', Number(e.target.value) || 2)
                  }
                  disabled={isSaving}
                />
              </FormField>
            </LayoutContainer>

            <LayoutContainer className="pt-2">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? PDV_TEXTS.BTN_SAVING : PDV_TEXTS.SETTINGS_BTN_SAVE}
              </Button>
            </LayoutContainer>
          </Form>
        )}
      </LayoutContainer>
    </PdvShell>
  );
};
