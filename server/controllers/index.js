const auth = require('./auth-controller');
const expenses = require('./expense-controller');
const user = require('./user-controller');

module.exports = [auth, expenses, user];
