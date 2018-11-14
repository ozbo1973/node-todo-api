const { mongoose } = require("./../server/db");
const { User } = require("./../server/models/user");

var user_id = "5beb71dd5db7581cac8261601";

User.findById(user_id)
  .then(user => {
    if (!user) {
      return console.log("User not found.");
    }
    console.log("User: ", user);
  })
  .catch(err => console.log(err.message));
