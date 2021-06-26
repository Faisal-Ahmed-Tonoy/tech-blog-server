const express = require('express');
const ObjectId = require("mongodb").ObjectID;
const bodyParser = require('body-parser');

const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://blogUser:56789@cluster0.p0njw.mongodb.net/retrodb?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port =5000;

 






const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogCollection = client.db("retrodb").collection("blog");
  const adminCollection = client.db("retrodb").collection("admin");
  // perform actions on the collection object
  app.get('/',(req,res) =>{
    res.send("Thank you for calling me")
} )
app.get('/blogs', (req, res) => {
  blogCollection.find({})
      .toArray((err, items) => {
          res.send(items)
          console.log('from database', items)

      })

})
app.get('/blog/:id', (req, res) => {
  blogCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
          res.send(documents[0]);
      })
})

app.delete("/delete/:id", (req, res) => {
  blogCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
          console.log(result);

          res.send(result.deletedCount > 0);




      })
})


app.post('/addAdmin', (req, res) => {
  const newAdmin = req.body;
  console.log('adding new event:', newAdmin)
  adminCollection.insertOne(newAdmin)
      .then(result => {
          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
      })




})


app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  console.log(password);
  adminCollection.find({ email: email, password: password})
      .toArray((err, admin) => {
          res.send(admin.length > 0);
      });
});

app.post('/addBlog', (req, res) => {
  const newBlog = req.body;
  console.log('adding new event:', newBlog)
  blogCollection.insertOne(newBlog)
      .then(result => {
          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
      })


})


 
});













app.listen(process.env.PORT || port)