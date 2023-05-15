import { Types } from "mongoose";
import { Post } from "./models/Post.js";
import { User } from "./models/User.js";
import { Channel } from "./models/Channel.js";
import * as Const from "./const.js";

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
      reactions: { positive: 32, negative: 489 },
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
      reactions: { positive: 144445, negative: 564 },
    },
    {
      _id: new Types.ObjectId("64565a05867620df0ef89f51"),
      sender: new Types.ObjectId("64569d259d19f7f3611babe3"),
      recipients: ["#sium"],
      text: "Non credete agli gnomi (firmato associazione gnomi)",
      timestamp: "2013-10-10T14:48:00",
      image_path: null,
      geolocation: null,
      reactions: { positive: 2, negative: 1 },
    },
    {
      _id: new Types.ObjectId("64565a05867620df0ef89f66"),
      sender: new Types.ObjectId("64569d259d19f7f3611babe0"),
      recipients: ["#sium"],
      text: "Hasbulla camananiovqetbuidfj",
      timestamp: "2015-10-10T14:48:00",
      reactions: { positive: 0, negative: 0 },
    },
  ];

  postList.map((item) => {
    item = new Post(item);
    item.save();
  });

  await User.deleteMany();

  const userList = [
    {
      _id: new Types.ObjectId("64569d259d19f7f3611babe0"),
      name: "Official-Squeal",
      password: "password-dura",
      propic_path: "https://cdn-icons-png.flaticon.com/512/2188/2188053.png",
    },
    {
      _id: new Types.ObjectId("64569d259d19f7f3611babe1"),
      name: "mammalona",
      password: "forza roma",
      posts: [
        new Types.ObjectId("64565a05867620df0ef89f49"),
        new Types.ObjectId("64565a05867620df0ef89f50"),
      ],
      channels: [
        new Types.ObjectId("6459038a3a8419267a26f5ce"),
        new Types.ObjectId("6459038a3a8419267a26f5cf"),
      ],
      leftovers_chars: {
        day: 200,
        week: 500,
        month: 1800,
      },
      standard_chars: {
        ...Const.standard_chars,
      },
      propic_path:
        "https://this-person-does-not-exist.com/img/avatar-genbe010322231cb9e777078e4195e87c79.jpg",
    },

    {
      _id: new Types.ObjectId("64569d259d19f7f3611babe3"),
      name: "achille-lauro22",
      password: "davidebassi",
      posts: [new Types.ObjectId("64565a05867620df0ef89f51")],
      propic_path:
        "https://this-person-does-not-exist.com/img/avatar-gena379629b770580ab53d90cc61d84c43b.jpg",
    },
  ];

  userList.map((item) => {
    item = new User(item);
    item.save();
  });

  await Channel.deleteMany();

  const channelList = [
    {
      _id: new Types.ObjectId("6459038a3a8419267a26f5ce"),
      name: "#sium",
      owners: [],
      allowed_readers: [],
      allowed_writers: [],

      posts: [
        {
          content: new Types.ObjectId("64565a05867620df0ef89f49"),
          timestamp: "2011-10-10T14:48:00",
        },
        {
          content: new Types.ObjectId("64565a05867620df0ef89f50"),
          timestamp: "2021-10-10T14:48:00",
        },
        {
          content: new Types.ObjectId("64565a05867620df0ef89f66"),
          timestamp: "2015-10-10T14:48:00",
        },
      ],
    },
    {
      _id: new Types.ObjectId("6459038a3a8419267a26f5cf"),
      name: "#nonesistono",
      owners: [],
      allowed_readers: [],
      allowed_writers: [],

      posts: [new Types.ObjectId("64565a05867620df0ef89f50")],
    },
    {
      _id: new Types.ObjectId("6459038a3a8419267a26f5c0"),
      name: "§JOKESQEUAL",
      owners: [],
      allowed_readers: [],
      allowed_writers: [],

      posts: [],
    },
    {
      _id: new Types.ObjectId("6459038a3a8419267a26f5c1"),
      name: "§FACTSQUEAL",
      owners: [],
      allowed_readers: [],
      allowed_writers: [],

      posts: [],
    },
  ];

  channelList.map((item) => {
    item = new Channel(item);
    item.save();
  });
};

/*{
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
    }, */
