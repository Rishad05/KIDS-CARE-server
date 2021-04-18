const express = require('express')
const bodyParser = require ('body-parser');
const cors =require ('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()




const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) =>{
  res.send("hello from db it's working")
})

app.listen(PORT)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j70me.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const classCollection = client.db("dayCare").collection("class");
  const reviewCollection = client.db("dayCare").collection("reviews");
  const enrollCollection = client.db("dayCare").collection("enrolls");
  const adminCollection = client.db("dayCare").collection("admin");
  
  
  
  app.post('/addClass',(req, res) => {
    const file = req.files.file;
    const className = req.body.className;
    const ageGroup = req.body.ageGroup;
    const classSize = req.body.classSize;
    const price = req.body.price;
    console.log(file, className, ageGroup, classSize, price);
    const newImg = file.data;
          const encImg = newImg.toString('base64');
  
          var image = {
              contentType: file.mimetype,
              size: file.size,
              img: Buffer.from(encImg, 'base64')
          };
  
          classCollection.insertOne({ className, ageGroup, classSize, price, image })
              .then(result => {
                  res.send(result.insertedCount > 0);
              })
      })




      app.get('/classes', (req, res) => {
        classCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })

      app.delete('/deleteClasses/:id', (req, res) => {
            const id = ObjectID(req.params.id)
            classCollection.deleteOne({ _id: id })
             .then(result => {
              res.send(result.deletedCount > 0)
                  })
              })
              



            app.get('/enrollClass/:id', (req, res) => {
                const id = ObjectID(req.params.id)
                classCollection.find({ _id: id })
                    .toArray((err,classes) => {
                        console.log(classes);
                        res.send(classes[0]);
                    })
            })
    });



    app.post('/giveFeedback', (req, res) => {
        reviewCollection.insertOne(req.body)
            .then(result => {
                res.send(result)
            })
    })


    app.get('/feedback', (req, res) => {
            reviewCollection.find({})
                .toArray((err, documents) => {
                    res.send(documents);
                })
        });


        app.post('/enrollAllClass',(req, res) => {
            const enrollClass = req.body;
            enrollCollection.insertOne(enrollClass)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
        })


        app.get('/enrollClassList', (req, res) => {
            enrollCollection.find({ email: req.query.email })
                .toArray((err, classes) => {
                    res.send(classes);
                })
        })



        app.get('/classOrderList', (req, res) => {
            enrollCollection.find()
              .toArray((err, orders) => {
                res.send(orders);
              })
          })
        
      
        app.patch('/updateClassOrderList/:id', (req, res) => {
            const id = ObjectID(req.params.id)
            enrollCollection.updateOne({ _id: id },
                    {
                        $set: { status: req.body.status }
                    })
                    .then(result => {
                        res.send(result.modifiedCount > 0 )
                    })
            })



            app.post('/addAdmin', (req, res) => {
                const email = req.body.email;
                adminCollection.insertOne({ email })
                    .then(result => {
                        res.send(result.insertedCount > 0);
                    })
            })
        
        
            app.get('/admin', (req, res) => {
                adminCollection.find({})
                    .toArray((err, documents) => {
                        res.send(documents);
                    })
            });
        
        
            app.post('/isAdmin', (req, res) => {
                const email = req.body.email;
                adminCollection.find({ email: email })
                    .toArray((err, admins) => {
                        res.send(admins.length > 0);
                    })
            })
           
    


});


