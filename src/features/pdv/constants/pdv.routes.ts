export const PDV_BASE_PATH = '/alcateia-1908';

export const PDV_ROUTES = {
  HOME: PDV_BASE_PATH,
  LOGIN: `${PDV_BASE_PATH}/login`,
  PRODUCTS: `${PDV_BASE_PATH}/produtos`,
  INVOICES: `${PDV_BASE_PATH}/notas`,
  KARDEX: `${PDV_BASE_PATH}/kardex`,
  STAFF: `${PDV_BASE_PATH}/equipe`,
} as const;
