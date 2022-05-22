require('./test')()

const SchemaBuilder = require('../src/builders/SchemaBuilder');

const builder = new SchemaBuilder();

builder.addField(field => field.setName('_id').setRequired(true))

builder.toJSON()