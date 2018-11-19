const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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
  const token = jwt
    .sign({ _id: userid, access }, process.env.JWT_SECRET)
    .toString();

  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save().then(() => token);
};

userSchema.methods.removeToken = function(token) {
  let user = this;
  return user.updateOne({
    $pull: {
      tokens: { token }
    }
  });
};

userSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject(e);
  }
  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

userSchema.statics.findByCredentials = function(email, password) {
  const User = this;

  return User.findOne({ email })
    .then(foundUser => {
      if (!foundUser) {
        return Promise.reject();
      }
      return new Promise((res, rej) => {
        bcrypt.compare(password, foundUser.password, (err, result) => {
          if (result) {
            res(foundUser);
          }
          rej();
        });
      });
    })
    .catch(err => Promise.reject());
};

userSchema.pre("save", function(next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
