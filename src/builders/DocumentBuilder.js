'use-strict';

class DocumentBuilder {
	/**
	 * @typedef {Object} DocumentBuilderData
	 * @property {string} id
	 * @property {Object} cFields
	 */

	/**
	 * Builder for Documents
	 * @param {DocumentBuilderData} data
	 */
	constructor(data = {}) {
		/**
		 * The ID of this document
		 * @type {string}
		 */
		this.id = data._id ?? null;

		/**
		 * The "Custom Fields"
		 * @type {Object}
		 */
		this.cFields = data.cFields ?? {};

		Object.assign(this, this.cFields);
	}

	/**
	 * Converts a MongoDocument into a DocumentBuilder
	 * @param {MongoDocument} document
	 * @returns {DocumentBuilder}
	 */
	static from(document) {
		return new DocumentBuilder({
			_id: document._id,
			cFields: document._cFields,
		});
	}

	/**
	 * Set's the document's ID
	 * @param {string} id The unique Identifier of this document
	 * @returns {DocumentBuilder}
	 */
	setId(id) {
		this.id = id;
		return this;
	}

	/**
	 * @typedef {Object} DocumentBuilderFieldData
	 * @property {string} name The name of the field
	 * * Make sure it is the same as in your `MongoSchema`
	 * @property {any} value The value of the field
	 */

	/**
	 * Set's a field
	 * @param {string} name The name of the field
	 * * Make sure it is the same as in your `MongoSchema`
	 * @param {any} value The value of the field
	 * @returns {DocumentBuilder}
	 */
	addField(name, value) {
		return this.addFields({ name, value });
	}

	/**
	 * Add one or more fields
	 * @param {Array<DocumentBuilderFieldData>|DocumentBuilderFieldData} fields The fields to add.
	 * @returns {DocumentBuilder}
	 */
	addFields(...data) {
		data.forEach((f) => {
			this[f.name] = f.value;
			this.cFields[f.name] = f.value;
		});
		return this;
	}

	/**
	 * Returns an JSON object representation of this
	 * @returns {Object}
	 */
	toJSON() {
		const { id, cFields } = this;
		return {
			_id: id,
			...cFields,
		};
	}
}

module.exports = DocumentBuilder;
