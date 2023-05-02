import * as Const from "./const.js";

import express from "express";
import mongoose from "mongoose";

//constants
const app = express();
const port = Const.SERVER_PORT;

// App initialization
app.use(express.json());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/sium", (req, res) => {
  res.status(201).send({
    sium: "ciao",
    size: 30,
  });
});

app.post("/sium/:id:size", (req, res) => {
  const { id, size } = req.params;
  const { logo } = req.body;

  if (!logo) {
    res.status(418).send({ message: "No logo" });
  }

  res.send({ soim: "richiesta di sborra effettuata con successo" });
  console.log(`${id} e ${size} e ${logo}`);
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");
  const kittySchema = new mongoose.Schema({
    name: String,
  });

  const Kitten = mongoose.model("Kitten", kittySchema);

  const silence = new Kitten({ name: "Silence" });
  console.log(silence.name); // 'Silence'
}

//main().catch((err) => console.log(err));
// no server for the moment
