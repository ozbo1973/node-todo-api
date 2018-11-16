const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const isEmail = require("validator/lib/isEmail");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();
  return _.pick(userObject, ["_id", "email"]);
};

userSchema.methods.generateAuthToken = function() {
  let user = this;
  const userid = user._id.toHexString();
  const access = "auth";
  const token = jwt.sign({ _id: userid, access }, "abcSecret").toString();

  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save().then(() => token);
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
