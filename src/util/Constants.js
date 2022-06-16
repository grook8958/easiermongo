'use-strict'

const { SchemaTypes, Schema } = require('mongoose')

/**
 * The resolvable field types
 * * STRING
 * * NUMBER
 * * DATE
 * * BUFFER
 * * BOOLEAN
 * * MIXED
 * * OBJECTID
 * * ARRAY
 * * DECIMAL128
 * * MAP
 * @typedef {"STRING"|"NUMBER"|"DATE"|"BUFFER"|"BOOLEAN"|"MIXED"|"OBJECTID"|"ARRAY"|"DECIMAL128|"MAP"|string} SchemaFieldTypeResolvable
 */
exports.SchemaFieldTypes = {
  STRING: SchemaTypes.String,
  NUMBER: SchemaTypes.Number,
  DATE: SchemaTypes.Date,
  BUFFER: SchemaTypes.Buffer,
  BOOLEAN: SchemaTypes.Boolean,
  MIXED: SchemaTypes.Mixed,
  OBJECTID: SchemaTypes.ObjectId,
  ARRAY: SchemaTypes.Array,
  DECIMAL128: SchemaTypes.Decimal128,
  MAP: SchemaTypes.Map
}

/**
 * @typedef {Object} Constants
 * @property {SchemaFieldTypeResolvable} SchemaFieldTypes
 */
