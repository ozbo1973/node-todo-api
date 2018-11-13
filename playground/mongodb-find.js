const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/NodeTodoApp", (err, client) => {
  if (err) {
    return console.log("Not able to connect to db");
  }

  const db = client.db("NodeTodoApp");
  console.log("MongoDB connected Successfully");

  // db
  //   .collection("Todos")
  //   .find({ _id: new ObjectID("5beb3134e1b4ee39247d6614") })
  //   .toArray()
  //   .then(docs => console.log(JSON.stringify(docs, undefined, 2)))
  //   .catch(err => console.log(err));

  // db
  //   .collection("Todos")
  //   .find()
  //   .count()
  //   .then(count => console.log(`total count: ${count}`))
  //   .catch(err => console.log(err));

  db
    .collection("Users")
    .find({ name: "Brady" })
    .toArray()
    .then(docs => console.log(docs))
    .catch(console.log(err));

  // client.close();
});
