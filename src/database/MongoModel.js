'use-strict'

const { Model, QueryOptions } = require('mongoose')
const { Collection } = require('@discordjs/collection')

/**
 * The representation of a model
 */
class MongoModel {
  /**
     * The representation of a model
     * @param {Model} model A mongoose model
     * @param {boolean} makeCache Wether easiermongo should cache documents when fetched from the database.
     */
  constructor (model, makeCache = true) {
    /**
         * The model it is representing
         * @type {Model}
         */
    this._model = model

    /**
         * Wether easiermongo should cache documents when fetched from the database.
         * @type {boolean}
         */
    this.makeCache = makeCache

    /**
         * The cache of this model
         * * Easiermongo will only cache documents if the `makeCache` option is set to `true`
         * * When using the methods `edit`, `findAndEdit` and `editMany` the cache won't be updated unless the option `new` is set to `true`
         * @type {Collection<string,any>}
         */
    this.cache = new Collection()
  }

  /**
     * Create a new document in the collection.
     * @param {Object} document The document object according to what was set when creating the schema
     * @returns {Promise<any>} The newly created document
     */
  async create (document) {
    const doc = new this._model(document)
    if (this.makeCache && doc) this.cache.set(doc._id, doc)
    await doc.save()
    return doc
  }

  /**
     * Get all the documents in this collection.
     * @returns {Promise<any>} The document(s) found in the collection
     */
  async getAll () {
    const docs = await this._model.find()
    if (docs.length > 0 && this.makeCache) docs.forEach(doc => this.cache.set(doc._id, doc))
    return docs
  }

  /**
     * Get a document by it's id
     * @param {string} id The document `_id`
     * @returns {Promise<any>} The document matching the id
     */
  async get (id) {
    if (typeof id !== 'string') throw new TypeError('INVALID_TYPE', 'id', 'string')
    const doc = await this._model.findById(id)
    if (doc && this.makeCache) this.cache.set(doc._id, doc)
    return doc
  }

  /**
     * Searches for one document matching the query
     * * If you want to find a document with the `_id`, use `get` method instead.
     * @param {Object} query The query to search for
     * @returns {Promise<any>} The document matching the query
     */
  async find (query) {
    if (typeof query !== 'object') throw new TypeError('INVALID_TYPE', 'query', 'object')
    const doc = await this._model.findOne(query)
    if (doc && this.makeCache) this.cache.set(doc._id, doc)
    return doc
  }

  /**
     * Searches for all document matching the query
     * * If you want to find a document with the `_id`, use `get` method instead.
     * @param {Object} query The query to search for
     * @returns {Promise<any[]>} The document(s) matching the query
     */
  async findMany (query) {
    if (typeof query !== 'object') throw new TypeError('INVALID_TYPE', 'query', 'object')
    const docs = await this._model.find(query)
    if (docs.length > 0 && this.makeCache) docs.forEach(doc => this.cache.set(doc._id, doc))
    return docs
  }

  // Only for naming purpose
  /**
     * @typedef {QueryOptions} ModelEditOptions
     */

  /**
     * Edits a document using it's id.
     * @param {string} id The document `_id`
     * @param {Object} change The changes it should apply to the document
     * @param {ModelEditOptions} options The options of this edit
     * @returns {Promise<any>} The old document or if `options.new` is set to `true` then it will return the newly edited document.
     */
  async edit (id, change, options = {}) {
    if (typeof id !== 'string') throw new TypeError('INVALID_TYPE', 'id', 'string')
    if (typeof change !== 'object') throw new TypeError('INVALID_TYPE', 'change', 'object')
    if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object')
    const doc = await this._model.findByIdAndUpdate(id, change, options)
    if (doc && options.new === true) this.cache.set(doc._id, doc)
    return doc
  }

  /**
     * Finds a document then edits it.
     * @param {string} query The query to search for
     * @param {Object} change The changes it should apply to the document
     * @param {ModelEditOptions} options The options of this edit
     * @returns {Promise<any>} The old document or if `options.new` is set to `true` then it will return the newly edited document.
     */
  async findAndEdit (query, change, options = {}) {
    if (typeof query !== 'object') throw new TypeError('INVALID_TYPE', 'query', 'object')
    if (typeof change !== 'object') throw new TypeError('INVALID_TYPE', 'change', 'object')
    if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object')
    const doc = await this._model.findOneAndUpdate(query, change, options)
    if (doc && options.new === true) this.cache.set(doc._id, doc)
    return doc
  }

  /**
     * Finds documents corresponding to the query and edits them.
     * @param {string} query The query to search for
     * @param {Object} change The changes it should apply to the documents
     * @param {ModelEditOptions} options The options of this edit
     * @returns {Promise<any[]>} The old document(s) or if `options.new` is set to `true` then it will return the newly edited document(s).
     */
  async editMany (query, change, options = {}) {
    if (typeof query !== 'object') throw new TypeError('INVALID_TYPE', 'query', 'object')
    if (typeof change !== 'object') throw new TypeError('INVALID_TYPE', 'change', 'object')
    if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object')
    const docs = await this._model.updateMany(query, change, options)
    if (docs.length > 0 && options.new === true) docs.forEach(doc => this.cache.set(doc._id, doc))
    return docs
  }
}

module.exports = MongoModel
