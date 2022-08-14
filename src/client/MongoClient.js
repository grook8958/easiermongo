'use-strict';

const { EventEmitter } = require('node:events');
const Mongoose = require('mongoose');
const { TypeError } = require('../errors');
const Options = require('../util/Options');
const Utils = require('../util/Utils');
const Database = require('../database/Database');
const ConnectionStringBuilder = require('../builders/ConnectionStringBuilder');
const { MongoClientEvents } = require('../util/Constants');

/**
 * The starting point of interacting with your MongoDB
 * @extends {EventEmitter}
 * @example
 * const { MongoClient } = require('easiermongo');
 * const path = require('path');
 *
 * const mongoClient = new MongoClient({
 * 	useFiles: true,
 * 	esm: false,
 * 	schemaFolderPath: path.join(__dirname, 'schema')
 * });
 *
 * mongoClient.on('ready', () => {
 * 	console.log('MongoClient ready!')
 * });
 *
 * mongoClient.connect('mongodb://127.0.0.1:27017');
 */
class MongoClient extends EventEmitter {
	/**
	 * The starting point of interacting with your MongoDB
	 * @param {MongoClientOptions} options The options of your client
	 */
	constructor(options) {
		super();

		/**
		 * Options for a client.
		 * @typedef {Object} MongoClientOptions
		 * @property {number} [connectionTimeout=5000] The amout of time in milliseconds the request will wait before rejecting.
		 * @property {string|null} [uri=undefined] The database connection string.
		 * @property {string} [schemaFolderPath=undefined] The folder in which the schema should be stored.
		 * @property {boolean} [esm=false] Wether it shoulf user ESM import or CommonJS require.
		 * @property {boolean} [useFiles=true] Wether the schemas should be stored in individual files or it should be dynamically added every time to the Database.
		 * @property {Array[string]} [ignoredFiles=[]] The files to ignore when `useFiles` is set to `true`
		 * @property {boolean} [makeCache=true] Wether easiermongo should cache documents
		 */

		/**
		 * The options that were used to initialize this client.
		 * @type {MongoClientOptions}
		 */
		this.options = Utils.mergeDefault(Options.createDefault(), options);

		/**
		 * The native mongoose connection to the database.
		 * @type {typeof Mongoose}
		 */
		this._mongoose = null;

		/**
		 * The Database to which a connection was opened.
		 * @type {Database}
		 */
		this.database = null;

		// Validate the options
		this._validatOptions();
	}

	/**
	 * The database to which a connection was opened.
	 * @type {Database}
	 */
	get db() {
		return this.database;
	}

	/**
	 * The connection URI
	 * @type {ConnectionStringBuilder|string|null}
	 */
	get uri() {
		return this.options.uri;
	}

	/**
	 * Opens a new connnection to your database.
	 * @param {ConnectionStringBuilder|string|null} uri The URI connection string of your database
	 * @returns {Promise<Database>}
	 * @example
	 * mongoClient.connect('mongodb://127.0.0.1:27017')
	 * 	.then(database => console.log(`Connected to ${database.name}!`))
	 * 	.catch(err => console.error(err))
	 */
	async connect(uri = this.options.uri) {
		if (!(uri instanceof ConnectionStringBuilder) && typeof uri !== 'string') {
			throw new TypeError('INVALID_TYPE', 'uri', 'string or a MongoConnectionString');
		}
		if (uri instanceof ConnectionStringBuilder) uri = uri.toString();
		// Connect to the database
		try {
			this._mongoose = await Mongoose.connect(uri, {
				connectTimeoutMS: this.options.connectionTimeout,
				waitQueueTimeoutMS: this.options.connectionTimeout,
			});
		} catch (error) {
			Utils.handleError(error);
		}

		// Create the database object
		this.database = new Database(this);

		this.emit(MongoClientEvents.CONNECTION_CONNECTED, this.database);

		// Start handling handling events
		this.handleEvents();

		// Emit the 'ready' event
		if (this.options.useFiles === false) this.emit(MongoClientEvents.READY);

		return this.database;
	}

	/**
	 * Close the connection from your database.
	 * @return {void}
	 */
	async disconnect() {
		await this._mongoose.disconnect();
		for (const fields in this) this[fields] = null;
	}

	/**
	 * Validates the options passed to the constructor
	 * @param {MongoClientOptions} options
	 * @private
	 */
	async _validatOptions(options = this.options) {
		if (typeof options.connectionTimeout !== 'undefined' && typeof options.connectionTimeout !== 'number') {
			throw new TypeError('MONGO_CLIENT_INVALID_OPTION', 'connetionTimeout', 'number');
		}
		if (
			typeof options.uri !== 'undefined' &&
			typeof options.uri !== 'string' &&
			!(options.uri instanceof ConnectionStringBuilder)
		) {
			throw new TypeError('MONGO_CLIENT_INVALID_OPTION', 'uri', 'string or a ConnectionStringBuilder');
		}
		if (typeof options.makeCache !== 'boolean') {
			throw new TypeError('MONGO_CLIENT_INVALID_OPTIONS', 'makeCache', 'boolean');
		}
		if (typeof options.esm !== 'boolean') throw new TypeError('MONGO_CLIENT_INVALID_OPTIONS', 'esm', 'boolean');
		if (Array.isArray(options.ignoredFiles) && !Utils.checkArray(options.ignoredFiles, 'string')) {
			throw new TypeError('MONGO_MONGO_CLIENT_INVALID_OPTIONS', 'ignoredFiles', 'Array of strings', true);
		}
		if (typeof options.schemaFolderPath !== 'string') {
			throw new TypeError('MONGO_CLIENT_INVALID_OPTIONS', 'schemaFolderPath', 'string');
		}
		if (typeof options.useFiles !== 'boolean') {
			throw new TypeError('MONGO_CLIENT_INVALID_OPTIONS', 'useFiles', 'boolean');
		}
	}

	/**
	 * Handles the events fired from Mongoose
	 * @return {void}
	 * @private
	 */
	handleEvents() {
		this._mongoose.connection.on('error', (err) => {
			this.emit(MongoClientEvents.ERROR, err);
		});

		this._mongoose.connection.on('disconnected', () => {
			this.emit(MongoClientEvents.CONNECTION_DISCONNECTED);
		});

		this._mongoose.connection.on('disconnecting', () => {
			this.emit(MongoClientEvents.CONNECTION_DISCONNECTING);
		});

		this._mongoose.connection.on('connected', () => {
			this.emit(MongoClientEvents.CONNECTION_CONNECTED);
		});

		this._mongoose.connection.on('connecting', () => {
			this.emit(MongoClientEvents.CONNECTION_CONNECTING);
		});

		this._mongoose.connection.on('reconnected', () => {
			this.emit(MongoClientEvents.CONNECTION_RECONNECTED);
		});

		this._mongoose.connection.on('close', () => {
			this.emit(MongoClientEvents.CONNECTION_CLOSE);
		});
	}
}

module.exports = MongoClient;
