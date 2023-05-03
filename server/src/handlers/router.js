import express, { Router } from "express";
import * as Const from "../const.js";

export const appRouter = Router();

const getPost = async (req, res) => {
  console.log(req.params.id);

  const message = {
    _id: 1,
    _id_sender: 15,
    recipients: ["#sium", "@cazzone"],
    text: "Ragazzi volevo dirvi che il Sium non e' piu' forte del porcodiaz sebbene molti infedeli di voi possano credere che lo sia. Avete travisato gli insegnamenti del CRISTO redentore",
    timestamp: "19.30, 27.03.2001",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F451855%2Ftree-sea-grass-nature-451855.jpeg%3Fcs%3Dsrgb%26dl%3Dacqua-albero-cielo-451855.jpg%26fm%3Djpg&f=1&nofb=1&ipt=0e7f3717726bc66d6397ab3f958887a3bc43e15bf96fa8ca9d349cac02ab3532&ipo=images",
    Geolocation: null,
  };

  if (message._id != req.params.id)
    return res
      .status(Const.BAD_REQUEST)
      .json(new JsonError(`Can\'t find message with id ${req.params.id} `));

  return res.status(200).json(message);
  //return res.status(OK_CONST).json(animal);
};

const fakeUser = {
  id: 15,
  username: "Fabio Giordano",
  pro_pic:
    "https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
};

//messages
appRouter.get("/message/:id", getPost);
