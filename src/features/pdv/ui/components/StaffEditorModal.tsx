'use client';

import React from 'react';
import {
  Modal,
  Form,
  FormField,
  Input,
  Select,
  SelectOption,
  Button,
  LayoutContainer,
  Text,
} from '@/shared/ui/components';
import { StoreUser } from '@/store/useAuthStore';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { StaffFormState } from '../../hooks/usePdvStaff';

export interface StaffEditorModalProps {
  isOpen: boolean;
  editingStaff: StoreUser | null;
  formState: StaffFormState;
  isSaving: boolean;
  canManageAdmins: boolean;
  onChangeField: <K extends keyof StaffFormState>(field: K, value: StaffFormState[K]) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const StaffEditorModal = ({
  isOpen,
  editingStaff,
  formState,
  isSaving,
  canManageAdmins,
  onChangeField,
  onClose,
  onSubmit,
}: StaffEditorModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingStaff ? PDV_TEXTS.STAFF_MODAL_EDIT_TITLE : PDV_TEXTS.STAFF_MODAL_CREATE_TITLE}
    >
      <Form onSubmit={onSubmit} className="space-y-4">
        <FormField label={PDV_TEXTS.STAFF_FIELD_NAME} required>
          <Input
            value={formState.fullName}
            onChange={(e) => onChangeField('fullName', e.target.value)}
            disabled={isSaving}
          />
        </FormField>

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label={PDV_TEXTS.STAFF_FIELD_EMAIL}>
            <Input
              type="email"
              value={formState.email}
              onChange={(e) => onChangeField('email', e.target.value)}
              disabled={isSaving}
            />
          </FormField>

          <FormField label={PDV_TEXTS.STAFF_FIELD_CPF}>
            <Input
              value={formState.cpf}
              onChange={(e) => onChangeField('cpf', e.target.value)}
              disabled={isSaving}
            />
          </FormField>
        </LayoutContainer>

        <FormField label={PDV_TEXTS.STAFF_FIELD_ROLE} required>
          <Select
            value={formState.role}
            onChange={(e) => onChangeField('role', e.target.value)}
            disabled={isSaving}
          >
            <SelectOption value="SELLER">{PDV_TEXTS.ROLE_SELLER}</SelectOption>
            <SelectOption value="STOCK_CLERK">{PDV_TEXTS.ROLE_STOCK_CLERK}</SelectOption>
            {canManageAdmins && (
              <>
                <SelectOption value="STORE_MANAGER">{PDV_TEXTS.ROLE_STORE_MANAGER}</SelectOption>
                <SelectOption value="ADMIN">{PDV_TEXTS.ROLE_ADMIN}</SelectOption>
              </>
            )}
            <SelectOption value="USER">{PDV_TEXTS.ROLE_USER}</SelectOption>
          </Select>
        </FormField>

        <FormField
          label={
            editingStaff
              ? PDV_TEXTS.STAFF_FIELD_PASSWORD_EDIT
              : PDV_TEXTS.STAFF_FIELD_PASSWORD_CREATE
          }
          required={!editingStaff}
        >
          <Input
            type="password"
            value={formState.password}
            onChange={(e) => onChangeField('password', e.target.value)}
            disabled={isSaving}
          />
        </FormField>

        <LayoutContainer className="flex items-center gap-2 pt-1">
          <Input
            type="checkbox"
            checked={formState.active}
            onChange={(e) => onChangeField('active', e.target.checked)}
            className="w-4 h-4"
            disabled={isSaving}
          />
          <Text as="span" className="text-xs text-text-primary">
            {PDV_TEXTS.STAFF_FIELD_ACTIVE}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="flex justify-end gap-3 pt-2 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            {PDV_TEXTS.BTN_CANCEL}
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? PDV_TEXTS.BTN_SAVING : PDV_TEXTS.STAFF_BTN_SAVE}
          </Button>
        </LayoutContainer>
      </Form>
    </Modal>
  );
};
