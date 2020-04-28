
const express = require('express');
const bodyParser = require ('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//Mongo DB Atlas
//const dbConnectionString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.CLUSTER_NAME}.mongodb.net/node-mongo-example?retryWrites=true&w=majority`;

//Docker Container
const dbConnectionString = `mongodb://mongo/node-mongo-example?retryWrites=true&w=majority`;
const client = new MongoClient(dbConnectionString, {useUnifiedTopology: true});

const run = async () => {
    
    await client.connect();
    
    const db = client.db('node-mongo-example');
    const samplesCollection = db.collection('samples');

    app.get('/', (req, res) => {
        res.render('index', {})
    });

    app.post('/quotes', async (req, res) => {
        await samplesCollection.insertOne(req.body);
        res.redirect('/quotes');
    });

    app.get('/quotes', async (req, res) => {
        const results = await samplesCollection.find().toArray();
        res.render('quotes', {quotes: results});
    });

    app.listen(3000, () => {
        console.log('listening on 3000');
    });
};
  
run();
