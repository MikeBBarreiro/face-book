'use strict';

var bcrypt = require('bcrypt'),
    Mongo  = require('mongodb'),
        _  = require('lodash');

function User(){
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, function(err, obj){
    cb(err, _.create(User.prototype, obj));
  });
};

User.findOne = function(filter, cb){
  User.collection.findOne(filter, cb);

};

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user){return cb();}
    o.password = bcrypt.hashSync(o.password, 10);
    User.collection.save(o, cb);
  });
};

User.authenticate = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(o.password, user.password);
    if(!isOk){return cb();}
    cb(user);
  });
};

User.prototype.save = function(o, cb){
  var properties = Object.keys(o),
      self       = this;

  properties.forEach(function(property){
    switch(property){
      case 'visible':
        self.isVisible = o[property] === 'public';
        break;
      default:
        self[property] = o[property];
    }
  });

  User.collection.save(this, cb);
};

User.find = function(filter, cb){
  User.collection.find(filter).toArray(cb);
};

User.prototype.send = function(receiver, obj, cb){
  switch(obj.mtype){
    case 'text':
      sendText(receiver.phone, obj.message, cb);
      break;
    case 'email':
      break;
    case 'internal':
  }
};

module.exports = User;

function sendText(to, body, cb){
  if(!to){return cb();}

// Twilio Credentials
//var accountSid = 'AC0a827f121a01ab657a205a83ccf6d304',
  var accountSid = process.env.TWSID,
      authToken  = process.env.TWTOK,
            from = process.env.FROM,
//authToken = process.env.TWILIO,
//require the Twilio module and create a REST client
          client = require('twilio')(accountSid, authToken);

//'+19855904651'
  client.messages.create({to:to, from:from, body:body}, cb);
}
