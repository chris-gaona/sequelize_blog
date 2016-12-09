'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models').User;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Serialize sessions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.find({where: {id: id}}).success(function(user){
    done(null, user);
  }).error(function(err){
    done(err, null);
  });
});

// Use local strategy to create user account
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.find({ where: { username: username }}).success(function(user) {
      if (!user) {
        done(null, false, { message: 'Unknown user' });
      } else if (password != user.password) {
        done(null, false, { message: 'Invalid password'});
      } else {
        done(null, user);
      }
    }).error(function(err){
      done(err);
    });
  }
));
