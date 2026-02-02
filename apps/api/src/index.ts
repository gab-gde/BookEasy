import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();

// ✅ Render injecte PORT, sinon fallback local
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

// Swagger config
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BookEasy API",
      version: "1.0.0",
    },
    // ✅ marche en local ET en prod (Render/Vercel)
    servers: [{ url: "/" }],
  },
  apis: ["./src/**/*.ts"],
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log("🚀 BookEasy API running!");
  console.log(`📍 API:     http://localhost:${PORT}`);
  console.log(`📚 Docs:    http://localhost:${PORT}/docs`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
});