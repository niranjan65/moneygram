export const ERP_ENV = {
  DEMO: "DEMO",
  PROD: "PROD",
};

let CURRENT_ENV = ERP_ENV.PROD;

export const setERPEnv = (env) => {
  CURRENT_ENV = env;
};

export const getERPEnv = () => CURRENT_ENV;

const CONFIG = {
  [ERP_ENV.DEMO]: {
    baseURL: "http://192.168.101.182:81",
    getAuthHeaders: () => ({
      "Content-Type": "application/json",
      Authorization: `token ab5bd602e5f2950:f06904f1b3b1afe`,
    }),
  },

  [ERP_ENV.PROD]: {
    baseURL: "http://192.168.101.182:81",
    getAuthHeaders: (loginUser) => {
      const apiKey =
        loginUser?.api_key ||
        loginUser?.message?.api_key ||
        loginUser?.user?.api_key;

      const apiSecret =
        loginUser?.api_secret ||
        loginUser?.message?.api_secret ||
        loginUser?.user?.api_secret;

      if (!apiKey || !apiSecret) {
        throw new Error("API Key or API Secret not found in loginUser");
      }

      return {
        "Content-Type": "application/json",
        Authorization: `token ${apiKey}:${apiSecret}`,
      };
    },
  },
};

export const getBaseURL = (envOverride) => {
  const env = envOverride || CURRENT_ENV;
  return CONFIG[env].baseURL;
};

export const getHeaders = (loginUser, envOverride) => {
  const env = envOverride || CURRENT_ENV;
  return CONFIG[env].getAuthHeaders(loginUser);
};