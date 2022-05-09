const { EventEmitter } = require('node:events');
const Mongoose = require('mongoose');
const { TypeError, Error, RangeError } = require('../errors');
const MongoError = require('../errors/MongoError');
const Options = require('../util/Options');
const Utils = require('../util/Utils');

/**
 * The starting point of interacting with your MongoDB
 * @extends {EventEmitter}
 */
class MongoClient extends EventEmitter {
    /**
     * 
     * @param {MongoClientOptions} options 
     */
    constructor(options) {
        super();

        /**
         * The options that were used to initialize this client.
         * @type {MongoClientOptions}
         */
        this.options = Utils.mergeDefault(Options.createDefault(), options);;

        /**
         * The connection to the database.
         * @type {Mongoose|null}
         */
        this._mongoose = null;

        this._validatOptions()
    }

    /**
     * Opens a new connnection to your database.
     * @param {string|null} uri The URI connection string of your database
     * @returns {}
     */
    async connect(uri = this.options.uri) {
        try {
            this._mongoose = await Mongoose.connect(uri, {connectTimeoutMS: this.options.connectionTimeout, waitQueueTimeoutMS: this.options.connectionTimeout});
        } catch (error) {
            const mongoError = new MongoError(error.message, error.reason);
            MongoError.captureStackTrace(mongoError);
            throw mongoError;
        }
    }

    /**
     * Disconnects from your database.
     * @return {void}
     */
    async disconnect() {
        await this._mongoose.disconnect();
        this._mongoose = null;
    }

    async _validatOptions(options = this.options) {
        if (typeof options.connectionTimeout !== 'undefined' && typeof options.connectionTimeout !== 'number') throw new TypeError('MONGO_CLIENT_INVALID_OPTION', 'connetionTimeout', 'number');
        if (typeof options.uri !== 'undefined' && typeof options.uri !== 'string') throw new TypeError('MONGO_CLIENT_INVALID_OPTION', 'uri', 'string');
    } 
}

module.exports = MongoClient;