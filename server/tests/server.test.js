require("./../config/config");
const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { todos, populateTodos, users, populateUsers } = require("./seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

require("./todos/postTodoTest");
require("./todos/getTodoTest");
require("./todos/deleteTodoTest");
require("./todos/updateTodoTest");

require("./users/getUserTest");
require("./users/postUserTest");
require("./users/userLoginTest");
require("./users/userLogoutTest");
