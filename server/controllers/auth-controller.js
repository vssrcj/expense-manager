const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, getUser } = require('../store/user-store');
const { listMissing } = require('../utils');
const { SERVER_SECRET } = require('../config');

function signToken(id, name) {
   return jwt.sign({ name, id }, SERVER_SECRET, { expiresIn: '1h' });
}

module.exports = (app) => {
   app.post(
      '/api/signup',
      (req, res, next) => {
         const missing = listMissing(req.body, ['name', 'password']);
         if (missing) {
            return res.status(422).send({ message: `Missing the following props: ${missing}` });
         }
         return next();
      },
      async (req, res) => {
         const { id, name, role } = await createUser(req.body);

         const token = signToken(id, name);

         res.send({
            id, name, role, token,
         });
      },
   );

   app.post(
      '/api/login',
      (req, res, next) => {
         const missing = listMissing(req.body, ['name', 'password']);

         if (missing) {
            return res.status(422).send({ message: `Missing the following props: ${missing}` });
         }
         return next();
      },
      async (req, res) => {
         const user = await getUser({ name: req.body.name });

         if (user) {
            const match = await bcrypt.compare(req.body.password, user.password);

            if (match) {
               const token = signToken(user.id, user.name);

               return res.send({
                  token, name: user.name, id: user.id, role: user.role,
               });
            }
         }
         return res.status(401).send({ message: 'Unauthorized' });
      },
   );
};
