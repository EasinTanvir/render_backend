const bcrypt = require("bcryptjs");
const DummyUsers = [
  {
    name: "Easin",
    email: "easin@gmail.com",
    password: bcrypt.hashSync("easineasin", 12),
    isAdmin: true,
  },
  {
    name: "Tanvir",
    email: "tanvir@gmail.com",
    password: bcrypt.hashSync("tanvirtanvir", 12),
  },
  {
    name: "Jack",
    email: "jack@gmail.com",
    password: bcrypt.hashSync("jackjack", 12),
  },
];
module.exports = DummyUsers;
