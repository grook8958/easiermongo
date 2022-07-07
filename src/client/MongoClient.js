'use-strict'

const { EventEmitter } = require('node:events')
const Mongoose = require('mongoose')
const { TypeError } = require('../errors')
const Options = require('../util/Options')
const Utils = require('../util/Utils')
const path = require('path')
const Database = require('../database/Database')
const ConnectionStringBuilder = require('../builders/ConnectionStringBuilder')

/**
 * The starting point of interacting with your MongoDB
 * @extends {EventEmitter}
 */
class MongoClient extends EventEmitter {
  /**
     * The starting point of interacting with your MongoDB
     * @param {MongoClientOptions} options The options of your client
     */
  constructor (options) {
    super()

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
    this.options = Utils.mergeDefault(Options.createDefault(), options)

    /**
         * The native mongoose connection to the database.
         * @type {typeof Mongoose}
         */
    this._mongoose = null

    /**
         * The Database to which a connection was opened.
         * @type {Database}
         */
    this.database = null

    // Validate the options
    this._validatOptions()

  }

  /**
     * The database to which a connection was opened.
     * @type {Database}
     */
  get db () {
    return this.database
  }

  /**
     * The connection URI
     * @type {ConnectionStringBuilder|string|null}
     */
  get uri () {
    return this.options.uri
  }

  /**
     * Opens a new connnection to your database.
     * @param {ConnectionStringBuilder|string|null} uri The URI connection string of your database
     * @returns {Promise<Database>}
     */
  async connect (uri = this.options.uri) {
    if (!(uri instanceof ConnectionStringBuilder) && typeof uri !== 'string') throw new TypeError('INVALID_TYPE', 'uri', 'string or a MongoConnectionString')
    if (uri instanceof ConnectionStringBuilder) uri = uri.toString()
    // Connect to the database
    try {
      this._mongoose = await Mongoose.connect(uri, { connectTimeoutMS: this.options.connectionTimeout, waitQueueTimeoutMS: this.options.connectionTimeout })
    } catch (error) {
      Utils.handleError(error)
    }

    // Create the database object
    this.database = new Database(this)

    this.emit('connected', this.database)

    // Start handling handling events
    this.handleEvents()

    // Emit the 'ready' event
    if (this.options.useFiles === false) this.emit('ready')

    return this.database
  }

  /**
     * Close the connection from your database.
     * @return {void}
     */
  async disconnect () {
    await this._mongoose.disconnect()
    for (const fields in this) this[fields] = null
  }

  /**
     * Validates the options passed to the constructor
     * @param {MongoClientOptions} options
     * @private
     */
  async _validatOptions (options = this.options) {
    if (typeof options.connectionTimeout !== 'undefined' && typeof options.connectionTimeout !== 'number') throw new TypeError('MONGO_CLIENT_INVALID_OPTION', 'connetionTimeout', 'number')
    if (typeof options.uri !== 'undefined' && (typeof options.uri !== 'string' && !(options.uri instanceof ConnectionStringBuilder))) throw new TypeError('MONGO_CLIENT_INVALID_OPTION', 'uri', 'string or a ConnectionStringBuilder')
    if (typeof options.makeCache !== 'boolean') throw new TypeError('MONGO_CLIENT_INVALID_OPTIONS', 'makeCache', 'boolean')
    if (typeof options.esm !== 'boolean') throw new TypeError('MONGO_CLIENT_INVALID_OPTIONS', 'esm', 'boolean')
    if (Array.isArray(options.ignoredFiles) && !Utils.checkArray(options.ignoredFiles, 'string')) throw new TypeError('MONGO_MONGO_CLIENT_INVALID_OPTIONS', 'ignoredFiles', 'Array of strings', true)
    if (typeof options.schemaFolderPath !== 'string') throw new TypeError('MONGO_CLIENT_INVALID_OPTIONS', 'schemaFolderPath', 'string')
    if (typeof options.useFiles !== 'boolean') throw new TypeError('MONGO_CLIENT_INVALID_OPTIONS', 'useFiles', 'boolean')
  }

  /**
     * Handles the events fired from Mongoose
     * @return {void}
     * @private
     */
  handleEvents () {
    this._mongoose.connection.on('error', err => {
      this.emit('error', err)
    })

    this._mongoose.connection.on('disconnected', () => {
      this.emit('disconnected')
    })

    this._mongoose.connection.on('disconnecting', () => {
      this.emit('disconnecting')
    })

    this._mongoose.connection.on('connected', () => {
      this.emit('connected')
    })

    this._mongoose.connection.on('connecting', () => {
      this.emit('connecting')
    })

    this._mongoose.connection.on('reconnected', () => {
      this.emit('reconnected')
    })

    this._mongoose.connection.on('close', () => {
      this.emit('close')
    })
  }
}

module.exports = MongoClient
