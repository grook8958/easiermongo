'use-strict';

const MongoSchema = require('../database/MongoSchema');
const SchemaFieldBuilder = require('./SchemaFieldBuilder');
const { TypeError } = require('../errors');

/**
 * A builder to create a new schema
 */
class SchemaBuilder {
	/**
	 * @typedef {Object} SchemaBuilderData
	 * @property {SchemaFieldBuilder[]} fields The fields of the schema
	 * @property {SchemaOptions} options The options of this schema.
	 */
	/**
	 * A builder to create a new schema
	 * @param {SchemaBuilderData} data
	 */
	constructor(data = {}, skipValidation = false) {
		/**
		 * The fields of this schema
		 * @type {SchemaFieldBuilder[]}
		 */
		this.fields = data.fields ?? [];

		/**
		 * The options of this schema
		 * @type {SchemaOptions}
		 */
		this.options = data.options ?? {};

		/**
		 * Wether to skip validation of the fields.
		 * @type {Boolean}
		 */
		this.skipValidation = skipValidation;
	}

	/**
	 * Add a field to the schema
	 * @param {(builder: SchemaFieldBuilder) => SchemaFieldBuilder} input
	 * @returns {SchemaBuilder}
	 */
	addField(input) {
		const result = input(new SchemaFieldBuilder({}, this.skipValidation));
		this.fields.push(result);
		return this;
	}

	/**
	 * Set the options of this schema
	 * @param {SchemaOptions} options The new options
	 * @returns {SchemaBuilder}
	 */
	setOptions(options) {
		this.options = options;
		return this;
	}

	/**
	 * Validate the options
	 * @param skipValidation Whether to skip validation
	 * @private
	 */
	_validateOptions(skipValidation = this.skipValidation) {
		if (skipValidation) return;
		if (!Array.isArray(this.fields) && !this.fields.some(field => field instanceof SchemaFieldBuilder)) throw new TypeError('INVALID_TYPE', 'fields', 'Array of SchemaFieldBuilders', true);
		if (this.options && typeof this.options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object', true);
	}

	/**
	 * Returns the JSON object
	 * @returns {Object}
	 */
	toJSON() {
		this._validateOptions();
		const obj = {};
		for (const field of this.fields) {
			if (field instanceof SchemaFieldBuilder) {
				const json = field.toJSON();
				const name = json.name;
				delete json.name;
				obj[name] = json;
			}
		}

		return {
			fields: obj,
			options: this.options,
		};
	}

	/**
	 * Creates the mongo schema object
	 * @return {MongoSchema}
	 */
	toSchema() {
		return new MongoSchema(this.toJSON().fields, this.options);
	}
}

module.exports = SchemaBuilder;
