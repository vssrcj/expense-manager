const { deleteAllExpenses } = require('./expense-store');
const { deleteAllUsersExceptAdmin } = require('./user-store');

module.exports = async () => {
   await deleteAllExpenses();
   await deleteAllUsersExceptAdmin();
};
