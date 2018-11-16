const jwt = require("jsonwebtoken");
//create secret key.
const secret = "adisisg3452358547wedsoiuiojfw";
//create the user id and password ObjectID
const userdata = {
  id: 5,
  password: "abc123"
};
//sign the jwt with secret.
let hashed = jwt.sign(userdata, secret);
console.log("Hashed:", hashed);

//verify with secret.
let decoded = jwt.verify(hashed, secret);
console.log("decoded: ", decoded);
