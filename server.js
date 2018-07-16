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

app.get('/api/v1/items', (request, response) => {
  database('items').select()
   .then(list => response.status(200).json(list))
    .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/items', (request, response) => {
  database('items').insert(request.body, 'id')
    .then(item => response.status(201).json({ id: item[0] }))
    .catch(error => response.status(500).json({ error }));
});

app.put('/api/v1/items/:id', (request, response) => {
  const update = request.body;
  const { id } = request.params;

  database('items').where('id', id ).update(update).select()
    .then(item => response.status(202).json(item))
    .catch(error => response.status(500).json({ error }));
});

app.listen(app.get('port'), () => {
  console.log(`Server is running on ${app.get('port')}.`);
});