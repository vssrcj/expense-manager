const {
   getUsers, updateUser, createUser, deleteUser, getUser,
} = require('../store/user-store');
const { listMissing } = require('../utils');
const auth = require('../auth-middleware');

module.exports = (app) => {
   app.get(
      '/api/user',
      auth,
      (req, res, next) => {
         if (req.user.role !== 'admin' && req.user.role !== 'user-manager') {
            return res.status(401).send({ message: 'Unauthorized' });
         }
         return next();
      },
      async (req, res) => {
         const users = await getUsers();
         res.send(users);
      },
   );

   app.post(
      '/api/user',
      auth,
      (req, res, next) => {
         if (req.user.role !== 'admin' && req.user.role !== 'user-manager') {
            return res.status(401).send({ message: 'Unauthorized' });
         }
         return next();
      },
      (req, res, next) => {
         const missing = listMissing(req.body, ['name', 'password', 'role']);

         if (missing) {
            return res.status(422).send({ message: `Missing the following props: ${missing}` });
         }
         return next();
      },
      async (req, res) => {
         try {
            const { id, name, role } = await createUser(req.body);
            res.status(201).send({ id, name, role });
         } catch (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
               res.status(409).send({ message: 'Name must be unique.' });
            }
         }
      },
   );

   app.delete(
      '/api/user/:id',
      auth,
      (req, res, next) => {
         req.params.id = Number.parseInt(req.params.id, 10);
         next();
      },
      async (req, res, next) => {
         const { id } = req.params;

         const user = await getUser({ id });

         if (!user) {
            return res.status(404).send({ message: 'User not found' });
         }
         return next();
      },
      (req, res, next) => {
         if (req.user.role !== 'admin' && req.user.role !== 'user-manager') {
            return res.status(401).send({ message: 'Unauthorized' });
         }
         return next();
      },
      async (req, res) => {
         await deleteUser(req.params.id);

         res.send();
      },
   );

   app.put(
      '/api/user/:id',
      auth,
      async (req, res, next) => {
         const { id } = req.params;

         const user = await getUser({ id });

         if (!user) {
            return res.status(404).send({ message: 'User not found' });
         }
         return next();
      },
      (req, res, next) => {
         if (req.user.role !== 'admin' && req.user.role !== 'user-manager') {
            return res.status(401).send({ message: 'Unauthorized' });
         }
         return next();
      },
      (req, res, next) => {
         const missing = listMissing(req.body, ['name', 'password', 'role']);

         if (missing) {
            return res.status(422).send({ message: `Missing the following props: ${missing}` });
         }
         return next();
      },
      async (req, res) => {
         const { params, body } = req;

         const { id, name } = await updateUser(params.id, body);

         res.send({ id, name });
      },
   );
};
