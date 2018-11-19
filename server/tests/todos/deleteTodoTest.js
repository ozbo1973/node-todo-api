const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../../server");
const { Todo } = require("./../../models/todo");
const { todos, users } = require("./../seed");

describe("DELETE/todos/:todo_id", () => {
  it("Should delete a todo", done => {
    var todo_id = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${todo_id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(todo_id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(todo_id)
          .then(res => {
            expect(res).toNotExist();
            done();
          })
          .catch(err => done(err));
      });
  });

  it("Should not delete a todo of another user", done => {
    var todo_id = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${todo_id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(todo_id)
          .then(res => {
            expect(res).toExist();
            done();
          })
          .catch(err => done(err));
      });
  });

  it("Should give 404 error for not found", done => {
    var todo_id = new ObjectID();
    request(app)
      .delete(`/todos/${todo_id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it("Should give error of Invalid ID 404", done => {
    request(app)
      .delete("/todos/abc123")
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});
