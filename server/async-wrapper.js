const asyncMiddleware = fn => (
   (req, res, next) => {
      try {
         Promise
            .resolve(fn(req, res, next))
            .catch((err) => {
               res.status(500).send({
                  message: err.message,
               });
            });
      // sync errors uncaught by promise.
      } catch (err) {
         res.status(500).send({
            message: err.message,
         });
      }
   }
);

const actions = ['get', 'delete', 'post', 'put'];

module.exports = function (expressApp) {
   return actions.reduce((res, action) => {
      res[action] = (...args) => {
         const wrappedArgs = args.map((arg, i) => (i === 0 ? arg : asyncMiddleware(arg)));

         return expressApp[action](...wrappedArgs);
      };
      return res;
   }, {});
};
