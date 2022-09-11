const { EventEmitter } = require('node:events');

/**
 * The DocumentExpiryManager
 * @param {MongoModel} model
 * @extends {EventEmitter}
 */
class DocumentExpiryManager extends EventEmitter {
	/**
	 * The DocumentExpiryManager
	 * @param {MongoModel} model
	 */
	constructor(model) {
		super();

		/**
		 * The model bound to this manager
		 * @type {MongoModel}
		 */
		this.model = model;

		/**
		 * The clock
		 * @private
		 */
		this.clock = setInterval(() => this.checkExpire(), this.model.ttl * 1000);

		/**
		 * An array of Ids of documents who will expire
		 * @type {Array<string>}
		 */
		this.willExpire = [];
	}

	checkExpire() {
		if (!this.willExpire || this.willExpire.length < 0) return;
		for (const expired of this.willExpire) {
			const expiredDoc = this.model.cache.get(expired);
			this.emit('expire', expired, expiredDoc);
			this.model.cache.delete(expired);
			this.remove(expired);
		}
	}

	end() {
		clearInterval(this.clock);
	}

	register(id) {
		if (this.willExpire.includes(id)) return false;
		this.willExpire.push(id);
		return true;
	}

	remove(id) {
		if (!this.willExpire.includes(id)) return false;
		this.willExpire.splice(this.willExpire.indexOf(id), 1);
		return true;
	}
}

module.exports = DocumentExpiryManager;
