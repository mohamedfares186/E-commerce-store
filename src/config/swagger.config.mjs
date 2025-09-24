import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "API documentation for my e-commerce application",
    },
    servers: [
      {
        url: "http://localhost:3000", // change in deployment
      },
    ],
  },
  apis: ["../docs/index.yml"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
