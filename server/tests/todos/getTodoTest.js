const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../../server");
const { Todo } = require("./../../models/todo");
const { todos, users } = require("./../seed");

describe("Get /todos", () => {
  it("Should get all todos of user", done => {
    request(app)
      .get("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe("GET /todos/:todo_id", () => {
  it("should get an idividual todo", done => {
    var todo_id = todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${todo_id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("Should return 404 if created by another user", done => {
    var badID = todos[1]._id;
    request(app)
      .get(`/todos/${badID.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("Should return 404 if no ID found", done => {
    var badID = new ObjectID();
    request(app)
      .get(`/todos/${badID.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("Should return 404 for Invalid url", done => {
    var invalidID = "abc123";
    request(app)
      .get(`/todos/${invalidID}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});
