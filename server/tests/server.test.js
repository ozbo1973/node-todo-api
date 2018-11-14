const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");

const todos = [
  { _id: new ObjectID(), text: "First todo" },
  { _id: new ObjectID(), text: "Second todo" }
];

beforeEach(done => {
  Todo.deleteMany()
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
});

describe("POST /todos", () => {
  it("Should create a new todo", done => {
    var text = "This is a todo";
    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(err => done(err));
      });
  });

  it("should not create a record", done => {
    var text = "";
    request(app)
      .post("/todos")
      .send({ text })
      .expect(400)
      .expect(res => {
        expect(res.body.text).toBe(undefined);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(err => done(err));
      });
  });
});

describe("Get /todos", () => {
  it("Should get all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe("GET /todos/:todo_id", () => {
  it("should get an idividual todo", done => {
    var todo_id = todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${todo_id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("Should return 404 if not found", done => {
    var badID = new ObjectID();
    request(app)
      .get(`/todos/${badID.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("Should return 404 for Invalid url", done => {
    var invalidID = "abc123";
    request(app)
      .get(`/todos/${invalidID}`)
      .expect(404)
      .end(done);
  });
});
