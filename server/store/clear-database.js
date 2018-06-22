const { deleteAllExpenses } = require('./expense-store');
const { deleteAllUsersExceptAdmin } = require('./user-store');

/**
 * Resets the database to initial.
 */
module.exports = async () => {
   await deleteAllExpenses();
   await deleteAllUsersExceptAdmin();
};
