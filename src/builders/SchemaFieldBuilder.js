'use-strict';

const { SchemaFieldTypes } = require('../util/Constants');
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
	 */
	/**
	 * A builder to create a new field for a Schema
	 * @param {SchemaFieldBuilderData} data
	 */
	constructor(data = {}) {
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
	 * Returns a JSON object representation of this class
	 * @returns {Object}
	 */
	toJSON() {
		const { name, required, type } = this;
		return {
			name,
			type,
			required,
			default: this.default,
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
}

module.exports = SchemaFieldBuilder;
