require("./config/config");
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const bcrypt = require("bcryptjs");

const { mongoose } = require("./db");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const { authenticate } = require("./middleware/authenticate");

const port = process.env.PORT;
const app = express();

app.use(bodyParser.json());

app.post("/todos", authenticate, (req, res) => {
  var newTodo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  newTodo
    .save()
    .then(todo => res.status(200).send(todo))
    .catch(err => res.status(400).send(err.message));
});

app.get("/todos", authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id })
    .then(todos => res.send({ todos }))
    .catch(err => {
      res.status(400).send(err);
    });
});

app.get("/todos/:todo_id", authenticate, (req, res) => {
  let { todo_id } = req.params;
  if (!ObjectID.isValid(todo_id)) {
    return res.status(404).send("Not a valid ID");
  }
  Todo.findOne({
    _id: todo_id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send("Item not found");
      }
      res.status(200).send({ todo });
    })
    .catch(err => res.status(400).send(err.message));
});

app.delete("/todos/:todo_id", authenticate, (req, res) => {
  let { todo_id } = req.params;
  if (!ObjectID.isValid(todo_id)) {
    return res.status(404).send("Not a valid ID");
  }
  Todo.findOneAndDelete({ _id: todo_id, _creator: req.user._id })
    .then(todo => {
      if (!todo) {
        return res.status(404).send("No record with that ID found to delete.");
      }
      res.status(200).send({ todo, message: `${todo.text} has been deleted` });
    })

    .catch(err => res.status(400).send(err.message));
});

app.patch("/todos/:todo_id", authenticate, (req, res) => {
  let { todo_id } = req.params;
  let body = _.pick(req.body, ["text", "completed"]);

  if (!ObjectID.isValid(todo_id)) {
    return res.status(404).send("Not a valid ID");
  }

  if (Boolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({ _id: todo_id, _creator: req.user._id }, body, {
    new: true
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send("Todo not found");
      }
      res.status(200).send({ todo });
    })
    .catch(err => res.status(400).send(err.message));
});

//users routes
app.post("/users", (req, res) => {
  let body = _.pick(req.body, ["email", "password"]);
  newUser = new User(body);
  newUser
    .save()
    .then(() => newUser.generateAuthToken())
    .then(token =>
      res
        .header("x-auth", token)
        .status(200)
        .send({ newUser })
    )
    .catch(err => res.status(400).send(err.message));
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.post("/users/login", (req, res) => {
  let { email, password } = req.body;
  User.findByCredentials(email, password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res
          .header("x-auth", token)
          .status(200)
          .send({ user });
      });
    })
    .catch(err =>
      res.status(400).send("Login failed, incorrect email and/or password")
    );
});

app.delete("/users/logout", authenticate, (req, res) => {
  req.user
    .removeToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(err => res.status(400).send(err.message));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = { app };
