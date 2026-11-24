import { api } from './api';

export interface EnvTestResponse {
  stage?: 'LOCAL' | 'DEV' | 'PROD';
  environment?: string;
  databaseLabel?: string;
  storageProvider?: string;
}

export const systemService = {
  getEnvTest: async (): Promise<EnvTestResponse> => {
    const res = await api.get<EnvTestResponse>('/auth/env-test');
    return res.data;
  },
};
