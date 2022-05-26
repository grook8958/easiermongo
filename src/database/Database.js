const MongoClient = require('../client/MongoClient');
const SchemaFileManager = require('./SchemaFileManager');
const SchemaManager = require('./SchemaManager');
const { Collection, Document } = require('mongoose');

/**
 * Represents a Database
 */
class Database {
    /**
     * Represents a Database
     * @param {MongoClient} client The client that was used to connect to the database.
     */
    constructor(client) {
        /**
         * The client that was used to connect to the database.
         * @type {MongoClient}
         */
        this.client = client;

        /**
         * The name of the database.
         * @type {string}
         */
        this.name = client._mongoose.connection.name;

        /**
         * The schema file manager
         * @type {SchemaFileManager}
         */
        this._schemaFileManager = new SchemaFileManager(this);

        /**
         * The schema manager
         * @type {SchemaManager}
         */
        this.schemas = new SchemaManager(this);

        /**
         * @typedef {Object} MongoConnectionDetails
         * @property {string} host The host of the connection
         * @property {number} port The port connected to.
         * @property {string} username The username for the connection.
         * @property {string} password The password for the connection.
         */

        /**
         * The connection details used to connect to the database.
         * @type {MongoConnectionDetails}
         */
        this.connectionDetails = {
            host: client._mongoose.connection.host, 
            port: client._mongoose.connection.port, 
            password: this.client._mongoose.connection.pass, 
            username: this.client._mongoose.connection.user
        }

        //Fetch the files.
        this._schemaFileManager.fetchFiles();
    }

    /**
     * Returns all the collections of the database.
     * @returns {Promise<Collection<Document>[]>}
     */
    async getCollections() {
        return await this.client._mongoose.connection.db.collections()
    }

    /**
     * Return a collection of the database.
     * @param {string} name The name of the collection.
     * @returns {Collection<Document>}
     */
    getCollection(name) {
        return this.client._mongoose.connection.db.collection(name);
    }

    /**
     * Disconnects the current connection.
     * @returns {Promise<void>}
     */
    async disconnect() {
        await this.client.disconnect();
        return 
    }

    
}

module.exports = Database;