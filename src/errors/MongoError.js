'user-strict';

class MongoError extends Error {
    constructor(message, reason) {
        super();
        this.name = 'MongoError';

        this.message = message;

        this.reason = reason
        
        if (Error.captureStackTrace) Error.captureStackTrace(this, MongoError);
    }
}

module.exports = MongoError;