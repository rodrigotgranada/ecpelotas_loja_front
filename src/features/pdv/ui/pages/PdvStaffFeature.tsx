'use client';

import React from 'react';
import { Plus, Pencil, Users } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Spinner,
} from '@/shared/ui/components';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { usePdvStaff } from '../../hooks/usePdvStaff';
import { formatDateTimeBrt } from '../../utils/pdv.formatters';
import { PdvShell } from '../components/PdvShell';
import { StaffEditorModal } from '../components/StaffEditorModal';

export const PdvStaffFeature = () => {
  const {
    staffList,
    isLoading,
    isModalOpen,
    editingStaff,
    formState,
    isSaving,
    canManageAdmins,
    openCreateModal,
    openEditModal,
    closeModal,
    updateField,
    handleSubmit,
  } = usePdvStaff();

  return (
    <PdvShell>
      <LayoutContainer className="space-y-6">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <LayoutContainer className="space-y-1">
            <Title level="h1" className="text-2xl font-extrabold text-text-primary">
              {PDV_TEXTS.STAFF_TITLE}
            </Title>
            <Text className="text-xs sm:text-sm text-text-secondary">
              {PDV_TEXTS.STAFF_SUBTITLE}
            </Text>
          </LayoutContainer>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus className="w-4 h-4" />
            {PDV_TEXTS.STAFF_NEW_BTN}
          </Button>
        </LayoutContainer>

        {isLoading ? (
          <Spinner text={PDV_TEXTS.STAFF_LOADING} />
        ) : staffList.length === 0 ? (
          <LayoutContainer className="bg-surface border border-border rounded-2xl p-10 text-center space-y-3">
            <Users className="w-10 h-10 text-primary mx-auto opacity-80" />
            <Text className="text-sm text-text-secondary">{PDV_TEXTS.STAFF_EMPTY}</Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="space-y-3">
            {staffList.map((member) => {
              const isLocal = member.authSource === 'LOCAL';
              return (
                <LayoutContainer
                  key={member.id}
                  className="bg-surface border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <LayoutContainer className="space-y-1">
                    <LayoutContainer className="flex flex-wrap items-center gap-2">
                      <Text as="span" className="text-sm font-bold text-text-primary">
                        {member.fullName}
                      </Text>
                      <Badge variant="primary">{member.role}</Badge>
                      <Badge variant={isLocal ? 'default' : 'warning'}>
                        {isLocal ? PDV_TEXTS.STAFF_SOURCE_LOCAL : PDV_TEXTS.STAFF_SOURCE_PORTAL}
                      </Badge>
                      <Badge variant={member.active ? 'success' : 'danger'}>
                        {member.active
                          ? PDV_TEXTS.STAFF_STATUS_ACTIVE
                          : PDV_TEXTS.STAFF_STATUS_INACTIVE}
                      </Badge>
                    </LayoutContainer>

                    <Text className="text-xs text-text-secondary">
                      {[member.email, member.cpf].filter(Boolean).join(' · ') || '-'} ·{' '}
                      {formatDateTimeBrt(member.lastLoginAt)}
                    </Text>
                  </LayoutContainer>

                  {member.role !== 'OWNER' && (
                    <Button
                      variant="outline"
                      onClick={() => openEditModal(member)}
                      className="text-xs self-start sm:self-center"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      {PDV_TEXTS.STAFF_EDIT_BTN}
                    </Button>
                  )}
                </LayoutContainer>
              );
            })}
          </LayoutContainer>
        )}
      </LayoutContainer>

      <StaffEditorModal
        isOpen={isModalOpen}
        editingStaff={editingStaff}
        formState={formState}
        isSaving={isSaving}
        canManageAdmins={canManageAdmins}
        onChangeField={updateField}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </PdvShell>
  );
};
