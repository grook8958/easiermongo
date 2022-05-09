'user-strict';

class MongoError extends Error {
    constructor(message, reason) {
        super();
        this.name = 'MongoError';

        let msg
        if (message.split(' ')[0] === "getaddrinfo" && message.split(' ')[1] === "ENOTFOUND") {
            msg = `Uknown Host ${message.split(' ')[2]}`
        }

        this.message = msg ?? message;

        this.reason = reason
    }
}

module.exports = MongoError;