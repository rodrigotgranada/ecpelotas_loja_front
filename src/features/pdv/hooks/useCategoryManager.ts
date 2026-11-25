'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { pdvService, CategoryItem } from '../services/pdv.service';
import { PDV_TEXTS } from '../constants/pdv.constants';
import { extractApiError } from '../utils/pdv.formatters';

export const useCategoryManager = (onSaved: () => Promise<void> | void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isSaving, setIsSaving] = useState(false);
  const inFlightRef = useRef(false);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setSortOrder('0');
  };

  const openModal = () => {
    resetForm();
    setIsOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsOpen(false);
  };

  const startEditing = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
    setSortOrder(String(cat.sortOrder ?? 0));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlightRef.current) return;

    const cleanName = name.trim();
    if (!cleanName) {
      toast.error(PDV_TEXTS.CATEGORIES_VALIDATION_NAME);
      return;
    }

    inFlightRef.current = true;
    setIsSaving(true);
    try {
      const payload = {
        name: cleanName,
        description: description.trim() || undefined,
        sortOrder: Number.parseInt(sortOrder, 10) || 0,
        active: true,
      };
      if (editingId) {
        await pdvService.updateCategory(editingId, payload);
      } else {
        await pdvService.createCategory(payload);
      }
      toast.success(PDV_TEXTS.CATEGORIES_SAVE_SUCCESS);
      resetForm();
      await onSaved();
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.CATEGORIES_SAVE_ERROR));
    } finally {
      inFlightRef.current = false;
      setIsSaving(false);
    }
  };

  return {
    isOpen,
    editingId,
    name,
    setName,
    description,
    setDescription,
    sortOrder,
    setSortOrder,
    isSaving,
    openModal,
    closeModal,
    startEditing,
    resetForm,
    handleSubmit,
  };
};
