
exports.seed = (knex, Promise) => {
  return knex('items').del()
    .then( () => {
      return Promise.all([
        knex('items').insert({item: 'helmet', packed: false}),
        knex('items').insert({item: 'space suite', packed: false}),
        knex('items').insert({item: 'freeze dried icecream', packed: false}),
      ]);
    });
};
