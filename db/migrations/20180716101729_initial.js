exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('items', table => {
      table.increments('id').primary();
      table.string('item');
      table.boolean('packed');
    })
  ])
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('items'),
  ]);
};
