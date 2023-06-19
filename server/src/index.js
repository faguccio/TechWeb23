import * as Const from "./const.js";
import { automatic } from "./services/automatic-service.js";

import express from "express";
import mongoose from "mongoose";
import { appRouter } from "./routes/router.js";
import cors from "cors";
import { migration } from "./migration.js";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

//constants
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Const.SERVER_PORT;
//const specs = swaggerJsdoc(Const.SWAGGER_OPTION);

// App initialization
app.use(cors());
app.use(express.json());

app.use("/mod", express.static(path.join(__dirname, "../../mod-board")));
app.use(
  "/app/",
  express.static(path.join(__dirname, "../../squealer-app/dist"))
);
app.get("/app/*", async (_, res) =>
  res.end(
    await fs.readFile(
      path.join(__dirname, "../../squealer-app/dist/index.html")
    )
  )
);
app.use(
  "/man/",
  express.static(path.join(__dirname, "../../manager-dash/dist"))
);
app.get("/man/*", async (_, res) =>
  res.end(
    await fs.readFile(
      path.join(__dirname, "../../manager-dash/dist/index.html")
    )
  )
);

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
