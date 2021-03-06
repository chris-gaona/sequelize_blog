'use strict';

var express = require('express');
var router = express.Router();
var Article = require('../models').Article;
var Comment = require('../models').Comment;

/* GET articles listing. */
router.get('/', function(req, res) {
  Article.findAll({include: [{ model: Comment, as: 'comments'}], order: [[ 'createdAt', 'DESC' ]]
  }).then(function (articles) {
    res.render("articles/index", {articles: articles, title: "My Awesome Blog" });
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
});

/* POST create article. */
router.post('/', function(req, res) {
  Article.create(req.body).then(function (article) {
    res.redirect("/articles/" + article.id);
  }).catch(function (err) {
    if (err.name === "SequelizeValidationError") {
      //render
      res.render("articles/new", {
        article: Article.build(req.body),
        title: "New Article",
        errors: err.errors
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

/* Create a new article form. */
router.get('/new', function(req, res) {
  res.render("articles/new", {article: Article.build(), title: "New Article"});
});

/* Edit article form. */
router.get("/:id/edit", function(req, res){
  Article.findById(req.params.id).then(function (article) {
    if (article) {
      res.render("articles/edit", {article: article, title: "Edit Article"});
    } else {
      res.sendStatus(404);
    }
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
});

/* Delete article form. */
router.get("/:id/delete", function(req, res){
  Article.findById(req.params.id).then(function (article) {
    if (article) {
      res.render("articles/delete", {article: article, title: "Delete Article"});
    } else {
      res.sendStatus(404);
    }
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
});

/* GET individual article. */
router.get("/:id", function(req, res){
  Article.findById(req.params.id, {include: [{ model: Comment, as: 'comments' }], order: [[ {model: Comment, as: 'comments'}, 'createdAt', 'DESC' ]]}).then(function (article) {
    if (article) {
      res.render("articles/show", {article: article, title: article.title});
    } else {
      res.sendStatus(404);
    }
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
});

/* PUT update article. */
router.put("/:id", function(req, res){
  Article.findById(req.params.id).then(function (article) {
    if (article) {
      return article.update(req.body);
    } else {
      res.sendStatus(404);
    }
  }).then(function (article) {
    res.redirect("/articles/" + article.id);
  }).catch(function (err) {
    if (err.name === "SequelizeValidationError") {
      var article = Article.build(req.body);
      article.id = req.params.id;

      //render
      res.render("articles/edit", {
        article: article,
        title: "Edit Article",
        errors: err.errors
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

/* DELETE individual article. */
router.delete("/:id", function(req, res){
  Article.findById(req.params.id).then(function (article) {
    Comment.destroy({where: {ArticleId: req.params.id}}).then(function () {
      if (article) {
        return article.destroy();
      } else {
        res.sendStatus(404);
      }
    }).then(function () {
    res.redirect("/articles");
    });
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
});


module.exports = router;
