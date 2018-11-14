const { mongoose } = require("./../server/db");
const { User } = require("./../server/models/user");
const { Todo } = require("./../server/models/todo");

// Todo.deleteMany({}).then(res => console.log(res));

Todo.findOneAndDelete("5bec9bd40c6f61318c00ac1e")
  .then(res => console.log("Deleted", res))
  .catch(err => console.log(err));
