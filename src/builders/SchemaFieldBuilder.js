'use-strict';

const { SchemaFieldTypes } = require('../util/Constants');
const { TypeError } = require('../errors');
/**
 * A builder to create a new field for a Schema
 */
class SchemaFieldBuilder {
	/**
	 * @typedef {typeof SchemaTypes} SchemaFieldType
	 */
	/**
	 * @typedef {Object} SchemaFieldBuilderData
	 * @property {string} name The name of this field
	 * @property {SchemaFieldType} type The type of this field
	 * @property {boolean} required Wether this field is required
	 * @property {any} default The default value of this field
	 * @property {number} ttl The Time-To-Live (TTL) the document has
	 */
	/**
	 * A builder to create a new field for a Schema
	 * @param {SchemaFieldBuilderData} data
	 */
	constructor(data = {}, skipValidation = false) {
		/**
		 * The name of this field
		 * @type {string}
		 */
		this.name = data.name ?? null;

		/**
		 * The type of this field
		 * @type {SchemaFieldType}
		 */
		this.type = data.type ?? null;

		/**
		 * Wether this field is required
		 * @type {boolean}
		 */
		this.required = data.required ?? null;

		/**
		 * The default value of this field
		 * @type {any}
		 */
		this.default = data.default ?? null;

		/**
		 * The Time-To-Live (TTL) the document has in seconds.
		 * @type {number}
		 */
		this.ttl = data.ttl ?? null;

		/**
		 * Wether to skip the validation of the fields
		 * @type {Boolean}
		 */
		this.skipValidation = skipValidation;
	}

	/**
	 * Set's the name of this field
	 * @param {string} name The new name
	 * @returns {SchemaFieldBuilder}
	 */
	setName(name) {
		this.name = name;
		return this;
	}

	/**
	 * Set's the type of this field
	 * @param {SchemaFieldType|SchemaFieldTypeResolvable} type The new type
	 * @returns {SchemaFieldBuilder}
	 */
	setType(type) {
		this.type = this.resolveFieldType(type);
		return this;
	}

	/**
	 * Set's if the field is required
	 * @param {boolean} required
	 * @returns {SchemaFieldBuilder}
	 */
	setRequired(required) {
		this.required = required;
		return this;
	}

	/**
	 * Set's the default value of this field.
	 * @param {any} value The default value
	 * @returns
	 */
	setDefault(value) {
		this.default = value;
		return this;
	}

	/**
	 * Set's the Time-To-Live (TTL) the document has.
	 * * Only works if the field type is `Date` and if the field has a value.
	 * * TTL is reset every time the document is modified.
	 * @param {number} ttl The Time-To-Live (TTL) in seconds.
	 * @returns
	 */
	setTTL(ttl) {
		this.ttl = ttl;
		return this;
	}

	/**
	 * Returns a JSON object representation of this class
	 * @returns {Object}
	 */
	toJSON() {
		const { name, required, type, ttl } = this;
		this._validateOptions();
		return {
			name,
			type,
			required,
			default: this.default,
			expires: ttl
		};
	}

	/**
	 * Resolve the field type
	 * @param {SchemaFieldTypeResolvable|SchemaFieldType} type
	 * @private
	 */
	resolveFieldType(type) {
		if (SchemaFieldTypes[type]) return SchemaFieldTypes[type];
		else return type;
	}

	/**
	 * Validate options
	 * @param {boolean} skipValidation Wether to skip validation.
	 * @private
	 */
	_validateOptions(skipValidation = this.skipValidation) {
		if (skipValidation) return;
		const { name, required, type, ttl } = this;
		if (typeof name !== 'string') throw new TypeError('INVALID_TYPE', 'name', 'string');
		if (required && typeof required !== 'boolean') throw new TypeError('INVALID_TYPE', 'required', 'boolean');
		if (this.default && typeof this.default !== 'boolean') throw new TypeError('REQUIRED_FIELD', 'default', 'SchemaFieldBuilderData');
		if (!type) throw new TypeError('REQUIRED_FIELD', 'type', 'SchemaFieldBuilderData');
		if (ttl && typeof ttl !== 'number') throw new TypeError('INVALID_TYPE', 'ttl', 'number');
		if (ttl && type != SchemaFieldTypes.DATE) throw new TypeError('INVALID_FIELD_TYPE', 'Date');
	}
}

module.exports = SchemaFieldBuilder;
