'use-strict';

const { Collection } = require('@discordjs/collection');
const { TypeError } = require('../errors');
const Utils = require('../util/Utils');
const MongoDocument = require('./MongoDocument');
const DocumentBuilder = require('../builders/DocumentBuilder');
//TEMP
const { Model } = require('mongoose')

/**
 * The representation of a model
 */
class MongoModel {
	/**
	 * The representation of a model
	 * @param {Model} model A mongoose model
	 * @param {boolean} makeCache Wether easiermongo should cache documents when fetched from the database.
	 */
	constructor(model, makeCache = true) {
		/**
		 * The model it is representing
		 * @type {Model}
		 */
		this._model = model;

		/**
		 * Wether easiermongo should cache documents when fetched from the database.
		 * @type {boolean}
		 */
		this.makeCache = makeCache;

		/**
		 * The cache of this model
		 * * Easiermongo will only cache documents if the `makeCache` option is set to `true`
		 * * When using the methods `edit`, `findAndEdit` and `editMany` the cache won't be updated unless the option `new` is set to `true`
		 * @type {Collection<string,MongoDocument>}
		 */
		this.cache = new Collection();

		this.ttl = this._model.schema.get('expires');
		
		console.log(this.ttl)
	}

	/**
	 * Create a new document in the collection.
	 * @param {DocumentBuilder|BaseDocumentData} document The document object according to what was set when creating the schema
	 * @returns {Promise<MongoDocument>} The newly created document
	 * @example
	 * model.create({
	 * 	_id: 'someId',
	 * 	name: 'John',
	 * 	lastName: 'Doe',
	 * 	age: 47
	 * }).then(document => {
	 * 	console.log(document); //{_id: 'someId', __v: 0, name: 'John', lastName: 'Doe', age: 47}
	 * }).catch(err => console.error(err))
	 */
	async create(document) {
		if (document instanceof DocumentBuilder) document = document.toJSON();
		const _doc = new this._model(document);
		const doc = new MongoDocument(_doc, this);
		if (this.makeCache && doc) this.cache.set(doc._id, doc);
		await _doc.save();
		return doc;
	}

	/**
	 * Get all the documents in this collection.
	 * @returns {Promise<MongoDocument>} The document(s) found in the collection
	 */
	async getAll() {
		const docs = await this._model.find();
		if (docs.length > 0 && this.makeCache) docs.forEach((doc) => this.cache.set(doc._id, new MongoDocument(doc, this)));
		return docs.map((d) => new MongoDocument(d, this));
	}

	/**
	 * Get a document by it's id
	 * @param {string} id The document `_id`
	 * @returns {Promise<MongoDocument>} The document matching the id
	 * @example
	 * const document = await model.get('someId')
	 * 	.catch(err => console.error(err))
	 * console.log(document)
	 */
	async get(id) {
		if (typeof id !== 'string') throw new TypeError('INVALID_TYPE', 'id', 'string');
		const doc = new MongoDocument(await this._model.findById(id), this);
		if (doc && this.makeCache) this.cache.set(doc._id, doc);
		return doc;
	}

	/**
	 * Searches for one document matching the query
	 * * If you want to find a document with the `_id`, use `get` method instead.
	 * @param {MongoQuery} query The query to search for
	 * @returns {Promise<MongoDocument>} The document matching the query
	 * @example
	 * const document = await model.find({ name: 'John', lastName: 'Doe' })
	 * 	.catch(err => console.error(err))
	 * console.log(document)
	 */
	async find(query) {
		if (typeof query !== 'object') throw new TypeError('INVALID_TYPE', 'query', 'object');
		const doc = new MongoDocument(await this._model.findOne(query), this);
		if (doc && this.makeCache) this.cache.set(doc._id, doc);
		return doc;
	}

	/**
	 * Searches for all document matching the query
	 * * If you want to find a document with the `_id`, use `get` method instead.
	 * @param {MongoQuery} query The query to search for
	 * @returns {Promise<MongoDocument[]>} The document(s) matching the query
	 */
	async findMany(query) {
		if (typeof query !== 'object') throw new TypeError('INVALID_TYPE', 'query', 'object');
		const docs = await this._model.find(query);
		if (docs.length > 0 && this.makeCache) docs.forEach((doc) => this.cache.set(doc._id, new MongoDocument(doc, this)));
		return docs.map((d) => new MongoDocument(d, this));
	}

	// Only for naming purpose
	/**
	 * @typedef {QueryOptions} ModelEditOptions
	 */

	/**
	 * Edits a document using it's id.
	 * @param {string} id The document `_id`
	 * @param {MongoChange} change The changes it should apply to the document
	 * @param {ModelEditOptions} options The options of this edit
	 * @returns {Promise<MongoDocument>} The old document or if `options.new` is set to `true` then it will return the newly edited document.
	 * @example
	 * //Change the age to 48.
	 * //Set option `new` to true to return the edited document
	 * const newDocument = await model.edit('someId', { age: 48 }, { new: true })
	 * 	.catch(err => console.error(err))
	 * console.log(newDocument)
	 */
	async edit(id, change, options = {}) {
		if (typeof id !== 'string') throw new TypeError('INVALID_TYPE', 'id', 'string');
		if (typeof change !== 'object') throw new TypeError('INVALID_TYPE', 'change', 'object');
		if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object');
		const doc = new MongoDocument(await this._model.findByIdAndUpdate(id, change, options), this);
		if (doc && options.new === true) this.cache.set(doc._id, doc);
		return doc;
	}

