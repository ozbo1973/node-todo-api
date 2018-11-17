const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var password = "abc123";

var saltPwrd = bcrypt.genSalt(10, (err, salt) => {
  return salt;
});
console.log(saltPwrd);
var hashedPwrd = bcrypt.hash(password, saltPwrd, (err, hash) => {
  return hash;
});

bcrypt.compare(password, hashedPwrd, (err, res) => {
  console.log(res);
});

// //create secret key.
// const secret = "adisisg3452358547wedsoiuiojfw";
// //create the user id and password ObjectID
// const userdata = {
//   id: 5,
//   password: "abc123"
// };
// //sign the jwt with secret.
// let hashed = jwt.sign(userdata, secret);
// console.log("Hashed:", hashed);
//
// //verify with secret.
// let decoded = jwt.verify(hashed, secret);
// console.log("decoded: ", decoded);
