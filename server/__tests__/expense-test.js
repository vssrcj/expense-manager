const supertest = require('supertest');
const server = require('../server');
const clearDatabase = require('../store/clear-database');

describe('expenses', () => {
   let request = null;
   let userId = null;
   let jwt = null;
   let expense = null;

   beforeAll(async () => {
      request = supertest.agent(await server);
      await clearDatabase();
   });

   afterAll(async () => (await server).close());

   test('admin can login', () => (
      request
         .post('/api/login')
         .send({ name: 'admin', password: 'admin' })
         .then((res) => {
            expect(res.body.token).toBeTruthy();
            jwt = res.body.token;
            userId = res.body.id;
         })
   ));

   // GET
   test('should authorize get', async () => (
      request
         .get('/api/expense')
         .expect(401)
   ));

   // POST
   test('can post', async () => {
      const newExpense = {
         userId, description: 'test', datetime: (new Date()).getTime(), amount: 10, comment: 'test comment',
      };

      await request
         .post('/api/expense')
         .send(newExpense)
         .set('Authorization', `jwt ${jwt}`)
         .expect(201);

      return request
         .get('/api/expense')
         .set('Authorization', `jwt ${jwt}`)
         .then((res) => {
            expect(res.body).toContainEqual(expect.objectContaining(newExpense));
            expect(res.body.length).toBe(1);
            expense = res.body.find(b => b.description === newExpense.description);
            expect(expense).toBeTruthy();
         });
   });
   test('should authorize post', async () => (
      request
         .post('/api/expense')
         .send(expense)
         .expect(401)
   ));
   test('should validate post', async () => (
      request
         .post('/api/expense')
         .send({ ...expense, description: null })
         .set('Authorization', `jwt ${jwt}`)
         .expect(422)
   ));

   // PUT
   test('can update', async () => {
      await request
         .put(`/api/expense/${expense.id}`)
         .send({ ...expense, description: 'test2', amount: 11 })
         .set('Authorization', `jwt ${jwt}`)
         .expect(200);

      return request
         .get('/api/expense')
         .set('Authorization', `jwt ${jwt}`)
         .then((res) => {
            expect(res.body).toContainEqual(expect.objectContaining({
               ...expense, description: 'test2', amount: 11,
            }));
            expense = res.body.find(b => b.description === 'test2');
            expect(expense).toBeTruthy();
         });
   });
   test('should authorize put', async () => (
      request
         .put(`/api/expense/${expense.id}`)
         .send({ ...expense, description: 'test2', amount: 11 })
         .expect(401)
   ));
   test('should validate put', async () => (
      request
         .put(`/api/expense/${expense.id}`)
         .send({ description: 'test2', amount: 11 })
         .set('Authorization', `jwt ${jwt}`)
         .expect(422)
   ));

   // DELETE
   test('can delete', async () => {
      await request
         .delete(`/api/expense/${expense.id}`)
         .set('Authorization', `jwt ${jwt}`)
         .expect(200);

      return request
         .get('/api/expense')
         .set('Authorization', `jwt ${jwt}`)
         .then((res) => {
            expect(res.body).not.toContainEqual(expect.objectContaining(expense));
            expect(res.body.length).toBe(0);
         });
   });
   test('should authorize delete', async () => (
      request
         .delete(`/api/expense/${expense.id}`)
         .expect(401)
   ));
   test('should validate delete', async () => (
      request
         .put('/api/expense/123')
         .set('Authorization', `jwt ${jwt}`)
         .expect(404)
   ));
});
