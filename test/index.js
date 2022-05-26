require('./test')()

const SchemaBuilder = require('../src/builders/SchemaBuilder');
const { SchemaFieldTypes } = require('../src/util/Constants');

const builder = new SchemaBuilder();

builder.addField(field => field.setName('_id').setRequired(true).setType(SchemaFieldTypes.OBJECTID))
console.log(builder.toSchema())