import * as Const from "./const.js";

import express from "express";
import mongoose from "mongoose";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { appRouter } from "./routes/router.js";
import cors from "cors";
import { migration } from "./migration.js";

//constants
const app = express();
const port = Const.SERVER_PORT;
//const specs = swaggerJsdoc(Const.SWAGGER_OPTION);

// App initialization
app.use(cors());
app.use(express.json());
app.use(appRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

async function connectDB() {
  const uri = Const.DB_URI;
  console.log(uri);
  await mongoose.connect(uri);
  console.log("Connected to DB");
  migration();
}

connectDB().catch((err) => console.log(err));

//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
