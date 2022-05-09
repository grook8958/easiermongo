module.exports = () => {


    const MongoClient = require('../src/client/MongoClient');

    const client = new MongoClient();

    client.connect('91.267.265.22');
}