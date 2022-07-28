# Easiermongo

![Downloads](https://img.shields.io/npm/dt/easiermongo) ![Version](https://img.shields.io/npm/v/easiermongo) ![License](https://img.shields.io/npm/l/easiermongo)

_For additional information please visit our [website](https://easiermongo.js.org)_

## About

Easiermongo is a simple [NodeJS](https://nodejs.org) library for begginers with [MongoDB](http://mongodb.com).
It has a very object-oriented approach which makes your code cleaner and easier to read.
The main goals of this library is not 100% cover the MongoDB API but instead cover in the easiest way possible the basics.

## Getting

### Installation

`npm i easiermongo`

### Basic Usage

Open a connection to your database

```js
const { MongoClient } = require('easiermongo');
const client = new MongoClient({ uri: 'your-uri-here' });

client.on('ready', () => {
	console.log(`Connected to ${client.database.name}!`);
});

client.connect();
```

There are two ways to register a schema, adding them manually or adding them via the file system.

**Register manually**

```js
const { SchemaBuilder } = require('easiermongo');

const mySchema = new SchemaBuilder()
	.addField((field) => field.setName('myField').setType('STRING'))
	.addField((field) => field.setName('mySecondField').setType('NUMBER').setDefault(0));
//Register your schema
client.database.schemas.addSchema('mySchemaName', mySchema);
```

**Register vie File System**
Download [this](https://easiermongo.js.org/examples/getting-started-fs.zip) example.

Once connected and your schemas are registered you may start performing actions

```js
const mySchema = client.database.schemas.collection.get('your-schema-name').model;
//You may also get your schema like this: const mySchema = client.database.schemas.SCHEMA_NAME_HERE;
const result = await mySchema.get('some-id');

console.log(result);
```

Click [here](https://easiermongo.js.org/examples/getting-started.js) to download the first example and click [here](https://easiermongo.js.org/examples/getting-started-fs.zip) for the example using the file system.

## Useful Links

- [Webiste](https://easiermongo.js.org)
- [Documentation](https://easiermongo.js.org/docs/v1/)
- [GitHub](https://github.com/grook8958/easiermongo)
- [npm](https://npmjs.org/package/easiermongo)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
