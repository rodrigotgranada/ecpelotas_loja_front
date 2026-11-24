import { api } from '@/services/api';

export interface UploadMediaOptions {
  endpoint: string;
  fieldName?: string;
}

export async function uploadMedia<T = { url: string }>(
  file: File,
  options: UploadMediaOptions,
): Promise<T> {
  const formData = new FormData();
  formData.append(options.fieldName || 'file', file);

  const response = await api.post<T>(options.endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
