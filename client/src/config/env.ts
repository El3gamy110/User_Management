// config/env.ts
export const ENV = {
  DEV_MODE: "development",
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005",
  API_TIMEOUT: 10000,
  APP_NAME: "Json Server Auth",
  APP_VERSION: "1.0.0",
  APP_ENV: "Development",
  ACCESS_TOKEN_KEY: "accessToken",
  REFRESH_TOKEN_KEY: "refreshToken",
  USER_STORAGE_KEY: "authUser",
  DISABLE_DASHBOARD_PROTECTION: false,
};
