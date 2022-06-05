const { Model, QueryOptions } = require('mongoose');
const { Collection } = require('@discordjs/collection');

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
         * @type {Collection<string,any>}
         */
        this.cache = new Collection();
    }

    /**
     * Get a document by it's id
     * @param {string} id The document `_id`
     * @returns {Promise<any>}
     */
    async get(id) {
        if (typeof id != 'string') throw new TypeError("INVALID_TYPE", "id", "string");
        const doc = await this._model.findById(id);
        if (doc && this.makeCache) this.cache.set(doc._id, doc);
        return doc;
    }

    /**
     * Searches for one document matching the query
     * * If you want to find a document with the `_id`, use `get` method instead.
     * @param {Object} query The query to search for
     * @returns {Promise<any>}
     */
    async find(query) {
        if (typeof query != 'object') throw new TypeError("INVALID_TYPE", "query", "object");
        const doc = await this._model.findOne(query);
        if (doc && this.makeCache) this.cache.set(doc._id, doc);
        return doc;
    }

    /**
     * Searches for all document matching the query
     * * If you want to find a document with the `_id`, use `get` method instead.
     * @param {Object} query The query to search for
     * @returns {Promise<any[]>}
     */
    async findAll(query) {
        if (typeof query != 'object') throw new TypeError("INVALID_TYPE", "query", "object");
        const docs = await this._model.find(query);
        if (docs.length > 0 && this.makeCache) docs.forEach(doc => this.cache.set(doc._id, doc));
        return docs;
    }

    //Only for naming purpose
    /**
     * @typedef {QueryOptions} ModelEditOptions
     */

    /**
     * Edits a document using it's id.
     * @param {string} id The document `_id`
     * @param {Object} change The changes it should apply to the document
     * @param {ModelEditOptions} options The options of this edit
     * @returns {Promise<any>}
     */
    async edit(id, change, options = {}) {
        if (typeof id != 'string') throw new TypeError("INVALID_TYPE", "id", "string");
        if (typeof change != 'object') throw new TypeError("INVALID_TYPE", "change", "object");
        if (typeof options != 'object') throw new TypeError("INVALID_TYPE", "options", "object");
        const doc = await this._model.findByIdAndUpdate(id, change, options);
        if (doc && options.new === true) this.cache.set(doc._id, doc);
        return doc;
    }

    /**
     * Finds a document then edits it.
     * @param {string} query The query to search for
     * @param {Object} change The changes it should apply to the document
     * @param {ModelEditOptions} options The options of this edit
     * @returns {Promise<any>}
     */
    async findAndEdit(query, change, options = {}) {
        if (typeof query != 'object') throw new TypeError("INVALID_TYPE", "query", "object");
        if (typeof change != 'object') throw new TypeError("INVALID_TYPE", "change", "object");
        if (typeof options != 'object') throw new TypeError("INVALID_TYPE", "options", "object");
        const doc = await this._model.findOneAndUpdate(query, change, options);
        if (doc && options.new === true) this.cache.set(doc._id, doc);
        return doc;
    }

    /**
     * Finds documents corresponding to the query and edits them.
     * @param {string} query The query to search for
     * @param {Object} change The changes it should apply to the documents
     * @param {ModelEditOptions} options The options of this edit
     * @returns {Promise<any[]>}
     */
    async editMany(query, change, options = {}) {
        if (typeof query != 'object') throw new TypeError("INVALID_TYPE", "query", "object");
        if (typeof change != 'object') throw new TypeError("INVALID_TYPE", "change", "object");
        if (typeof options != 'object') throw new TypeError("INVALID_TYPE", "options", "object");
        const docs = await this._model.updateMany(query, change, options);
        if (docs.length > 0 && options.new === true) docs.forEach(doc => this.cache.set(doc._id, doc));
        return docs;
    }

    
        
}

module.exports = MongoModel;