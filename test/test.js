module.exports = () => {
    const path = require('path');

    const MongoClient = require('../src/client/MongoClient');
    const ConnectionStringBuilder = require('../src/builders/ConnectionStringBuilder');
    const SchemaBuilder = require('../src/builders/SchemaBuilder')

    const client = new MongoClient({
        schemaFolderPath: path.join(__dirname, 'schemas'),
        ignoredFiles: ['ignored.mjs'],
        esm: true,
        useFiles: false
    });

    const schema = new SchemaBuilder()
        .addField(field => field.setName('_id').setType('STRING').setRequired(true))
        .addField(field => field.setName("field2").setType("STRING").setDefault('someDefault'))

    client.on('ready', async () => {
        console.log('connected')
        client.database.schemas.addSchema("tests", schema);
        const {model} = client.database.schemas.collection.get('tests');
        const data = await model.get("id123456");
        await model.edit(data._id, {_id: data._id, field2: "someOtherField"}, {new: true});
        console.log(model.cache.get('id123456'))
    });

    const string = new ConnectionStringBuilder()
        .setHost('some-ip')
        .setPort(37017)
        .setAuthenticationSource('admin')
        .setDbName('icy')
        .setPassword('some-password')
        .setUsername('grook8958')
    console.log(string.toString())
    //client.connect("mongodb://grook8958:Cle%3Bent2007@192.168.1.21:27017/icy?authSource=admin");

    client.connect(string);
}         