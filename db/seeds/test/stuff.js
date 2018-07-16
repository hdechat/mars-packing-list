
exports.seed = (knex, Promise) => {
  return knex('items').del()
    .then( () => {
      return knex('items').insert([
        {id: 1, items: 'helmet', packed: false},
        {id: 1, items: 'space suite', packed: false},
        {id: 1, items: 'freeze dried icecream', packed: false},
      ]);
    });
};
