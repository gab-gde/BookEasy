import dotenv from "dotenv";
import type { Secret, SignOptions } from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET is missing in production");
}

export const config = {
  port: Number(process.env.PORT || process.env.API_PORT || 3001),
  frontUrl: process.env.FRONT_URL || "http://localhost:3000",
  jwt: {
    secret: (JWT_SECRET ?? "dev-secret-change-me") as Secret,
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
    loginMax: Number(process.env.LOGIN_RATE_LIMIT_MAX || 5),
  },
} as const;