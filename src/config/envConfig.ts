import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly("test"), choices: ["development", "production", "test"] }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  MONGO_URI: str({ devDefault: testOnly("localhost") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: 1000 }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: 1000 }),

  JWT_ACCESS_SECRET: str({ devDefault: "NO_ACCESS_SECRET" }),
  JWT_ACCESS_TOKEN_EXPIRY: str({ devDefault: "1h" }),
  JWT_REFRESH_SECRET: str({ devDefault: "NO_REFRESH_SECRET" }),
  JWT_REFRESH_TOKEN_EXPIRY: str({ devDefault: "7d" }),
});
