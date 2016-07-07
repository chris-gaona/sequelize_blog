'use strict';

// Adds comment functionality - http://docs.sequelizejs.com/en/latest/docs/associations/

var express = require('express');
var router = express.Router();
var Comment = require('../models').Comment;
var Article = require('../models').Article;

/* POST add new comment. */
router.post('/articles/:id/comment', function(req, res) {
  Comment.create({
    comment: req.body.comment,
    author: req.body.author,
    ArticleId: req.params.id
  }).then(function() {
    res.redirect("/articles/" + req.params.id);
  }).catch(function (err) {
    if (err.name === "SequelizeValidationError") {
      //render
      Article.findById(req.params.id, {include: [{ model: Comment, as: 'comments' }]}).then(function (article) {
        if (article) {
          res.render("articles/show", {
            article: article,
            title: article.title,
            errors: err.errors
          });
        } else {
          res.sendStatus(404);
        }
      }).catch(function (err) {
        console.log(err);
        res.sendStatus(500);
      });
    } else {
      // throw error to be handled by final catch
      throw err;
    }
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
});

/* POST create article. */
// router.post('/', function(req, res) {
//   Article.create(req.body).then(function (article) {
//     res.redirect("/articles/" + article.id);
//   }).catch(function (err) {
//     if (err.name === "SequelizeValidationError") {
//       //render
//       res.render("articles/new", {
//         article: Article.build(req.body),
//         title: "New Article",
//         errors: err.errors
//       });
//     } else {
//       // throw error to be handled by final catch
//       throw err;
//     }
//   }).catch(function (err) {
//     console.log(err);
//     res.sendStatus(500);
//   });
// });

/* DELETE comment form. */
router.get("/articles/:id/comments/:commentId/delete", function(req, res){
  var article = {};
  article.id = req.params.id;
  Comment.findById(req.params.commentId).then(function (comment) {
    if (comment) {
      res.render("articles/delete_comment", {article: article, comment: comment, title: "Delete Comment"});
    } else {
      res.sendStatus(404);
    }
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
});

/* DELETE individual comment. */
router.delete("/articles/:id/comment/:commentId", function(req, res){
  Comment.findById(req.params.commentId).then(function (comment) {
    if (comment) {
      return comment.destroy();
    } else {
      res.sendStatus(404);
    }
  }).then(function () {
    res.redirect("/articles/" + req.params.id);
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
});

module.exports = router;
