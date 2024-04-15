const LOGGER_PATH = require('path').join(process.cwd(), 'node_modules', 'next/dist/build/output/log')

const nextLogger = require(LOGGER_PATH)
const buildJsonLogger = require('./nextjsLogger')

Object.entries(nextLogger).forEach(([key, value]) => {
    if (typeof value === 'function') {
        nextLogger[key] = buildJsonLogger(key);
    }
});