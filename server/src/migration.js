import { Types } from "mongoose";
import { Post } from "./models/Post.js";
import { User } from "./models/User.js";

export const migration = async () => {
  await Post.deleteMany();

  const postList = [
    {
      _id: new Types.ObjectId("64565a05867620df0ef89f49"),
      sender: new Types.ObjectId("64569d259d19f7f3611babe1"),
      recipients: ["#sium", "@bidone"],
      text: "Ragazzi volevo dirvi che il Sium non e' piu' forte del porcodiaz sebbene molti infedeli di voi possano credere che lo sia. Avete travisato gli insegnamenti del CRISTO redentore",
      timestamp: "2011-10-10T14:48:00",
      image_path:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F451855%2Ftree-sea-grass-nature-451855.jpeg%3Fcs%3Dsrgb%26dl%3Dacqua-albero-cielo-451855.jpg%26fm%3Djpg&f=1&nofb=1&ipt=0e7f3717726bc66d6397ab3f958887a3bc43e15bf96fa8ca9d349cac02ab3532&ipo=images",
      geolocation: { lat: 43.8625456, lon: 10.4621366 },
    },
    {
      _id: new Types.ObjectId("64565a05867620df0ef89f50"),
      sender: new Types.ObjectId("64569d259d19f7f3611babe1"),
      recipients: ["#vivasucco", "@besciamella"],
      text: "Non credete alle fandonie che dicono loro la'",
      timestamp: "2021-10-10T14:48:00",
      image_path:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F451855%2Ftree-sea-grass-nature-451855.jpeg%3Fcs%3Dsrgb%26dl%3Dacqua-albero-cielo-451855.jpg%26fm%3Djpg&f=1&nofb=1&ipt=0e7f3717726bc66d6397ab3f958887a3bc43e15bf96fa8ca9d349cac02ab3532&ipo=images",
      geolocation: { lat: 43.8625456, lon: 10.4621366 },
    },
  ];

  postList.map((item) => {
    item = new Post(item);
    item.save();
  });

  await User.deleteMany();

  const userList = [
    {
      name: "achille-lauro22",
      posts: [],
      propic_path:
        "https://this-person-does-not-exist.com/img/avatar-gena379629b770580ab53d90cc61d84c43b.jpg",
    },
    {
      name: "il fortissimo",
      posts: [],
      propic_path:
        "https://this-person-does-not-exist.com/img/avatar-gen55ceb8ae2b76c0311ca62dd9ea231d82.jpg",
    },
    {
      _id: new Types.ObjectId("64569d259d19f7f3611babe1"),
      name: "mammalona",
      posts: [
        new Types.ObjectId("64565a05867620df0ef89f49"),
        new Types.ObjectId("64565a05867620df0ef89f50"),
      ],
      propic_path:
        "https://this-person-does-not-exist.com/img/avatar-genbe010322231cb9e777078e4195e87c79.jpg",
    },
  ];

  userList.map((item) => {
    item = new User(item);
    item.save();
  });
};