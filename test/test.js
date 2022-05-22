module.exports = () => {
    const path = require('path');

    const MongoClient = require('../src/client/MongoClient');
    const stringConstructor = require('../src/util/MongoConnectionString')

    const client = new MongoClient({
        schemaFolderPath: path.join(__dirname, 'schemas'),
        ignoredFiles: ['ignored.mjs'],
        esm: true,
        useFiles: false
    });

    client.on('ready', () => {
        console.log('connected')
        console.log(client.database.schemas.collection.get('test').model.get())
    });

    const string = new stringConstructor()
        .setHost('192.168.1.21')
        .setPort(27017)
        //.setAuthenticationSource('admin')
        .setDbName('icy')
        .setPassword('Cle;ent2007')
        .setUsername('grook8958')
    console.log(string.toString())
    //client.connect("mongodb://grook8958:Cle%3Bent2007@192.168.1.21:27017/icy?authSource=admin");

}         

//Creating a schema
const MongoSchema = require('../src/database/MongoSchema');

const schm = new MongoSchema({
    field1: {type: String, required: true}
});