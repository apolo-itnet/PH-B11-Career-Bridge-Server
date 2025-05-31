const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

//Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nqjhfm8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobsCollection = client.db('careerBridge').collection('jobs');
    const candidateJobsCollection = client.db('careerBridge').collection('candidateJobsApply')
    
    //JOBS API
    app.get('/jobs', async (req, res) => {
      const cursor = jobsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.findOne(query);
      res.send(result);
    });


    // Candidate Jobs Apply API

    app.get('/applications', async (req, res) => {
      const email = req.query.email;

      const query = {
      candidate : email
      }
      const result = await candidateJobsCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/applications', async (req, res) => {
      const application = req.body;
      console.log(application);
      
      const result = await candidateJobsCollection.insertOne(application);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Career Bridge API is running');
})

app.listen(port, () => {
  console.log(`Career Bridge Server listening on port ${port}`)
})
