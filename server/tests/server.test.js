const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");

const todos = [
  { _id: new ObjectID(), text: "First todo" },
  {
    _id: new ObjectID(),
    text: "Second todo",
    completed: true,
    completedAt: 2356
  }
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

describe("DELETE/todos/:todo_id", () => {
  it("Should delete a todo", done => {
    var todo_id = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${todo_id}`)
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
  it("Should give 404 error for not found", done => {
    var todo_id = new ObjectID();
    request(app)
      .delete(`/todos/${todo_id}`)
      .expect(404)
      .end(done);
  });
  it("Should give error of Invalid ID 404", done => {
    request(app)
      .delete("/todos/abc123")
      .expect(404)
      .end(done);
  });
});

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

describe("POST /users", () => {
  it("Should create a new User", done => {
    let newUser = {
      email: "jjj@jj.com",
      password: "abc123"
    };
    request(app)
      .post("/users")
      .send(newUser)
      .expect(200)
      .expect(res => {
        expect(res.body.email).toBe(newUser.email);
        expect(res.body.password).toBe(newUser.password);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.find({ email: newUser.email })
          .then(user => {
            expect(user.length).toBe(1);
            done();
          })
          .catch(err => done(err));
      });
  });
});
