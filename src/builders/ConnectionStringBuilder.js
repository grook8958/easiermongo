'use-strict';

/**
 * The object representation of a MongoDB connection string.
 */
class ConnectionStringBuilder {
	/**
	 * @typedef {Object} ConnectionStringBuilderData
	 * @property {string} host The host adress
	 * @property {number} port The port number
	 * @property {string} dbName The name of the database
	 * @property {string} username The connection username
	 * @property {string} password The connection password
	 * @property {boolean} srv Wether it should use `mongodb+srv://`.
	 * * Set to `false` by default
	 * @property {string} authSource The source of the authentication
	 */
	/**
	 * The object representation of a MongoDB connection string.
	 * @param {ConnectionStringBuilderData} data The connection string data.
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
		this.authSource = data.authSource ?? null;
	}

	/**
	 * Set the host name
	 * @param {string} host The host name
	 * @returns {ConnectionStringBuilder}
	 */
	setHost(host) {
		this.host = host;
		return this;
	}

	/**
	 * Set the port number
	 * @param {number} port The port number
	 * @returns {ConnectionStringBuilder}
	 */
	setPort(port) {
		this.port = port;
		return this;
	}

	/**
	 * Set the name of the database
	 * @param {string} dbName The name of the database
	 * @returns {ConnectionStringBuilder}
	 */
	setDbName(dbName) {
		this.dbName = dbName;
		return this;
	}

	/**
	 * Set the connection username
	 * @param {string} username The connection username
	 * @returns {ConnectionStringBuilder}
	 */
	setUsername(username) {
		this.username = username;
		return this;
	}

	/**
	 * Set the connection password
	 * @param {string} password The connection password
	 * @returns {ConnectionStringBuilder}
	 */
	setPassword(password) {
		this.password = password;
		return this;
	}

	/**
	 * Set wether it should use `mongodb+srv://`.
	 * @param {boolean} srv Wether it should use `mongodb+srv://`.
	 * @returns {ConnectionStringBuilder}
	 */
	useSRV(srv) {
		this.srv = srv;
		return this;
	}

	/**
	 * The source of the authentication
	 * @param {string} source The source of the authentication
	 * @returns {ConnectionStringBuilder}
	 */
	setAuthSource(source) {
		this.authSource = source;
		return this;
	}

	/**
	 * Returns a string representation of the connection string.
	 * @returns {string}
	 */
	toString() {
		return `mongodb${this.srv ? '+srv' : ''}://${encodeURIComponent(this.username)}:${encodeURIComponent(
			this.password,
		)}@${this.host}:${this.port}/${encodeURIComponent(this.dbName)}${
			this.authSource ? '?authSource=' + encodeURIComponent(this.authSource) : ''
		}`;
	}

	/**
	 * Returns an Object representation of the connection string.
	 * @returns {Object}
	 */
	toJSON() {
		const { authSource: authenticationSource, dbName, host, password, port, srv, username } = this;
		return {
			host,
			port,
			dbName,
			username,
			password,
			srv,
			authenticationSource,
		};
	}
}

module.exports = ConnectionStringBuilder;
