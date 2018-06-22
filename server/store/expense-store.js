const store = require('./store');

exports.getExpense = async function (id) {
   return store.get('SELECT id, user_id as userId, datetime, description, amount, comment FROM expense WHERE expense.id = $id', { $id: id });
};

exports.getAllExpenses = async function () {
   return store.all('SELECT id, user_id as userId, datetime, description, amount, comment FROM expense');
};

exports.getMyExpenses = async function (userId) {
   return store.all(
      'SELECT id, datetime, description, amount, comment FROM expense WHERE expense.user_id=$user_id',
      { $user_id: userId },
   );
};

exports.deleteExpense = async function (id) {
   return store.get('DELETE FROM expense WHERE expense.id = $id', { $id: id });
};

exports.updateExpense = async function (id, {
   datetime, description, amount, comment,
}) {
   await store.run(`
      UPDATE expense
      SET
         datetime=$datetime,
         description=$description,
         amount=$amount,
         comment=$comment
      WHERE id=$id
   `, {
      $id: id,
      $datetime: datetime,
      $description: description,
      $amount: amount,
      $comment: comment,
   });

   return store.get('SELECT * FROM expense WHERE id=$id', { $id: id });
};

exports.createExpense = async function ({
   userId, datetime, description, amount, comment,
}) {
   await store.run(`
      INSERT INTO expense(user_id, datetime, description, amount, comment)
      VALUES($user_id, $datetime, $description, $amount, $comment)
   `, {
      $user_id: userId,
      $datetime: datetime,
      $description: description,
      $amount: amount,
      $comment: comment,
   });

   return store.get('SELECT * FROM expense ORDER BY id DESC LIMIT 1');
};

exports.deleteAllExpenses = async function () {
   return store.run('DELETE FROM expense');
};
