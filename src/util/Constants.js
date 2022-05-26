const { SchemaTypes, Schema } = require('mongoose');
const mongoose = require('mongoose');

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
    "STRING": String,
    "NUMBER": Number,
    "DATE": Date,
    "BUFFER": Buffer,
    "BOOLEAN": Boolean,
    "MIXED": {},
    "OBJECTID": new mongoose.Types.ObjectId(),
    "ARRAY": [],
    "DECIMAL128": SchemaTypes.Decimal128,
    "MAP": Map,  
}

/**
 * @typedef {Object} Constants
 * @property {SchemaFieldTypeResolvable} SchemaFieldTypes 
 */
