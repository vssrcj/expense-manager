const supertest = require('supertest');
const server = require('../server');
const clearDatabase = require('../store/clear-database');

describe('user role', () => {
   let request = null;
   let userId = null;
   let jwt = null;

   beforeAll(async () => {
      request = supertest.agent(await server);
      await clearDatabase();
   });

   afterAll(async () => (await server).close());

   test('user can signup', () => (
      request
         .post('/api/signup')
         .send({ name: 'user', password: 'user' })
         .then((res) => {
            expect(res.body.token).toBeTruthy();
            jwt = res.body.token;
            userId = res.body.id;
         })
   ));

   // GET
   test('should authorize get all expenses', async () => (
      request
         .get('/api/expense')
         .set('Authorization', `jwt ${jwt}`)
         .expect(401)
   ));
   test('should get my expenses', async () => (
      request
         .get(`/api/expense/${userId}`)
         .set('Authorization', `jwt ${jwt}`)
         .expect(200)
   ));
   test('should authorize get users', async () => (
      request
         .get('/api/user')
         .set('Authorization', `jwt ${jwt}`)
         .expect(401)
   ));

   // POST
   test('should authorize post expense', async () => (
      request
         .post('/api/expense')
         .send({
            userId: 0,
         })
         .set('Authorization', `jwt ${jwt}`)
         .expect(401)
   ));
   test('should post my expense', async () => (
      request
         .post('/api/expense')
         .send({
            userId, description: 'test', datetime: (new Date()).getTime(), amount: 10, comment: 'test comment',
         })
         .set('Authorization', `jwt ${jwt}`)
         .expect(201)
   ));
   test('should authorize post user', async () => (
      request
         .post('/api/user')
         .set('Authorization', `jwt ${jwt}`)
         .expect(401)
   ));
});
