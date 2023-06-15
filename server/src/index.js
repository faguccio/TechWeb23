import * as Const from "./const.js";
import { automatic } from "./services/automatic-service.js";

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

//CORS Options
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

// App initialization
app.use(cors(corsOptions));
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

setInterval(automatic, Const.AUTOMATIC_POST_TIME);

connectDB().catch((err) => console.log(err));

//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
