const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../../server");
const { Todo } = require("./../../models/todo");
const { todos } = require("./../seed");

describe("PATCH /todos/:todo_id", () => {
  it("Should update the todo", done => {
    let todo_id = todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${todo_id}`)
      .send({ text: "updated test", completed: true })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(todo_id)
          .then(todo => {
            expect(res.body.todo.text).toBe("updated test");
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA("number");
            done();
          })
          .catch(err => done(err));
      });
  });
  it("Should clear completedAt when changed to false", done => {
    let todo_id = todos[1]._id.toHexString();
    request(app)
      .patch(`/todos/${todo_id}`)
      .send({ text: "updated to false", completed: false })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe("updated to false");
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});
