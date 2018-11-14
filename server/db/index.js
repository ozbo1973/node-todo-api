const mongoose = require("mongoose");

mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost:27017/node-todo-api", {
  keepAlive: true,
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);

module.exports = {
  mongoose
};
