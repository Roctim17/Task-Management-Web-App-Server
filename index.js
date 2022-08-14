const express = require("express");
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9conth7.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const memberCollection = client.db('task_management').collection('members');
        const taskCollection = client.db('task_management').collection('tasks');

        // get api

        app.get('/member', async (req, res) => {
            const query = {};
            const cursor = memberCollection.find(query);
            const members = await cursor.toArray();
            res.send(members)
        })
        app.get("/createTask", async (req, res) => {
            const task = await taskCollection.find({}).toArray();
            res.send(task);
        });

        app.get('/createTask/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const tasks = await taskCollection.find(query).toArray();
            res.send(tasks);
        });

        // Post Api 
        //  Add new task api 
        app.post('/createTask/:email', async (req, res) => {
            const data = req.body;
            const result = await taskCollection.insertOne(data);
            return res.send(result);
        })

        app.put("/updatedTask/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedData = {
                $set: data,
            };
            const result = await taskCollection.updateOne(filter, updatedData, option);
            res.send(result);
        });
        app.put("/member/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedData = {
                $set: data,
            };
            const result = await memberCollection.updateOne(filter, updatedData, option);
            res.send(result);
        });

        //  Add new Member api 
        app.post('/member', async (req, res) => {
            const newMember = req.body;
            const query = { email: newMember.email }
            const exists = await memberCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, newMember: exists })
            }
            const result = await memberCollection.insertOne(newMember)
            return res.send({ success: true, result });
        })
        // Delete API
        // Delete API Task
        app.delete("/createTask/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });
        // Delete API Member
        app.delete("/member/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await memberCollection.deleteOne(query);
            res.send(result);
        });



    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("hello Brain Station")
});

app.listen(port, () => {
    console.log(port)
})