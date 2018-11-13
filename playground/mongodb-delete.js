const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/NodeTodoApp", (err, client) => {
  if (err) {
    return console.log("Not able to connect to db");
  }

  const db = client.db("NodeTodoApp");
  console.log("MongoDB connected Successfully");

  //delete many
  // db
  //   .collection("Todos")
  //   .deleteMany({ text: "Eat lunch" })
  //   .then(delItems => console.log(delItems.result))
  //   .catch(err => console.log(err));

  // db
  //   .collection("Todos")
  //   .deleteOne({ text: "Eat lunch" })
  //   .then(del => console.log(del.result))
  //   .catch(err => console.log(err));

  // db
  //   .collection("Todos")
  //   .findOneAndDelete({ completed: false })
  //   .then(docs => console.log(docs))
  //   .catch(err => console.log(err));

  // db
  //   .collection("Users")
  //   .deleteMany({ name: "Brady" })
  //   .then(del => console.log(del.result))
  //   .catch(err => console.log(err));
  db
    .collection("Users")
    .findOneAndDelete({ _id: new ObjectID("5beb33e7f6b59c16bc3afcbe") })
    .then(doc => console.log(doc))
    .catch(err => console.log(err));
  // client.close();
});
