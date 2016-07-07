'use strict';

// TODO: Add comment functionality - http://docs.sequelizejs.com/en/latest/docs/associations/

var express = require('express');
var router = express.Router();
var Comment = require('../models').Comment;

/* GET get comments. */
router.get('/', function(req, res, next) {
  Comment.findAll({}).then(function (comments) {
    console.log(comments);
    res.json(comments);
  });
});

// add new todo
router.post('/articles/:id/comment', function(req, res) {
  Comment.create({
    comment: req.body.comment,
    author: req.body.author,
    ArticleId: req.params.id
  }).then(function(comments) {
    res.redirect("/articles/" + req.params.id);
  });
});

module.exports = router;
