'use-strict';

const DocumentBuilder = require('../builders/DocumentBuilder');
const { TypeError } = require('../errors');

/**
 * Represents a Document of a collection.
 */
class MongoDocument {
	/**
	 * Represents a Document of a collection.
	 * @param {any} rawDocument The raw Mongoose Document returned.
	 * @param {MongoModel} model The Model to which the Document belong to.
	 */
	constructor(rawDocument, model) {
		/**
		 * The raw Mongoose Document returned.
		 * @type {RawDocumentData}
		 */
		this._document = rawDocument._doc;

		/**
		 * The model to which the document belong to.
		 * * `$model` is used to avoid naming conflicts.
		 * @type {MongoModel}
		 */
		this.$model = model;

		/**
		 * The unique Identifier (ID) of the document
		 * @type {string}
		 * @readonly
		 */
		this._id = this._document._id;

		/**
		 * The version key of the document.
		 * @type {number}
		 * @readonly
		 */
		this.__v = this._document.__v;

		this._parseFields();
	}

	/**
	 * The unique Identifier (ID) of the document
	 * @type {string}
	 * @readonly
	 */
	get id() {
		return this._id;
	}

	/**
	 * The version key of the document.
	 * @type {number}
	 * @readonly
	 */
	get vKey() {
		return this.__v;
	}

	/**
	 * An object of the custom fields defined in the schema
	 * @type {Object}
	 * @readonly
	 */
	get _cFields() {
		const _cFields = {};
		for (const f of Object.keys(this._document)) {
			if (f === '_id' || f === '__v') continue;
			_cFields[f] = this._document[f];
		}
		return _cFields;
	}

	/**
	 * Delete this document from the database
	 * @returns {Promise<void>}
	 */
	async delete() {
		await this.$model.delete(this._id);
	}

	/**
	 * Inserts a copy of this document but with a new ID.
	 * @param {string} id The ID of this copy
	 * @returns {MongoDocument}
	 */
	async insertCopy(id) {
		if (typeof id !== 'string') throw new TypeError('INVALID_TYPE', 'id', 'string');
		if (id === this._id) throw new TypeError('DUPLICATE_ID');
		const copyDoc = DocumentBuilder.from(this).setId(id).toJSON();
		return await this.$model.create(copyDoc);
	}

	/**
	 * Parse the fields
	 * @private
	 */
	_parseFields(fields = Object.keys(this._document), doc = this._document) {
		for (const f of fields) {
			if (f === '_id' || f === '__v') continue;
			this[f] = doc[f];
		}
	}

	/**
	 * Returns a JSON object representation of this document
	 */
	toJSON() {
		return {
			_id: this.id,
			__v: this.vKey,
			...this._cFields,
		};
	}
}

module.exports = MongoDocument;
