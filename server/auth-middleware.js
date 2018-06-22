const jwt = require('jsonwebtoken');
const { SERVER_SECRET } = require('./config');
const { getUser } = require('./store/user-store');

module.exports = async function (req, res, next) {
   const { headers } = req;

   try {
      const [type, token] = headers.authorization.split(' ');
      if (type === 'jwt') {
         const decode = await jwt.verify(token, SERVER_SECRET);

         const user = await getUser(decode);

         if (user) {
            req.user = user;
            return next();
         }
      }
      return res.status(401).send('Unauthorized');
   } catch (err) {
      return res.status(401).send(err.message || 'Unauthorized');
   }
};
