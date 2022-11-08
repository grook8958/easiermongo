const DocumentBuilder = require('../src/builders/DocumentBuilder');
const { pull, push, increment } = require('../src');
const mongoose = require('mongoose');

module.exports = () => {
	const path = require('path');
	const { AUTH } = require('./auth');
	const MongoClient = require('../src/client/MongoClient');
	const ConnectionStringBuilder = require('../src/builders/ConnectionStringBuilder');
	const SchemaBuilder = require('../src/builders/SchemaBuilder');

	const client = new MongoClient({
		schemaFolderPath: path.join(__dirname, 'schemas'),
		ignoredFiles: ['ignored.mjs'],
		esm: true,
		useFiles: false,
	});

	const schema = new SchemaBuilder()
		.addField((field) => field.setName('_id').setType('STRING').setRequired(true))
		.addField((field) => field.setName('test').setType('NUMBER'))
		.addField((field) => field.setName('array').setType('ARRAY'))
		//.setOptions({ expires: 30 })
		.addField((field) => field.setName('ttl').setType('DATE').setTTL(30));

	client.on('ready', async () => {
		console.log('connected');
		client.database.schemas.addSchema('tests', schema);
		const model = client.database.schemas.collection.get('tests').model;
		await model.create({
			_id: 'some-id',
			test: 1,
			array: [],
			ttl: Date.now(),
		});
		/*await model.create(
			new DocumentBuilder()
				.setId('some-id')
				.addField('test', 10)
				.addField('array', ['value1', 'value3', 'ee']) .addField('ttl', Date.now()),
		);*/
		//const doc = await model.get('some-id');
		//console.log(doc)

		model.onExpire((id, document) => {
			console.log(id, document);
		});
		//console.log(Object.getOwnPropertyDescriptors(doc));
		//await model.edit('some-id', {
		//...pull('array', 'ee'),
		//	...push('array', 'value2'),
		//});
		//console.log(await model.get('some-id'));
	});

	const string = new ConnectionStringBuilder()
		.setHost(AUTH.ip)
		.setPort(AUTH.port)
		.setAuthenticationSource('admin')
		.setDbName('icy')
		.setPassword(AUTH.password)
		.setUsername('grook8958');
	console.log(string.toString());

	//client.connect("mongodb://grook8958:Cle%3Bent2007@192.168.1.21:27017/icy?authSource=admin");

	client.connect(string);
};
