const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/NodeTodoApp", (err, client) => {
  if (err) {
    return console.log("Not able to connect to db");
  }

  const db = client.db("NodeTodoApp");
  console.log("MongoDB connected Successfully");

  db
    .collection("Users")
    .findOneAndUpdate(
      { _id: new ObjectID("5beb3a6c65b54c4a34af4546") },
      { $set: { name: "Brady" }, $inc: { age: 7 } },
      { returnOriginal: false }
    )
    .then(docs => console.log(docs))
    .catch(console.log(err));

  // client.close();
});
