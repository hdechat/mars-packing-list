const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

describe('Client routes', () => {

  it('should return 404 with an unknown endpoint', done => {
    chai.request(server)
      .get('/api/v1/badendpoint')
      .end((error, response) => {
        response.should.have.status(404);
      });
    done();
  });
  
});

describe('API Routes', () => {

  beforeEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            return knex.seed.run()
              .then(() => {
                done();
              });
          });
      }).catch(error => {
        throw error;
      });
      
  });

});