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

   test('admin can login', () => (
      request
         .post('/api/login')
         .send({ name: 'admin', password: 'admin' })
         .then((res) => {
            expect(res.body.token).toBeTruthy();
            jwt = res.body.token;
         })
   ));

   test('create user manager', () => (
      request
         .post('/api/user')
         .send({ name: 'user manager', password: 'user-manager', role: 'user-manager' })
         .set('Authorization', `jwt ${jwt}`)
         .then((res) => {
            expect(res.body.id).toBeTruthy();
            userId = res.body.id;
         })
   ));

   test('login with user manager', () => (
      request
         .post('/api/login')
         .send({ name: 'user manager', password: 'user-manager' })
         .then((res) => {
            expect(res.body.token).toBeTruthy();
            jwt = res.body.token;
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
   test('should get users', async () => (
      request
         .get('/api/user')
         .set('Authorization', `jwt ${jwt}`)
         .expect(200)
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
   test('should post user', async () => (
      request
         .post('/api/user')
         .send({
            name: 'some user', password: 'some user', role: 'user',
         })
         .set('Authorization', `jwt ${jwt}`)
         .expect(201)
   ));
});
