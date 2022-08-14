'use-strict';

const { SchemaTypes } = require('mongoose');

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
	MAP: SchemaTypes.Map,
};

/**
 * The MongoClient Events
 * * READY
 * * ERROR
 * * CONNECTION_DISCONNECTED
 * * CONNECTION_DISCONNECTING
 * * CONNECTION_CONNECTED
 * * CONNECTION_CONNECTING
 * * CONNECTION_RECONNECTED
 * * CONNECTION_CLOSE
 * @typedef {"READY"|"ERROR"|"CONNECTION_DISCONNECTED"|"CONNECTION_DISCONNECTING"|"CONNECTION_CONNECTED"|"CONNECTION_CONNECTING"|"CONNECTION_RECONNECTED"|"CONNECTION_CLOSE"|"REGISTERING_FILE"} MongoClientEvent
 */
exports.MongoClientEvents = {
	READY: 'ready',
	ERROR: 'error',
	CONNECTION_DISCONNECTED: 'disconnected',
	CONNECTION_DISCONNECTING: 'disconnecting',
	CONNECTION_CONNECTED: 'connected',
	CONNECTION_CONNECTING: 'connecting',
	CONNECTION_RECONNECTED: 'reconnected',
	CONNECTION_CLOSE: 'close',
	REGISTERING_FILE: 'file'
}

/**
 * @typedef {Object} Constants
 * @property {SchemaFieldTypeResolvable} SchemaFieldTypes
 * @property {MongoClientEvent} MongoClientEvents
 */
