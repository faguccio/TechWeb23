import * as Const from "./const.js";

import express from "express";
import mongoose from "mongoose";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { appRouter } from "./handlers/router.js";

//constants
const app = express();
const port = Const.SERVER_PORT;
//const specs = swaggerJsdoc(Const.SWAGGER_OPTION);

// App initialization
app.use(express.json());
app.use(appRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

/*
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");
  const kittySchema = new mongoose.Schema({
    name: String,
  });

  const Kitten = mongoose.model("Kitten", kittySchema);

  const silence = new Kitten({ name: "Silence" });
  console.log(silence.name); // 'Silence'
}

main().catch((err) => console.log(err));
no server for the moment
*/

//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
