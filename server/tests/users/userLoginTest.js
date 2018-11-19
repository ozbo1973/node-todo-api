const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../../server");
const { User } = require("./../../models/user");
const { users } = require("./../seed");

let route = "/users/login";

describe("POST users/login", () => {
  it("Should log in a user", done => {
    const email = users[1].email;
    const password = users[1].password;
    request(app)
      .post(route)
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.body.user._id).toExist();
        expect(res.headers["x-auth"]).toExist();
        expect(res.body.user.email).toBe(email);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(res.body.user._id)
          .then(user => {
            expect(user.tokens[1]).toInclude({
              access: "auth",
              token: res.headers["x-auth"]
            });
            done();
          })
          .catch(err => done(err));
      });
  });

  it("Should give 400 error for wrong password and not add token", done => {
    request(app)
      .post(route)
      .send({ email: users[1].email, password: "abbbdert" })
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({});
        expect(res.headers["x-auth"]).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(err => done(err));
      });
  });
  it("Should give 400 error for wrong email and not add token", done => {
    request(app)
      .post(route)
      .send({ email: users[1].email + "j", password: "abc123" })
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({});
        expect(res.headers["x-auth"]).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(err => done(err));
      });
  });
});
