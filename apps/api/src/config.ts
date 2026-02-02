import dotenv from "dotenv";
import type { Secret, SignOptions } from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // En prod (Render), on veut FORCER la présence du secret.
  // En local, tu peux soit le mettre dans .env, soit garder un fallback.
  // Je te mets un fallback dev propre mais on bloque en prod.
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is missing in production");
  }
}

export const config = {
  // ⚠️ Sur Render, c’est PORT qui est fourni (pas API_PORT)
  port: Number(process.env.PORT || process.env.API_PORT || 3001),

  frontUrl: process.env.FRONT_URL || "http://localhost:3000",

  jwt: {
    // Secret typé correctement pour jsonwebtoken
    secret: (JWT_SECRET ?? "dev-secret-change-me") as Secret,

    // expiresIn typé comme jsonwebtoken l'attend
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
    loginMax: Number(process.env.LOGIN_RATE_LIMIT_MAX || 5),
  },
} as const;