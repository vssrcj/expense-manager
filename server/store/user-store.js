const bcrypt = require('bcrypt');

const store = require('./store');

exports.getUsers = async function () {
   return store.all('SELECT id, name, role FROM user');
};

exports.getUser = async function ({ id, name }) {
   return store.get('SELECT * FROM user WHERE user.id = $id OR user.name = $name', { $id: id, $name: name });
};

exports.deleteUser = async function (id) {
   return store.get('DELETE FROM user WHERE user.id = $id', { $id: id });
};

exports.updateUser = async function (id, { name, password }) {
   const hashedPassword = await bcrypt.hash(password, 10);

   await store.run(
      'UPDATE user SET name=$name, password=$password WHERE id=$id',
      { $name: name, $password: hashedPassword, $id: id },
   );

   return store.get('SELECT * FROM user WHERE id=$id', { $id: id });
};

exports.createUser = async function ({ name, password, role = 'user' }) {
   const hashedPassword = await bcrypt.hash(password, 10);

   await store.run(
      'INSERT INTO user(name, password, role) VALUES($name, $password, $role)',
      { $name: name, $password: hashedPassword, $role: role },
   );

   return store.get('SELECT * FROM user ORDER BY id DESC LIMIT 1');
};

exports.deleteAllUsersExceptAdmin = async function () {
   return store.run("DELETE FROM user WHERE user.name != 'admin'");
};
