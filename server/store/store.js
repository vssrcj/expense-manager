const sqlite3 = require('sqlite3').verbose();

const dbName = process.env.NODE_ENV === 'test'
   ? 'expense-tracker-test.sqlite'
   : 'expense-tracker.sqlite';

const db = new sqlite3.Database(`store/${dbName}`);

/**
 * Sets up a local sqlite db, and transforms its callbacks to promises.
 */
const types = ['run', 'all', 'get'];

const store = types.reduce((res, type) => {
   res[type] = async (url, params = {}) => (
      new Promise((resolve, reject) => {
         db[type](url, params, (err, success) => {
            if (err) reject(err);
            else resolve(success);
         });
      })
   );
   return res;
}, {});

module.exports = store;
