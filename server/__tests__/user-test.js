const supertest = require('supertest');
const server = require('../server');
const clearDatabase = require('../store/clear-database');

describe('users', () => {
   let request = null;
   let jwt = null;
   let user = null;

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

   // GET
   test('can get', () => (
      request
         .get('/api/user')
         .set('Authorization', `jwt ${jwt}`)
         .expect(200)
         .then((res) => {
            expect(res.body).toContainEqual(expect.objectContaining({
               name: 'admin', role: 'admin',
            }));
         })
   ));
   test('should authorize get', async () => (
      request
         .get('/api/user')
         .expect(401)
   ));

   // POST
   test('can post', async () => {
      await request
         .post('/api/user')
         .send({ name: 'User1', password: 'password1', role: 'user' })
         .set('Authorization', `jwt ${jwt}`)
         .expect(201);

      return request
         .get('/api/user')
         .set('Authorization', `jwt ${jwt}`)
         .then((res) => {
            expect(res.body).toContainEqual(expect.objectContaining({
               name: 'User1', role: 'user',
            }));
            expect(res.body.length).toBe(2);
            user = res.body.find(b => b.name === 'User1');
            expect(user).toBeTruthy();
         });
   });
   test('should authorize post', async () => (
      request
         .post('/api/user')
         .send({ name: 'User1', password: 'password1', role: 'user' })
         .expect(401)
   ));
   test('should validate post', async () => (
      request
         .post('/api/user')
         .send({ name: 'User1', role: 'user' })
         .set('Authorization', `jwt ${jwt}`)
         .expect(422)
   ));

   // PUT
   test('can update', async () => {
      await request
         .put(`/api/user/${user.id}`)
         .send({ name: 'User2', password: 'password2', role: 'user' })
         .set('Authorization', `jwt ${jwt}`)
         .expect(200);

      return request
         .get('/api/user')
         .set('Authorization', `jwt ${jwt}`)
         .then((res) => {
            expect(res.body).toContainEqual(expect.objectContaining({
               name: 'User2', role: 'user',
            }));
            user = res.body.find(b => b.name === 'User2');
            expect(user).toBeTruthy();
         });
   });
   test('should authorize put', async () => (
      request
         .put(`/api/user/${user.id}`)
         .send({ name: 'User1', password: 'password1', role: 'user' })
         .expect(401)
   ));
   test('should validate put', async () => (
      request
         .put(`/api/user/${user.id}`)
         .send({ name: 'User1', role: 'user' })
         .set('Authorization', `jwt ${jwt}`)
         .expect(422)
   ));

   // DELETE
   test('can delete', async () => {
      await request
         .delete(`/api/user/${user.id}`)
         .set('Authorization', `jwt ${jwt}`)
         .expect(200);

      return request
         .get('/api/user')
         .set('Authorization', `jwt ${jwt}`)
         .then((res) => {
            expect(res.body).not.toContainEqual(expect.objectContaining({
               name: 'User1', role: 'user',
            }));
            expect(res.body.length).toBe(1);
         });
   });
   test('should authorize delete', async () => (
      request
         .delete(`/api/user/${user.id}`)
         .expect(401)
   ));
   test('should validate delete', async () => (
      request
         .put('/api/user/123')
         .set('Authorization', `jwt ${jwt}`)
         .expect(404)
   ));
});
