require('./test')()

const SchemaBuilder = require('../src/builders/SchemaBuilder');
const { SchemaFieldTypes } = require('../src/util/Constants');

const builder = new SchemaBuilder();

builder.addField(field => field.setName('_id').setRequired(true).setType("string"))
console.log(builder.toJSON())
console.log(builder.toSchema())