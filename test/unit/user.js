/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'template-test';

describe('User', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new User object', function(){
      var u = new User();
      expect(u).to.be.instanceof(User);
    });
  });

  describe('#save', function(){
    it('should update and save  users profile', function(){
      var u = new User(),
          o = {x:3, visible:'public', foo:'bar'};

      u.baz = 'bim';
      u.save(o, function(err, user){
        expect(user.isVisible).to.be.true;
        expect(user.foo).to.equal('bar');
        expect(user.baz).to.equal('bim');
      });
    });
  });

  describe('.all', function(){
    it('Should Find all users', function(done){
      User.all(function(err, users){
        expect(users).to.have.length(3);
        done();
      });
    });
  });
});


