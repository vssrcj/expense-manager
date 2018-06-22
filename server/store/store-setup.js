const store = require('./store');
const { createUser } = require('./user-store');

module.exports = async function setup() {
   try {
      const row = await store.get("SELECT name FROM sqlite_master WHERE type='table' AND name='user'");

      if (row) {
         return;
      }

      await store.run(`
         CREATE TABLE "user"
         (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "name" TEXT UNIQUE,
            "password" TEXT,
            "role" TEXT
         )
      `);

      await store.run(`
         CREATE TABLE "expense"
         (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "user_id" INTEGER,
            "datetime" INTEGER,
            "description" TEXT,
            "amount" INTEGER,
            "comment" TEXT
         )
      `);

      console.log('Setup database with user and expense tables.');

      await createUser({ name: 'admin', password: 'admin', role: 'admin' });
   } catch (err) {
      console.warn(err);
   }
};
