const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [
  {
    _id: userOneID,
    email: "jjj@j.com",
    password: "abcUser1",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userOneID, access: "auth" }, "abcSecret")
          .toString()
      }
    ]
  },
  { _id: userTwoID, email: "kkk@k.com", password: "abcUser2" }
];

const todos = [
  { _id: new ObjectID(), text: "First todo" },
  {
    _id: new ObjectID(),
    text: "Second todo",
    completed: true,
    completedAt: 2356
  }
];

const populateTodos = done => {
  Todo.deleteMany({})
    .then(() => {
      Todo.insertMany(todos);
    })
    .then(() => done());
};

const populateUsers = done => {
  User.deleteMany({})
    .then(() => {
      let userOne = new User(users[0]).save();
      let userTwo = new User(users[1]).save();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers };
