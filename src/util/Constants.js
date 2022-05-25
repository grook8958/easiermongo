const { SchemaTypes, Schema } = require('mongoose');
const mongoose = require('mongoose');

/**
 * The resolvable field types
 * * string
 * * number
 * * date
 * * buffer
 * * boolean
 * * mixed
 * * objectId
 * * array
 * * decimal128
 * * map
 * @typedef {"string"|"number"|"date"|"buffer"|"boolean"|"mixed"|"objectId"|"array"|"decimal128"|"objectId"|"map"|string} SchemaFieldTypeResolvable
 */
exports.SchemaFieldTypes = {
    "string": String,
    "number": Number,
    "date": Date,
    "buffer": Buffer,
    "boolean": Boolean,
    "mixed": {},
    "objectId": new mongoose.Types.ObjectId(),
    "array": [],
    "decimal128": SchemaTypes.Decimal128,
    "map": Map,  
}

/**
 * @typedef {Object} Constants
 * @property {SchemaFieldTypeResolvable} SchemaFieldTypes 
 */
