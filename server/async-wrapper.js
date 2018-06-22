/**
 * Unhandled errors in async functions will not be caught,
 * and the server will hang / timeout.
 * This wraps all functions (async and sync) and handle their
 * errors in the same way.
 */
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

module.exports = function (app) {
   return actions.reduce((res, action) => {
      res[action] = (...args) => {
         /**
          * Wrap all arguments passed to the express app (which constitutes of middlewares and a
          * handler) with the asyncMiddleware, except the first argument, which is just the name of
          * the route
          */
         const wrappedArgs = args.map((arg, i) => (i === 0 ? arg : asyncMiddleware(arg)));

         return app[action](...wrappedArgs);
      };
      return res;
   }, {});
};
