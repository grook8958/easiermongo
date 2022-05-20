/**
 * Options for a client.
 * @typedef {Object} MongoClientOptions
 * @property {number} [connectionTimeout=5000] The amout of time in milliseconds the request will wait before rejecting.
 * @property {string|null} [uri=undefined] The database connection string.
 * @property {string} [schemaFolderPath=undefined] The folder in which the schema should be stored.
 * @property {boolean} [esm=false] Wether it shoulf user ESM import or CommonJS require.
 * @property {boolean} [useFiles=true] Wether the schemas should be stored in individual files or it should be dynamically added every time to the Database.
 * @property {Array[string]} [ignoredFiles=[]] The files to ignore when `useFiles` is set to `true`
 * @property {boolean} [makeCache=true] Wether easiermongo should cache documents when fetched from the database.
 */

class Options extends null {
    /**
    * The default client options.
    * @returns {MongoClientOptions}
    */
    static createDefault() {
        return {
            connectionTimeout: 5000,
            uri: undefined,
            esm: false,
            useFiles: true,
            ignoredFiles: [],
            schemaFolderPath: undefined,
            makeCache: true
        }
    }
}

module.exports = Options;