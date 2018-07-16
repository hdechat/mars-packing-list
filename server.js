const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

app.get('/', (request, response) => {
  response.send('Success');
});

app.listen(app.get('port'), () => {
  console.log(`Server is running on ${app.get('port')}.`);
});