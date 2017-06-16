const chai = require('chai');
const chaiHttp = require('chai-http');
//const faker = require('faker');
const {app} = require('../server');
const should = chai.should();


chai.use(chaiHttp);


console.log('test called');

  describe('basic endpoints', function() {

    it('slash should return home page', function() {
      let res;
      return chai.request(app)
        .get('/')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);

        })
    });


    it('/login should return login page', function() {
      let res;
      return chai.request(app)
        .get('/login')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);

        })
    });




 });