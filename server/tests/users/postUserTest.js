const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../../server");
const { User } = require("./../../models/user");
const { users } = require("./../seed");

describe("POST /users", () => {
  it("Should create a new user", done => {
    let testUser = { email: "brady@k.com", password: "abcUser3" };
    request(app)
      .post("/users")
      .send(testUser)
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toExist();
        expect(res.body.email).toBe(testUser.email);
        expect(res.body._id).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done();
        }
        User.find({ email: testUser.email })
          .then(user => {
            expect(user.email).toBe(testUser.email);
            expect(user.password).toNotBe(testUser.password);
            done();
          })
          .catch(err => done(err));
      });
  });
  it("Should return 400 if invalid email info", done => {
    let badEmail = {
      _id: new ObjectID(),
      email: "kkkDDD",
      password: "abcUser3"
    };
    request(app)
      .post("/users")
      .send(badEmail)
      .expect(400)
      .end(done);
  });
  it("should return 400 if invalid password", done => {
    let badPwrd = {
      _id: new ObjectID(),
      email: "kkkDDD",
      password: "abc"
    };
    request(app)
      .post("/users")
      .send(badPwrd)
      .expect(400)
      .end(done);
  });
  it("should return 400 if duplicate Email", done => {
    request(app)
      .post("/users")
      .send(users[1])
      .expect(400)
      .end(done);
  });
});
