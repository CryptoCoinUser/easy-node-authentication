process.env.NODE_ENV = 'test';
var User  = require('../app/models/user');


const chai = require('chai');
const chaiHttp = require('chai-http');
//const faker = require('faker');
const {app} = require('../server');
const should = chai.should();


chai.use(chaiHttp);


console.log('test called');

  describe('basic endpoints', function() {

  let user;
  before(function() {
    return User.findOne()
    .exec()
    .then(_user => user = _user);
  });

    it('slash should return home page', function() {
      let res;
      console.log('user is');
      console.log(user);
      return chai.request(app)
        .get('/')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);

        })
    });

    /**/
    it('/login should return login page', function() {
      let res;
      return chai.request(app)
        .get('/login')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);

        })
    });

    /*
    it('add coin for a findOne() user', function() {
      let res;
      let coinQtyPair = {abrv: "BTC", qty: 1}
      return chai.request(app)
        .post('/coin/add')
        .send(coinQtyPair)
        .then(function(_res) {
          res = _res;

          

        })
    });
    */
 });