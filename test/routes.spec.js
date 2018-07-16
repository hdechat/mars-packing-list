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

  describe('POST /api/v1/items', () => {
    it('should return new id of posted item', done => {
      chai.request(server)
        .post('/api/v1/items')
        .send({
          item: 'boots',
          packed: false
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.should.be.a('object');
          response.body.id.should.equal(4);
          done();
        });
    });

    it('should not post a new item if request is sent incorrectly', done => {
      chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'space suite',
          packed: false
        })
        .end((err, response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          done();
        });
    });

    it('should not post a new item if there is data missing', done => {
      chai.request(server)
        .post('/api/v1/items')
        .send({
          item: 'space suit'
        })
        .end((err,response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          done();
        });
    });
  });

  describe('PUT /api/v1/items:id', () => {
    it('should return updated item object', done => {
      chai.request(server)
        .put('/api/v1/items/1')
        .send({
          packed: true
        })
        .end((err, response) => {
          response.should.have.status(202);
          response.should.be.json;
          response.body[0].should.be.a('object');
          response.body[0].should.have.property('item');
          response.body[0].item.should.equal('helmet');
          response.body[0].should.have.property('packed');
          response.body[0].packed.should.equal(true);
          done();
        });
    });

    it('should return 404 when item to update does not exist', done => {
      chai.request(server)
        .put('/api/v1/items/5')
        .send({
          item: 'space suit',
          packed: false
        })
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.have.property('error');
          done();
        });
    });

    it('should return 422 request if incorrect properties are sent', done => {
      chai.request(server)
        .put('/api/v1/1')
        .send({
          name: 'space suite'
        })
        .end((err, response) => {
          response.should.have.status(422);
          response.body.should.have.property('error');
        });
    });

  });

  describe('DELETE /api/v1/items:id', () => {
    it('should return status 204', done => {
      chai.request(server)
        .delete('/api/v1/items/1')
        .end((err, response) => {
          response.should.have.status(204);
          done();
        });
    });
  });

});
