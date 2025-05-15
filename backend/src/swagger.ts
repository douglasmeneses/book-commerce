import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Commerce API",
      version: "1.0.0",
      description: "Documentação da API do backend do Book Commerce",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor de Desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Caminho para os arquivos de rotas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
