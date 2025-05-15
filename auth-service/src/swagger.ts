import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth Service API",
      version: "1.0.0",
      description: "Microserviço responsável pela autenticação de usuários",
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
