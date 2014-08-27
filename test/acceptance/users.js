/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'facebook-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('users', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /profile/edit', function(){
    it('should show the edit profile  page', function(done){
      request(app)
      .get('/profile/edit')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('bob@aol.com');
        expect(res.text).to.include('Email');
        expect(res.text).to.include('Phone');
        expect(res.text).to.include('Public');
        done();
      });
    });
  });

  describe('put /profile', function(){
    it('should edit the profile page', function(done){
      request(app)
      .post('/profile')
      .send('_method=put&visible=private&email=mikeb_barreiro%40yahoo.com&phone=1234567&photo=photourl&tagline=nazz&facebook=facebook+URL&twitter=TWEET')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
//testing the redirect
        expect(res.headers.location).to.equal('/profile');
        done();
      });
    });
  });

  describe('get /index', function(){
    it('should show all users', function(done){
      request(app)
      .get('/index')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('get /users', function(){
    it('Should render you to the Users Page', function(done){
      request(app)
      .get('/users/bob@aol.com')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });


    it('Should not show you the Users Page', function(done){
      request(app)
      .get('/users/bob@aol.com')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/users');
        done();
      });
    });
  });

  describe('post /message/000000000000000000000002', function(){
    it('should send user a message', function(done){
      request(app)
      .post('/message/000000000000000000000002')
      .set('cookie', cookie)
      .send('_method=put&mtype=text&message=Hello%21')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/users/sue@aol.com');
        done();
      });
    });
  });
});

