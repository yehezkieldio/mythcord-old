const Logger_1 = require("../dist/libraries/utils/Logger.js");
const logger = new Logger_1.Logger();

const isError = obj => Object.prototype.toString.call(obj) === "[object Error]"

const getMessage = obj => {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (isError(obj)) {
        return obj.stack;
    }
    if (obj.length === 1) {
        return obj[0];
    }
    return obj;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = (prefix) => {
    return obj => {
        let message = getMessage(obj);
        message =  capitalizeFirstLetter(message);

        switch (prefix) {
            case "info":
            case "ready":
                logger.info(message);
                break;
            case "event":
                logger.event(message);
                break;
            case "wait":
                logger.event(message);
                break;
            case "error":
                logger.error(message);
                break;
            case "warn":
                logger.warn(message);
                break;
        }
    }
}