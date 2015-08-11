var Promise = require('bluebird');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);
chai.request.addPromises(Promise);

var app = require('../app');
var models = require('../db');

var clean_up = function(ids, cb) {
  models.db.query('MATCH (n) WHERE id(n) IN {ids} OPTIONAL MATCH (n)-[r]-() DELETE n,r', {'ids': ids}, function() {
    cb();
  });
};

describe('Signup tests', function() {
  var ids_to_be_deleted = [];
  var instances = {};

  before(function(done) {
    done();
  });

  after(function(done) {
    clean_up(ids_to_be_deleted, done);
  });

  it('should be able to signup as a dev with a password', function(done) {
    chai.request(app).post('/auth/signup').send({'name': 'test', 'email': 'test@testy.com', 'password': 'iconapop', 'links': ['other|http://google.com']}).then(function(res) {
      expect(res.status).to.eql(200);

      models.User.where({'email': 'test@testy.com'}).then(function(user) {
        if (user.length === 1) ids_to_be_deleted.push(user[0].id);

        expect(user).to.have.length(1);
        expect(user[0].name).to.eql('test');
        expect(user[0].kind).to.eql('dev');
        expect(user[0].links).to.have.length(1);
        done();
      }, done);
    }, done);
  });

  it('shouldn\'t be able to signup using an already used email', function(done) {
    chai.request(app).post('/auth/signup').send({'name': 'test2', 'email': 'test@testy.com', 'password': 'charlixcx', 'links': ['other|http://google.com']}).then(function(res) {
      expect(res.status).to.eql(409);
      done();
    }, done);
  });

  it('shouldn\'t be able to signup with invalid links', function(done) {
    chai.request(app).post('/auth/signup').send({'name': 'test2', 'email': 'test2@testy.com', 'password': 'charlixcx', 'links': ['other|htt/google.com']}).then(function(res) {
      expect(res.status).to.eql(401);

      models.User.where({'email': 'test2@testy.com'}).then(function(user) {
        if (user.length === 1) ids_to_be_deleted.push(user[0].id);

        expect(user).to.have.length(0);
        done();
      }, done);
    }, done);
  });

  it('should be able to signup as a rep with a password', function(done) {
    chai.request.agent(app).post('/auth/signup').send({'user_kind': 'rep', 'name': 'test rep', 'email': 'test@reppy.com', 'password': 'billyg', 'links': ['other|http://google.com']}).then(function(res) {
      expect(res.status).to.eql(200);

      models.User.where({'email': 'test@reppy.com'}).then(function(user) {
        if (user.length === 1) ids_to_be_deleted.push(user[0].id);

        expect(user).to.have.length(1);
        expect(user[0].name).to.eql('test rep');
        expect(user[0].kind).to.eql('rep');
        expect(user[0].links).to.have.length(1);
        done();
      }, done);
    }, done);
  });

  it('should be able to login with a password', function(done) {
    chai.request(app).post('/auth/login').send({'email': 'test@testy.com', 'password': 'iconapop'}).then(function(res) {
      expect(res.status).to.eql(200);
      done();
    }, done);
  });

  it('shouldn\'t be able to login with the wrong password', function(done) {
    chai.request(app).post('/auth/login').send({'email': 'test@testy.com', 'password': 'iloveit'}).then(function(res) {
      expect(res.status).to.eql(401);
      done();
    }, done);
  });


});
