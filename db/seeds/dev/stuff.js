
exports.seed = (knex, Promise) => {
  return knex('items').del()
    .then(() => {
      return knex('items').insert(items);
    });
};