	/**
	 * Finds a document then edits it.
	 * @param {MongoQuery} query The query to search for
	 * @param {MongoChange} change The changes it should apply to the document
	 * @param {ModelEditOptions} options The options of this edit
	 * @returns {Promise<MongoDocument>} The old document or if `options.new` is set to `true` then it will return the newly edited document.
	 */
	async findAndEdit(query, change, options = {}) {
		if (typeof query !== 'object') throw new TypeError('INVALID_TYPE', 'query', 'object');
		if (typeof change !== 'object') throw new TypeError('INVALID_TYPE', 'change', 'object');
		if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object');
		const doc = new MongoDocument(await this._model.findOneAndUpdate(query, change, options), this);
		if (doc && options.new === true) this.cache.set(doc._id, doc);
		return doc;
	}

	/**
	 * Finds documents corresponding to the query and edits them.
	 * @param {MongoQuery} query The query to search for
	 * @param {MongoChange} change The changes it should apply to the documents
	 * @param {ModelEditOptions} options The options of this edit
	 * @returns {Promise<MongoDocument[]>} The old document(s) or if `options.new` is set to `true` then it will return the newly edited document(s).
	 */
	async editMany(query, change, options = {}) {
		if (typeof query !== 'object') throw new TypeError('INVALID_TYPE', 'query', 'object');
		if (typeof change !== 'object') throw new TypeError('INVALID_TYPE', 'change', 'object');
		if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object');
		const docs = await this._model.updateMany(query, change, options).map((d) => new MongoDocument(d, this));
		if (docs.length > 0 && options.new === true) docs.forEach((doc) => this.cache.set(doc._id, doc));
		return docs;
	}

	/**
	 * Delete a document using its id
	 * @param {string} id The `_id` of that document.
	 * @returns {Promise<void>}
	 * @example
	 * model.delete('someId')
	 * 	.then(() => console.log('Deleted document of id "someId"'))
	 * 	.catch(err => console.error(err))
	 */
	async delete(id) {
		if (typeof id !== 'string') throw new TypeError('INVALID_TYPE', 'id', 'string');
		const doc = await this._model.findByIdAndDelete(id);
		this.cache.delete(doc._id);
	}

	/**
	 * Finds a document using a query then deletes it.
	 * @param {MongoQuery} query The query to search for.
	 * @returns {Promise<void>}
	 */
	async findAndDelete(query) {
		if (typeof query !== 'object') throw new TypeError('INVALID_TYPE', 'query', 'object');
		const doc = await this._model.findOneAndDelete(query);
		if (doc) {
			this.cache.delete(doc._id);
		}
	}

	/**
	 * Deletes all the documents matching the query.
	 * @param {MongoQuery} query The query to search for.
	 * @returns {Promise<void>}
	 */
	async deleteMany(query) {
		if (typeof query !== 'object') throw new TypeError('INVALID_TYPE', 'query', 'object');
		const docs = await this._model.deleteMany(query);
		if (docs.length > 0) docs.forEach((doc) => this.cache.delete(doc._id));
	}

	/**
	 * Updates a document without overriding content of objects
	 * * NOTE: This process takes longer and uses more ressources and is likely not to work if not working with objects, prioritize `MongoModel#edit()` when able.
	 * @param {string} id The id of the document to update
	 * @param {MongoChange} change What to change in the document
	 * @param {ModelEditOptions} options The options of this edit
	 * @returns {Promise<MongoDocument>} The old document or if `options.new` is set to `true` then it will return the newly edited document.
	 */
	async update(id, change, options = {}) {
		if (typeof id !== 'string') throw new TypeError('INVALID_TYPE', 'id', 'string');
		if (typeof change !== 'object') throw new TypeError('INVALID_TYPE', 'change', 'object');
		if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object');
		const oldDoc = await this.get(id);
		const newDoc = Utils.updateDocument(oldDoc, change);
		return await this.edit(id, newDoc, options);
	}

	/**
	 * Updates a document without overriding content of objects
	 * * NOTE: This process takes longer and uses more ressourecs, prioritize `MongoModel#edit()` when able.
	 * @param {MongoQuery} query The to search for
	 * @param {MongoChange} change What to change in the document
	 * @param {ModelEditOptions} options The options of this edit
	 * @returns {Promise<MongoDocument>} The old document or if `options.new` is set to `true` then it will return the newly edited document.
	 */
	async findAndUpdate(query, change, options = {}) {
		if (typeof query !== 'object') throw new TypeError('INVALID_TYPE', 'query', 'object');
		if (typeof change !== 'object') throw new TypeError('INVALID_TYPE', 'change', 'object');
		if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object');
		const oldDoc = await this.find(query);
		const newDoc = Utils.updateDocument(oldDoc, change);
		return await this.findAndEdit(query, newDoc, options);
	}

	/**
	 * Updates a document without overriding content of objects
	 * * NOTE: This process takes longer and uses more ressourecs, prioritize `MongoModel#edit()` when able.
	 * @param {MongoQuery} query The to search for
	 * @param {MongoChange} change What to change in the document
	 * @param {ModelEditOptions} options The options of this edit
	 * @returns {Promise<MongoDocument[]>} The old documents or if `options.new` is set to `true` then it will return the newly edited documents.
	 */
	async updateMany(query, change, options = {}) {
		if (typeof query !== 'object') throw new TypeError('INVALID_TYPE', 'query', 'object');
		if (typeof change !== 'object') throw new TypeError('INVALID_TYPE', 'change', 'object');
		if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object');
		const oldDocs = await this.findMany(query);
		const newDocs = [];
		for (const oldDoc of oldDocs) {
			const newDoc = Utils.updateDocument(oldDoc, change);
			const doc = await this.edit(newDoc._id, newDoc, options);
			newDoc.push(doc);
		}
		return newDocs;
	}
}

module.exports = MongoModel;
