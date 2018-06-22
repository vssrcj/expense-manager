const {
   getAllExpenses, getMyExpenses, createExpense, deleteExpense, updateExpense, getExpense,
} = require('../store/expense-store');
const { getUser } = require('../store/user-store');
const auth = require('../auth-middleware');
const { listMissing } = require('../utils');

module.exports = (app) => {
   app.get(
      '/api/expense',
      auth,
      (req, res, next) => {
         if (req.user.role !== 'admin') {
            return res.status(401).send({ message: 'Unauthorized' });
         }
         return next();
      },
      async (req, res) => {
         const users = await getAllExpenses();
         res.send(users);
      },
   );

   app.get(
      '/api/expense/:userId',
      auth,
      (req, res, next) => {
         req.params.userId = Number.parseInt(req.params.userId, 10);
         next();
      },
      (req, res, next) => {
         const { userId } = req.params;
         if (req.user.role !== 'admin' && userId !== req.user.id) {
            return res.status(401).send({ message: 'Unauthorized' });
         }
         return next();
      },
      async (req, res, next) => {
         const user = await getUser({ id: req.params.userId });
         if (!user) {
            return res.status(404).send({ message: 'User not found' });
         }
         return next();
      },
      async (req, res) => {
         const users = await getMyExpenses(req.params.userId);
         res.send(users);
      },
   );

   app.post(
      '/api/expense',
      auth,
      (req, res, next) => {
         const { userId } = req.body;
         if (req.user.role !== 'admin' && userId !== req.user.id) {
            return res.status(401).send({ message: 'Unauthorized' });
         }
         return next();
      },
      (req, res, next) => {
         const missing = listMissing(req.body, ['userId', 'datetime', 'description', 'amount']);

         if (missing) {
            return res.status(422).send({ message: `Missing the following props: ${missing}` });
         }
         return next();
      },
      async (req, res) => {
         const expense = await createExpense(req.body);

         res.status(201).send(expense);
      },
   );

   app.delete(
      '/api/expense/:id',
      auth,
      (req, res, next) => {
         req.params.id = Number.parseInt(req.params.id, 10);
         next();
      },
      async (req, res, next) => {
         const { id } = req.params;

         const expense = await getExpense(id);

         if (!expense) {
            return res.status(404).send({ message: 'Expense not found' });
         }
         req.expense = expense;
         return next();
      },
      (req, res, next) => {
         if (req.user.role !== 'admin' && req.expense.userId !== req.user.id) {
            return res.status(401).send({ message: 'Unauthorized' });
         }
         return next();
      },
      async (req, res) => {
         await deleteExpense(req.params.id);

         res.send();
      },
   );

   app.put(
      '/api/expense/:id',
      auth,
      (req, res, next) => {
         req.params.id = Number.parseInt(req.params.id, 10);
         next();
      },
      async (req, res, next) => {
         const { id } = req.params;

         const expense = await getExpense(id);

         if (!expense) {
            return res.status(404).send({ message: 'Expense not found' });
         }
         return next();
      },
      async (req, res, next) => {
         if (req.user.role !== 'admin' && Number.parseInt(req.body.userId, 10) !== req.user.id) {
            return res.status(401).send({ message: 'Unauthorized' });
         }
         return next();
      },
      (req, res, next) => {
         const missing = listMissing(req.body, ['userId', 'datetime', 'description', 'amount']);

         if (missing) {
            return res.status(422).send({ message: `Missing the following props: ${missing}` });
         }
         return next();
      },
      async (req, res) => {
         const { params, body } = req;

         const expense = await updateExpense(params.id, body);

         res.send(expense);
      },
   );
};
