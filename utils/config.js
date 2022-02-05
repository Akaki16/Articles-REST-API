const DB_URI = process.env.DB_URI;
const TEST_DB_URI = process.env.TEST_DB_URI;

let DB_URI_TO_CONNECT;

if (process.env.NODE_ENV === 'test') {
    DB_URI_TO_CONNECT = TEST_DB_URI;
} else {
    DB_URI_TO_CONNECT = DB_URI;
}

const PORT = process.env.PORT;

module.exports = {
    DB_URI_TO_CONNECT,
    PORT
};