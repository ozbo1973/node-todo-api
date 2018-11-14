require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");

const port = process.env.PORT;
const app = express();

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  var newTodo = new Todo({
    text: req.body.text
  });
  newTodo
    .save()
    .then(todo => res.status(200).send(todo))
    .catch(err => res.status(400).send(err.message));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = { app };
