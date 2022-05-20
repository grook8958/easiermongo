/**
 * The object representation of a MongoDB connection string.
 */
class MongoConnectionString {
    /**
     * The object representation of a MongoDB connection string.
     * @param {MongoConnectionStringData} data The connection string data.
     */
    constructor(data = {}) {
        /**
         * The host address
         * @type {string}
         */
        this.host = data.host ?? null;

        /**
         * The port number
         * @type {number}
         */
        this.port = data.port ?? null;

        /**
         * The database name
         * @type {string}
         */
        this.dbName = data.dbName ?? null;

        /**
         * The connection username
         * @type {string}
         */
        this.username = data.username ?? null;

        /**
         * The connection password
         * @type {string}
         */
        this.password = data.password ?? null;

        /**
         * Wether it should use `mongodb+srv://`. 
         * * Set to `false` by default
         * @type {boolean}
         */
        this.srv = data.srv ?? false;

        /**
         * Authentication source
         * @type {string}
         */
        this.authenticationSource = data.authenticationSource ?? null;
    }

    /**
     * Set the host name
     * @param {string} host The host name
     * @returns {MongoConnectionString}
     */
    setHost(host) {
        this.host = host;
        return this;
    }

    /**
     * Set the port number
     * @param {number} port The port number
     * @returns {MongoConnectionString}
     */
    setPort(port) {
        this.port = port;
        return this;
    }

    /**
     * Set the name of the database
     * @param {string} dbName The name of the database
     * @returns {MongoConnectionString}
     */
    setDbName(dbName) {
        this.dbName = dbName;
        return this;
    }

    /**
     * Set the connection username
     * @param {string} username The connection username
     * @returns {MongoConnectionString}
     */
    setUsername(username) {
        this.username = username;
        return this;
    }

    /**
     * Set the connection password
     * @param {string} password The connection password
     * @returns {MongoConnectionString}
     */
    setPassword(password) {
        this.password = password;
        return this;
    }

    /**
     * Set wether it should use `mongodb+srv://`.
     * @param {boolean} srv Wether it should use `mongodb+srv://`.
     * @returns {MongoConnectionString}
     */
    useSRV(srv) {
        this.srv = srv;
        return this;
    }

    /**
     * The source of the authentication
     * @param {string} source The source of the authentication
     * @returns {MongoConnectionString}
     */
    setAuthenticationSource(source) {
        this.authenticationSource = source;
        return this;
    }

    /**
     * Returns a string representation of the connection string.
     * @returns {string}
     */
    toString() {
        return `mongodb${this.srv ? '+srv' : ''}://${encodeURIComponent(this.username)}:${encodeURIComponent(this.password)}@${this.host}:${this.port}/${encodeURIComponent(this.dbName)}${this.authenticationSource ? "?authSource=" + encodeURIComponent(this.authenticationSource) : ''}`;
    }

    /**
     * Returns an Object representation of the connection string.
     * @returns {Object}
     */
    toJSON() {
        const { authenticationSource, dbName, host, password, port, srv, username } = this;
        return {
            host,
            port,
            dbName,
            username, 
            password,
            srv,
            authenticationSource
        }
    }
}   

module.exports = MongoConnectionString;