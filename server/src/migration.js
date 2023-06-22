import { Types } from "mongoose";
import { Post } from "./models/Post.js";
import { User } from "./models/User.js";
import { Channel } from "./models/Channel.js";
import * as Const from "./const.js";

export const migration = async () => {
  let idCounter = 10000;

  const newId = () => {
    idCounter += 1;
    return new Types.ObjectId("64565a05867620df0ef" + String(idCounter));
  };

  await Post.deleteMany();
  await User.deleteMany();
  await Channel.deleteMany();

  const postList = [
    {
      _id: new Types.ObjectId("64565a05867620df0ef89f49"),
      sender: new Types.ObjectId("64569d259d19f7f3611babe1"),
      recipients: ["#sium"],
      text: "Ragazzi volevo dirvi che il questo progetto non e' piu' forte del progetto dell'anno scorso sebbene molti infedeli di voi possano credere che lo sia. Avete travisato gli insegnamenti del corso di tecnologie web",
      timestamp: "2011-10-10T14:48:00",
      image_path:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F451855%2Ftree-sea-grass-nature-451855.jpeg%3Fcs%3Dsrgb%26dl%3Dacqua-albero-cielo-451855.jpg%26fm%3Djpg&f=1&nofb=1&ipt=0e7f3717726bc66d6397ab3f958887a3bc43e15bf96fa8ca9d349cac02ab3532&ipo=images",
      geolocation: { lat: 43.8625456, lon: 10.4621366 },
      reactions: { positive: 32, negative: 489 },
      comments: [
        "babbo\nSono pazzisismo",
        "babbo2\nSono bello non come quell sopra che e pazzo",
      ],
    },
    {
      _id: new Types.ObjectId("64565a05867620df0ef89f50"),
      sender: new Types.ObjectId("64569d259d19f7f3611babe1"),
      recipients: ["#vivasucco"],
      text: "Non credete alle fandonie che dicono loro la'",
      timestamp: "2021-10-10T14:48:00",
      image_path:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.pexels.com%2Fphotos%2F451855%2Ftree-sea-grass-nature-451855.jpeg%3Fcs%3Dsrgb%26dl%3Dacqua-albero-cielo-451855.jpg%26fm%3Djpg&f=1&nofb=1&ipt=0e7f3717726bc66d6397ab3f958887a3bc43e15bf96fa8ca9d349cac02ab3532&ipo=images",
      geolocation: { lat: 43.8625456, lon: 10.4821366 },
      reactions: { positive: 144445, negative: 564 },
      impressions: 144445 + 564,
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
      type:"vip",
      posts: [
        new Types.ObjectId("64565a05867620df0ef89f49"),
        new Types.ObjectId("64565a05867620df0ef89f50"),
      ],
      channels: [
        new Types.ObjectId("6459038a3a8419267a26f5ce"),
        new Types.ObjectId("6459038a3a8419267a26f5cf"),
      ],
      propic_path:
        "https://this-person-does-not-exist.com/img/avatar-genbe010322231cb9e777078e4195e87c79.jpg",
    },

    {
      _id: new Types.ObjectId("64569d259d19f7f3611babe3"),
      name: "achille-lauro22",
      type: "manager",
      managing: new Types.ObjectId("64569d259d19f7f3611babe1"),
      password: "davidebassi",
      posts: [new Types.ObjectId("64565a05867620df0ef89f51")],
      propic_path:
        "https://this-person-does-not-exist.com/img/avatar-gena379629b770580ab53d90cc61d84c43b.jpg",
    },
    {
      _id: new Types.ObjectId("64569d259d19f7f3611babe4"),
      name: "admin",
      password: "admin",
      type: "admin",
    },
  ];

  userList.map((item) => {
    item = new User(item);
    item.save();
  });

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
      ],
    },
    {
      _id: new Types.ObjectId("6459038a3a8419267a26f5cf"),
      name: "#nonesistono",
      owners: [],
      allowed_readers: [],
      allowed_writers: [],

      posts: [
        {
          content: new Types.ObjectId("64565a05867620df0ef89f66"),
          timestamp: "2011-10-10T14:48:00",
        },
        {
          content: new Types.ObjectId("64565a05867620df0ef89f50"),
          timestamp: "2021-10-10T14:48:00",
        },
      ],
    },
    {
      _id: new Types.ObjectId("6459038a3a8419267a26f5c0"),
      name: "§JOKESQUEAL",
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
    {
      _id: new Types.ObjectId("6459038a3a8419267a26f5dd"),
      name: "§CONTROVERSIAL",
      owners: [],
      allowed_readers: [],
      allowed_writers: [],

      posts: [
        {
          content: new Types.ObjectId("64565a05867620df0ef89f66"),
          timestamp: "2021-10-10T14:49:00",
        },
      ],
    },
  ];

  channelList.map((item) => {
    item = new Channel(item);
    item.save();
  });

  /*
  "fv", "fvPro", "fvSMM" e
"fvMod", con password "12345678".
*/

  const userFv = {
    _id: newId(),
    name: "fv",
    password: "12345678",
    posts: [],
    propic_path:
      "https://this-person-does-not-exist.com/img/avatar-gen41a2b0d34c7cd8c118d078dadb7cf8fa.jpg",
  };

  const userFvPro = {
    _id: newId(),
    name: "fvPro",
    password: "12345678",
    type: "vip",
    posts: [],
    propic_path:
      "https://this-person-does-not-exist.com/img/avatar-gen1153b1cb5898dc805e6e0c3b5274188c.jpg",
    leftovers_chars: {
      day: 50,
      week: 50,
      month: 50,
    },
  };

  const userFvSMM = {
    _id: newId(),
    name: "fvSMM",
    password: "12345678",
    type: "manager",
    managing: userFvPro._id,
    posts: [],
    propic_path:
      "https://this-person-does-not-exist.com/img/avatar-gen236970af0eedf7f5fc00972e13d9a4b3.jpg",
  };

  const userFvMod = {
    _id: newId(),
    name: "fvMod",
    type: "admin",
    password: "12345678",
    posts: [],
    propic_path:
      "https://this-person-does-not-exist.com/img/avatar-gen33bc875c95e8347956670797f957f369.jpg",
  };

  const userNomeBuffo1 = {
    _id: newId(),
    name: "FunnyName1",
    type: "vip",
    password: "12345678",
    propic_path:
      "https://this-person-does-not-exist.com/img/avatar-gen8a9b529252ff8baff1823b8f58b6e733.jpg",

    leftovers_chars: {
      day: 50,
      week: 50,
      month: 50,
    },
    posts: [],
    popularPosts: [],
  };

  const userNomeBuffo2 = {
    _id: newId(),
    name: "FunnyName2",
    type: "vip",
    password: "12345678",
    propic_path:
      "https://this-person-does-not-exist.com/img/avatar-genc8cbae27780991ca57d9703e73aad9fb.jpg",
    leftovers_chars: {
      day: 50,
      week: 50,
      month: 50,
    },
    posts: [],
    unpopularPosts: [],
  };

  const postOfNomeBuffo2 = [
    {
      _id: new Types.ObjectId(),
      recipients: ["§channel1"],
      text: "Testo random di un post ecco tutto qui",
      timestamp: "2021-10-10T14:48:00",
      reactions: { positive: 15, negative: 400 },
      impressions: 500,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["§channel1"],
      text: Const.lorem,
      timestamp: "2021-10-10T14:48:00",
      reactions: { positive: 2, negative: 25 },
      impressions: 30,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["§channel1"],
      text: Const.lorem,
      timestamp: "2021-10-10T14:48:00",
      image_path: "https://picsum.photos/id/237/200/300",
      reactions: { positive: 4, negative: 51 },
      impressions: 50,
    },
  ];

  const postOfNomeBuffo1 = [
    {
      _id: new Types.ObjectId(),
      recipients: ["§channel2"],
      text: Const.lorem,
      timestamp: "2021-10-10T14:48:00",
      reactions: { positive: 21, negative: 3 },
      impressions: 30,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["§channel2"],
      text: Const.lorem,
      timestamp: "2021-10-10T14:48:00",
      image_path: "https://picsum.photos/id/237/200/300",
      reactions: { positive: 2900, negative: 51 },
      impressions: 5050,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["§channel2"],
      text: Const.lorem,
      timestamp: "2021-10-10T14:48:00",
      reactions: { positive: 21, negative: 3 },
      impressions: 30,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["§channel2"],
      text: Const.lorem,
      timestamp: "2021-10-10T14:48:00",
      image_path: "https://picsum.photos/id/237/200/300",
      reactions: { positive: 2900, negative: 51 },
      impressions: 5050,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["§channel2"],
      text: Const.lorem,
      timestamp: "2021-10-10T14:48:00",
      reactions: { positive: 21, negative: 3 },
      impressions: 30,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["§channel2"],
      text: Const.lorem,
      timestamp: "2021-10-10T14:48:00",
      image_path: "https://picsum.photos/id/237/200/300",
      reactions: { positive: 2900, negative: 51 },
      impressions: 5050,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["§channel2"],
      text: Const.lorem,
      timestamp: "2021-10-10T14:48:00",
      reactions: { positive: 21, negative: 3 },
      impressions: 30,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["§channel2"],
      text: Const.lorem,
      timestamp: "2021-10-10T14:48:00",
      image_path: "https://picsum.photos/id/237/200/300",
      reactions: { positive: 2900, negative: 51 },
      impressions: 5050,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["§channel2"],
      text: Const.lorem,
      timestamp: "2021-10-10T14:48:00",
      reactions: { positive: 21, negative: 3 },
      impressions: 30,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["§channel2"],
      text: Const.lorem,
      timestamp: "2021-10-10T14:48:00",
      image_path: "https://picsum.photos/id/237/200/300",
      reactions: { positive: 2900, negative: 51 },
      impressions: 5050,
    },
  ];

  const channel1 = {
    _id: new Types.ObjectId(),
    name: "§channel1",
    posts: [],
  };

  const channel2 = {
    _id: new Types.ObjectId(),
    name: "§channel2",
    posts: [],
  };

  const channel3 = {
    _id: new Types.ObjectId(),
    name: "#channel3",
    posts: [],
  };

  const channel4 = {
    _id: new Types.ObjectId(),
    name: "#serviceShow",
    posts: [],
  };

  postOfNomeBuffo2.map(async (post) => {
    channel1.posts.push({ content: post._id, timestamp: post.timestamp });
    userNomeBuffo2.posts.push(post._id);
    post.sender = userNomeBuffo2._id;
    userNomeBuffo2.unpopularPosts.push(post._id);
    let item = new Post(post);
    await item.save();
  });

  postOfNomeBuffo1.map(async (post) => {
    channel2.posts.push({ content: post._id, timestamp: post.timestamp });
    userNomeBuffo1.posts.push(post._id);
    userNomeBuffo1.popularPosts.push(post._id);
    post.sender = userNomeBuffo1._id;
    let item = new Post(post);
    await item.save();
  });

  const postOfUserFv = [
    {
      _id: new Types.ObjectId(),
      recipients: ["#serviceShow"],
      text: Const.lorem,
      geolocation: { lat: 44.49381, lon: 11.33875 },
      timestamp: "2023-06-10T14:48:00",
      reactions: { positive: 21, negative: 20 },
      impressions: 50,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["#serviceShow"],
      text: Const.lorem,
      geolocation: { lat: 44.48381, lon: 11.33575 },
      timestamp: "2023-06-10T15:48:00",
      reactions: { positive: 21, negative: 20 },
      impressions: 50,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["#serviceShow"],
      text: Const.lorem,
      geolocation: { lat: 44.48981, lon: 11.32575 },
      timestamp: "2023-06-10T16:48:00",
      reactions: { positive: 21, negative: 20 },
      impressions: 50,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["#serviceShow"],
      text: Const.lorem,
      geolocation: { lat: 44.49081, lon: 11.31575 },
      timestamp: "2023-06-10T17:48:00",
      reactions: { positive: 21, negative: 20 },
      impressions: 50,
    },
  ];

  postOfUserFv.map(async (post) => {
    channel4.posts.push({ content: post._id, timestamp: post.timestamp });
    userFv.posts.push(post._id);
    post.sender = userFv._id;
    let item = new Post(post);
    await item.save();
  });

  const postOfUserFvPro = [
    {
      _id: new Types.ObjectId(),
      recipients: ["#channel3"],
      text: Const.lorem,
      timestamp: "2023-06-10T14:48:00",
      reactions: { positive: 21, negative: 20 },
      impressions: 50,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["#channel3"],
      text: Const.lorem,
      timestamp: "2023-06-10T14:48:00",
      reactions: { positive: 21, negative: 20 },
      impressions: 50,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["#channel3"],
      text: Const.lorem,
      timestamp: "2023-06-10T14:48:00",
      reactions: { positive: 21, negative: 20 },
      impressions: 50,
    },
    {
      _id: new Types.ObjectId(),
      recipients: ["#channel3"],
      text: Const.lorem,
      timestamp: "2023-06-10T14:48:00",
      reactions: { positive: 21, negative: 20 },
      impressions: 50,
    },
  ];

  postOfUserFvPro.map(async (post) => {
    channel3.posts.push({ content: post._id, timestamp: post.timestamp });
    userFvPro.posts.push(post._id);
    post.sender = userFvPro._id;
    let item = new Post(post);
    await item.save();
  });

  [channel1, channel2, channel3, channel4].map((chan) => {
    const item = new Channel(chan);
    item.save();
  });

  [userFv, userFvPro, userFvSMM, userFvMod, userNomeBuffo1, userNomeBuffo2].map(
    (user) => {
      user.channels = [channel1, channel2, channel3, channel4].map(
        (chan) => chan._id
      );
      const item = new User(user);
      item.save();
    }
  );
};
