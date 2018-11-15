require("dotenv").config();
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

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

app.get("/todos", (req, res) => {
  Todo.find()
    .then(todos => res.send({ todos }))
    .catch(err => {
      res.status(400).send(err);
    });
});

app.get("/todos/:todo_id", (req, res) => {
  let { todo_id } = req.params;
  if (!ObjectID.isValid(todo_id)) {
    return res.status(404).send("Not a valid ID");
  }
  Todo.findById(todo_id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send("Item not found");
      }
      res.status(200).send({ todo });
    })
    .catch(err => res.status(400).send(err.message));
});

app.delete("/todos/:todo_id", (req, res) => {
  let { todo_id } = req.params;
  if (!ObjectID.isValid(todo_id)) {
    return res.status(404).send("Not a valid ID");
  }
  Todo.findOneAndDelete({ _id: todo_id })
    .then(todo => {
      if (!todo) {
        return res.status(404).send("No record with that ID found to delete.");
      }
      res.status(200).send({ todo, message: `${todo.text} has been deleted` });
    })

    .catch(err => res.status(400).send(err.message));
});

app.patch("/todos/:todo_id", (req, res) => {
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

  Todo.findOneAndUpdate({ _id: todo_id }, body, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send("Todo not found");
      }
      res.status(200).send({ todo });
    })
    .catch(err => res.status(400).send(err.message));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = { app };
