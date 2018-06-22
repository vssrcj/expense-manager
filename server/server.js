const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.use(bodyParser.json());

const wrapper = require('./async-wrapper');
const setupStore = require('./store/store-setup');
const controllers = require('./controllers');

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
   app.listen(port, () => {
      console.log(`Listening on port ${port}`);
   });
}

app.get('/api', (req, res) => res.send({ message: 'Hello' }));

const wrappedApp = wrapper(app);

controllers.forEach(controller => controller(wrappedApp));

module.exports = (async () => {
   await setupStore();
   return app;
})();
