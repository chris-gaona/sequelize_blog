'use strict';

// TODO: Add comment functionality - http://docs.sequelizejs.com/en/latest/docs/associations/

var express = require('express');
var router = express.Router();
var Comment = require('../models').Comment;

// add new comment
router.post('/articles/:id/comment', function(req, res) {
  Comment.create({
    comment: req.body.comment,
    author: req.body.author,
    ArticleId: req.params.id
  }).then(function() {
    res.redirect("/articles/" + req.params.id);
  });
});

/* Delete comment form. */
router.get("/articles/:id/comments/:commentId/delete", function(req, res, next){
  var article = {};
  article.id = req.params.id;
  Comment.findById(req.params.commentId).then(function (comment) {
    if (comment) {
      res.render("articles/delete_comment", {article: article, comment: comment, title: "Delete Comment"});
    } else {
      res.sendStatus(404);
    }
  }).catch(function (err) {
    res.sendStatus(500);
  });
});

/* DELETE individual comment. */
router.delete("/articles/:id/comment/:commentId", function(req, res, next){
  Comment.findById(req.params.commentId).then(function (comment) {
    if (comment) {
      return comment.destroy();
    } else {
      res.sendStatus(404)
    }
  }).then(function () {
    res.redirect("/articles/" + req.params.id);
  }).catch(function (err) {
    res.sendStatus(500);
  });
});

module.exports = router;
