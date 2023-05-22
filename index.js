const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iw3n7xd.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        const addingToysCollection = client.db('toyCar').collection('adding');


        // adding toys
        app.get('/adding', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await addingToysCollection.find(query).toArray();
            res.send(result)
        })
        // single data find
        app.get('/adding/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await addingToysCollection.findOne(query);
            res.send(result)
        })
        //  all data find
        app.get('/adding', async (req, res) => {
            const cursor = addingToysCollection.find().limit(20);
            const result = await cursor.toArray();
            res.send(result)
        })


        // sending all data to mongodb
        app.post('/adding', async (req, res) => {
            const adding = req.body;
            console.log(adding)
            const result = await addingToysCollection.insertOne(adding)
            res.send(result)
        })

        app.put('/adding/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedToy = req.body;
            const toy = {
                $set: {
                    price: updatedToy.price,
                    quantity: updatedToy.quantity,
                    details: updatedToy.details
                }
            }
            const result = await addingToysCollection.updateOne(filter, toy, option)
            res.send(result)
        })

        app.delete('/adding/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addingToysCollection.deleteOne(query);
            res.send(result)

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
    res.send('toy is running')
})

app.listen(port, () => {
    console.log(`toy is running on port:${port}`)
})