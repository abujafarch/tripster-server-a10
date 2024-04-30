const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
//app.use(cors({
//     origin:['http://localhost:5173', 'https://coffee-store-120d4.web.app']
// }))
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f46fr3f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const database = client.db("tripsterDB")
        const touristSpotsCollection = database.collection("touristSpots")
        const countriesCollection = database.collection("countriesDB")

        app.get('/countries', async (req, res) => {
            const cursor = countriesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/tourist-spots', async (req, res) => {
            const cursor = touristSpotsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/my-lists/:email', async (req, res) => {
            const email = req.params.email
            const query = { user_email: email }
            const cursor = touristSpotsCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/update-spot/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await touristSpotsCollection.findOne(query)
            res.send(result)
        })

        app.get('/view-details/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await touristSpotsCollection.findOne(query)
            res.send(result)
        })

        app.get('/:countryName', async (req, res) => {
            const countryName = req.params.countryName
            const query = { country_name: countryName }
            const cursor = touristSpotsCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/my-lists/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await touristSpotsCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/update-spot/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedSpot = req.body
            const newUpdatedSpot = {
                $set: {
                    image: updatedSpot.image,
                    tourists_spot_name: updatedSpot.tourists_spot_name,
                    country_name: updatedSpot.country_name,
                    location: updatedSpot.location,
                    short_description: updatedSpot.short_description,
                    average_cost: updatedSpot.average_cost,
                    seasonality: updatedSpot.seasonality,
                    travel_time: updatedSpot.travel_time,
                    totalVisitorPerYear: updatedSpot.totalVisitorPerYear
                }
            }
            const result = await touristSpotsCollection.updateOne(filter, newUpdatedSpot, options)
            res.send(result)
        })

        app.post('/add-spot', async (req, res) => {
            const newSpot = req.body
            console.log(newSpot)
            const result = await touristSpotsCollection.insertOne(newSpot)
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
    res.send('Tripster server is running')
})

app.listen(port, () => {
    console.log("tripster server is running on port:", port)
})