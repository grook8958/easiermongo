/**
 * Options for a client.
 * @typedef {Object} MongoClientOptions
 * @property {number} [connectionTimeout=5000] The amout of time in milliseconds the request will wait before rejecting.
 * @property {string|null} [uri=''] The database connection string.
 * 
 */

class Options extends null {
    /**
    * The default client options.
    * @returns {MongoClientOptions}
    */
    static createDefault() {
        return {
            connectionTimeout: 5000,
            uri: ''
        }
    }
}

module.exports = Options;