const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/NodeTodoApp", (err, client) => {
  if (err) {
    return console.log("Not able to connect to db");
  }

  const db = client.db("NodeTodoApp");

  console.log("MongoDB connected Successfully");

  // db.collection("Todos").insertOne(
  //   {
  //     text: "Something to do",
  //     completed: false
  //   },
  //   (err, res) => {
  //     if (err) {
  //       return console.log("Not able to insert.", err);
  //     }
  //     console.log(JSON.stringify(res.ops, undefined, 2));
  //   }
  // );
  db.collection("Users").insertOne(
    {
      name: "Brady",
      age: 70,
      location: "Ogden"
    },
    (err, res) => {
      if (err) {
        return console.log("unable to add", err);
      }
      console.log(res.ops);
    }
  );
  client.close();
});
