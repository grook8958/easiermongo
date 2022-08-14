'use-strict';

const fs = require('fs');
const { MongoClientEvents } = require('../util/Constants');

/**
 * A manager to fetch the schemas from a folder.
 */
class SchemaFileManager {
	/**
	 * A manager to fetch the schemas.
	 * @param {Database} Database The database that was connected to.
	 */
	constructor(database) {
		/**
		 * The database managing this.
		 * @type {Database}
		 */
		this.database = database;

		/**
		 * The client who opened the connection.
		 * @type {MongoClient}
		 */
		this.client = database.client;

		/**
		 * The files
		 */
		this.files = null;
	}

	/**
	 * Fetch the schema files
	 * @param {MongoClientOptions} options The options passed in the MongoClient
	 */
	async fetchFiles(options = this.client.options) {
		if (options.useFiles === false) return;
		if (options.esm === true) {
			const files = await this.importESM();
			this.files = files;
		} else {
			const files = this.importCommonJS();
			this.files = files;
		}

		await this.database.schemas.addSchemas(this.files);

		this.database.client.emit(MongoClientEvents.READY);
	}

	/**
	 * Import schema file using ESM import
	 * @param {MongoClientOptions} options The options passed in the MongoClient
	 * @private
	 */
	async importESM(options = this.client.options) {
		const schemaFiles = [];
		const files = fs
			.readdirSync(`${options.schemaFolderPath}`)
			.filter((file) => (file.endsWith('.mjs') || file.endsWith('.ts')) && !options.ignoredFiles.includes(file));
		for (const fileName of files) {
			const file = await import(`file:///${options.schemaFolderPath}/${fileName}`);
			schemaFiles.push({ schema: file.default, name: fileName.replace(/\.(.*)/gm, '') });
			this.client.emit(MongoClientEvents.REGISTERING_FILE, fileName);
		}

		return schemaFiles;
	}

	/**
	 * Import schema file using CommonJS require
	 * @param {MongoClientOptions} options The options passed in the MongoClient
	 * @private
	 */
	importCommonJS(options = this.client.options) {
		const schemaFiles = [];

		const files = fs
			.readdirSync(options.schemaFolderPath)
			.filter((file) => (file.endsWith('.js') || file.endsWith('.ts')) && !options.ignoredFiles.includes(file));

		for (const fileName of files) {
			let file = require(`${options.schemaFolderPath}/${fileName}`);
			if (file.default) file = file.default;
			schemaFiles.push({ schema: file, name: fileName.replace(/\.(.*)/gm, '') });
			this.client.emit(MongoClientEvents.REGISTERING_FILE, fileName);
		}
		return schemaFiles;
	}
}

module.exports = SchemaFileManager;
