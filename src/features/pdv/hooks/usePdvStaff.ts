'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { StoreUser, useAuthStore } from '@/store/useAuthStore';
import { pdvService } from '../services/pdv.service';
import { PDV_TEXTS } from '../constants/pdv.constants';
import { extractApiError } from '../utils/pdv.formatters';

export interface StaffFormState {
  fullName: string;
  email: string;
  cpf: string;
  role: string;
  password: string;
  active: boolean;
}

const createInitialStaffForm = (): StaffFormState => ({
  fullName: '',
  email: '',
  cpf: '',
  role: 'SELLER',
  password: '',
  active: true,
});

export const usePdvStaff = () => {
  const currentUser = useAuthStore((s) => s.user);
  const [staffList, setStaffList] = useState<StoreUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StoreUser | null>(null);
  const [formState, setFormState] = useState<StaffFormState>(createInitialStaffForm);
  const [isSaving, setIsSaving] = useState(false);

  const inFlightRef = useRef(false);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await pdvService.listStaff();
      setStaffList(data);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.STAFF_EMPTY));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchStaff();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStaff]);

  const canManageAdmins = ['OWNER', 'ADMIN'].includes((currentUser?.role || '').toUpperCase());

  const openCreateModal = () => {
    setEditingStaff(null);
    setFormState(createInitialStaffForm());
    setIsModalOpen(true);
  };

  const openEditModal = (member: StoreUser) => {
    setEditingStaff(member);
    setFormState({
      fullName: member.fullName,
      email: member.email || '',
      cpf: member.cpf || '',
      role: member.role,
      password: '',
      active: member.active,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
  };

  const updateField = <K extends keyof StaffFormState>(field: K, value: StaffFormState[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlightRef.current) return;

    const fullName = formState.fullName.trim();
    if (!fullName) {
      toast.error(PDV_TEXTS.STAFF_VALIDATION_NAME);
      return;
    }

    const email = formState.email.trim();
    const cpf = formState.cpf.trim();
    if (!email && !cpf) {
      toast.error(PDV_TEXTS.STAFF_VALIDATION_IDENTIFIER);
      return;
    }

    const password = formState.password.trim();
    if (!editingStaff && password.length < 6) {
      toast.error(PDV_TEXTS.STAFF_VALIDATION_PASSWORD);
      return;
    }
    if (editingStaff && password && password.length < 6) {
      toast.error(PDV_TEXTS.STAFF_VALIDATION_PASSWORD);
      return;
    }

    inFlightRef.current = true;
    setIsSaving(true);

    try {
      if (editingStaff) {
        await pdvService.updateStaff(editingStaff.id, {
          fullName,
          email: email || undefined,
          cpf: cpf || undefined,
          role: formState.role,
          password: password || undefined,
          active: formState.active,
        });
      } else {
        await pdvService.createStaff({
          fullName,
          email: email || undefined,
          cpf: cpf || undefined,
          role: formState.role,
          password,
          active: formState.active,
        });
      }

      toast.success(PDV_TEXTS.STAFF_SAVE_SUCCESS);
      setIsModalOpen(false);
      await fetchStaff();
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.STAFF_SAVE_ERROR));
    } finally {
      inFlightRef.current = false;
      setIsSaving(false);
    }
  };

  return {
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
  };
};
