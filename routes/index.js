var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expresso' });
});
router.get('/page1', function(req, res, next) {
  res.render('page1');
});
router.get('/page2', function(req, res, next) {
  res.render('page2');
});

router.get('/page3', function(req, res, next) {
  res.render('page3');
});
router.get('/page4', function(req, res, next) {
  res.render('page4');
});
router.get('/page5', function(req, res, next) {
  res.render('page5');
});
router.get('/page_template', function(req, res, next) {
  res.render('page_template');
});


module.exports = router;
