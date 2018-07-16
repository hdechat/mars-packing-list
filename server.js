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
  const newItem =request.body;

  for (let props of Object.keys(newItem)) {
    if (!['item', 'packed'].includes(props)) {
      return response.status(422).send({
      error: 'Invalid entry. Please include "name" <string> and "packed" <boolean> properties'
      });
    };
  }

  if(Object.keys(newItem).length !== 2) {
    return response.status(422).send({
      error: 'Data missing! Please include "name" <string> and "packed" <boolean> properties'
    });
  }

  database('items').insert(request.body, 'id')
    .then(item => response.status(201).json({ id: item[0] }))
    .catch(error => response.status(500).json({ error }));
});

app.put('/api/v1/items/:id', (request, response) => {
  const update = request.body;
  const { id } = request.params;

  for (let props of Object.keys(update)) {
    if (!['item', 'packed'].includes(props)) {
      return response.status(422).send({
        error: 'Invalid entry. Properties should be either "item" or "packed"'
      });
    };
  }

  database('items').where('id', id).select()
    .then(item => {
      if(item.length) {
        database('items').where('id', id).update(update)
          .then(() => {
            database('items').where('id', id).select()
              .then(updatedItem => {
                response.status(202).json(updatedItem);
              });
          });
      } else {
        response.status(404).json({ error: `Could not find item with id: ${id}` })
      }
    })
    .catch(error => response.status(500).json({ error }));
});

app.delete('/api/v1/items/:id', (request, response) => {
  const { id } = request.params

  database('items').where('id', id).select()
    .then(item => {
      if (item.length) {
        database('items').where('id', id).delete()
          .then(() => response.sendStatus(204))
          .catch(error => response.status(500).json({ error }));
      } else {
        response.status(404).json({ error: `Could not find item with id: ${id}` })
      }
    })
});

app.listen(app.get('port'), () => {
  console.log(`Server is running on ${app.get('port')}.`);
});

app.use((request, response) => {
  response.status(404).send('PAGE NOT FOUND');
});

module.exports = app;
