
exports.seed = (knex, Promise) => {
  return knex('items').del()
    .then( () => {
      return Promise.all([
        knex('items').insert({items: 'helmet', packed: false}),
        knex('items').insert({items: 'space suite', packed: false}),
        knex('items').insert({items: 'freeze dried icecream', packed: false}),
      ]);
    });
};
