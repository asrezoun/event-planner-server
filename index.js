const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();

const port = process.env.PORT||8000;

app.use(cors());
app.use(bodyParser.json());



console.log(process.env.DB_USER);
app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j2qvb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("error: ",err);
  const eventCollection = client.db("eventPlanner").collection("events");
  const adminCollection = client.db("eventPlanner").collection("admins");
  const reviewCollection = client.db("eventPlanner").collection("reviews");
  const orderCollection = client.db("eventPlanner").collection("orders");
  // perform actions on the collection object
  
  ///add events to database
  app.post('/addEvents',(req, res) => {
      const newEvents = req.body;
      console.log(newEvents);

      eventCollection.insertOne(newEvents)
      .then(result =>{
          console.log("inserted count: ", result.insertedCount);
          res.send(result.insertedCount>0);
      })
  })

  ///add a admin
  app.post('/addAdmin',(req,res)=>{
      const newAdmin = req.body;
      console.log(newAdmin);

      adminCollection.insertOne(newAdmin)
      .then(result =>{
          console.log("inserted count admin: ", result.insertedCount);
          res.send(result.insertedCount>0);
      })

  })
  ///add a review
  app.post('/addReview',(req,res)=>{
    const newReview = req.body;
    console.log("new review",newReview);

    reviewCollection.insertOne(newReview)
    .then(result=>{
      console.log("inserted count review: ", result.insertedCount);
      res.send(result.insertedCount>0);
    })
  })
  ///add a order
  app.post('/addOrder',(req,res)=>{
    const newOrder = req.body;
    console.log("new order: ",newOrder);

    orderCollection.insertOne(newOrder)
    .then(result=>{
      console.log("order count review: ", result.insertedCount);
      res.send(result.insertedCount>0);
    })
  })
  ///get events data
  app.get('/eventData',(req, res)=>{

    eventCollection.find()
    .toArray((err,items)=>{
      err && console.log("event get error: ", err);
      res.send(items);
    })
  })

  //get admin list
  app.get('/getAdminList', (req, res)=>{

    adminCollection.find()
    .toArray((err,items)=>{
      err & console.log("get admin error: ",err);
      res.send(items);
    })
  })

  ///get all reviews
  app.get('/getReviews',(req,res)=>{

    reviewCollection.find()
    .toArray((err,items)=>{
      err & console.log("get review error: ",err);
      res.send(items);
    })
  })
  ///get all orders
  app.get('/getAllOrders',(req,res)=>{

    orderCollection.find()
    .toArray((err,items)=>{
      err & console.log("get all order error: ",err);
      res.send(items);
    })
  })
  ///get single order
  app.get('/singleOrder/:id',(req, res) =>{
    orderCollection.find({_id: ObjectID(req.params.id)})
    .toArray((err,documents) =>{
      res.send(documents[0]);
    })
  })

  ///get order list by email filter
  app.get('/orderList',(req, res)=>{
    orderCollection.find({email: req.query.email})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  //check email for admin
  app.get('/adminList',(req, res)=>{
    adminCollection.find({email: req.query.email})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })
  ///delete one product
  app.delete('/deleteProduct/:id',(req,res) => {

    const id = ObjectID(req.params.id);
    console.log("delete this",id);
    orderCollection.findOneAndDelete({_id: id})
    .then(result => {
      console.log(result);
      res.send(result)})
  })

app.patch('/update/:id',(req,res)=>{
  const id = ObjectID(req.params.id);
  orderCollection.updateOne({_id: id},
    {
      $set: {status: req.body.status}
    })
    .then(result => {
      console.log(result)
      res.send("update from backend success");
    })
})
  console.log("database connected")
  //client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

