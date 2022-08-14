'use-strict';

const MongoError = require('../errors/MongoError');

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

class Utils extends null {
	static mergeDefault(def, given) {
		if (!given) return def;
		for (const key in def) {
			if (!has(given, key) || given[key] === undefined) {
				given[key] = def[key];
			} else if (given[key] === Object(given[key])) {
				given[key] = Utils.mergeDefault(def[key], given[key]);
			}
		}
		return given;
	}

	static handleError(error) {
		let { reason, message } = error;
		if (message.split(' ')[0] === 'getaddrinfo' && message.split(' ')[1] === 'ENOTFOUND') {
			message = `Uknown Host ${message.split(' ')[2]}`;
		} else if (message.split(' ')[0] === 'Invalid' && message.split(' ')[1] === 'scheme,') {
			message = 'Invalid connection string provided, expected to start with "mongodb://" or "mongodb+srv://"';
		}

		throw new MongoError(message, reason ?? null);
	}

	/**
	 * Check if the array contains only a given type.
	 * @param {Array<any>} array The array to check
	 * @param {string} type The type to check for
	 * @returns
	 */
	static checkArray(array, type) {
		for (const key of array) {
			/** eslint-disable valid-typeof */
			if (typeof key !== type) return false;
		}
		return true;
	}

	/**
	 * Updates an object according to a `change` object.
	 * @param {Object} object The object to update
	 * @param {Object} change What to change in the `object`
	 * @returns {Object}
	 */
	/**
	 * Updates an object according to a `change` object.
	 * @param {MongoDocument} object The object to update
	 * @param {MongoChange} change What to change in the `object`
	 * @returns {Object}
	 */
	 static updateDocument(object, change) {
		if (Object.is(object, change)) return;

		const newObject = object._doc;
		const objectFields = [];
		for (const prop in newObject) {
			if (typeof newObject[prop] !== 'object') continue;
			if (Object.getOwnPropertyDescriptors(newObject)[prop].configurable === false || Object.getOwnPropertyDescriptors(newObject)[prop].enumerable === false || Object.getOwnPropertyDescriptors(newObject)[prop].writable === false) continue;
			objectFields.push(prop);
		}
		for (const prop of objectFields) {
			for (const key of Object.keys(change[prop])) {
				if (typeof newObject[prop][key] !== 'object') {
					newObject[prop][key] = change[prop][key];
				} else {
					this.updateDocument(newObject[prop], change[prop]);
				}
			}
		}
		return newObject;
	}
}

module.exports = Utils;
