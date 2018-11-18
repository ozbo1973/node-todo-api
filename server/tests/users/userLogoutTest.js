const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../../server");
const { User } = require("./../../models/user");
const { users } = require("./../seed");

let route = "/users/logout";

describe("Delete /users/logout", () => {
  it("Should remove token and log user out", done => {
    request(app)
      .delete(route)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res).toEqual({});
      })
      .end((err, res) => {
        if (err) {
          return done();
        }
        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(err => done(err));
      });
  });
  it("Should give 401 error when not logged in", done => {
    request(app)
      .delete(route)
      .set("x-auth", "")
      .expect(401)
      .end(done);
  });
});
