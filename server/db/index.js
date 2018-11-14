const mongoose = require("mongoose");

// mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);

module.exports = {
  mongoose
};
