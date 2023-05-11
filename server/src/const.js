export const SERVER_PORT = 3000;
export const BAD_REQUEST = 400;
export const STATUS_OK = 200;
export const SWAGGER_OPTION = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

export const DB_ADDR = "127.0.0.1";
export const DB_PORT = "27017";
export const DB_USER = "root";
export const DB_SECRET = "secret";
export const DB_URI = `mongodb://${DB_USER}:${DB_SECRET}@${DB_ADDR}:${DB_PORT}`;

export const critic_mass_index = 0.2;
export const standard_chars = {
  day: 500,
  week: 2500,
  month: 8000,
};

export const SECRET = "adorousarejavascript";