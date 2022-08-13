const express = require("express");
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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


        app.get('/member', async (req, res) => {
            const query = {};
            const cursor = memberCollection.find(query);
            const members = await cursor.toArray();
            res.send(members)
        })
        app.post('/createTask', async (req, res) => {
            const data = req.body;
            // const query = { title: createTask.title, member: createTask.member, description: createTask.description }
            const result = await taskCollection.insertOne(data);
            return res.send(result);
        })
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