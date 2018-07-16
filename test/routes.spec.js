const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

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

  describe('GET /api/v1/items', () => {
    it('should return all the items', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[0].should.have.property('item');
          response.body[0].item.should.equal('helmet');
          response.body[0].should.have.property('packed');
          response.body[0].packed.should.equal(false);
          done();
        });
    });
  });

});
