var express = require('express');
var router = express.Router();
var fs = require('fs');

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
router.get('/page6', function(req, res, next) {
  res.render('page6');
});
router.get('/page7', function(req, res, next) {
  res.render('page7');
});
router.get('/page8', function(req, res, next) {
  res.render('page8');
});
router.get('/page_template', function(req, res, next) {
  res.render('page_template');
});
router.post('/login', function(req, res, next) {
  var emailPwPairs = {email: req.body.email, pw: req.body.password};
  let correct = false;
  fs.readFile('database/users.txt', 'utf8', function(err, data) {
    if(err) {
      res.status(500).send('something is wrong');
    } else {
      var prevFile = JSON.parse(data);
      var prevData = prevFile.emailPwPairs;
      for (let dataIndex = 0; dataIndex < prevData.length; dataIndex++) {
        if(prevData[dataIndex].email === emailPwPairs.email && prevData[dataIndex].pw === emailPwPairs.pw) {
          correct = true;
          break;
        }
      };
      if(correct) {
        res.redirect('/page1');
      } else {
        res.send('Invalid Email or Password');
      }
    }
  });
});
router.post('/signup', function(req, res, next) {
  var emailPwPairs = {email: req.body.email, pw: req.body.password};
  fs.readFile('database/users.txt', 'utf8', function(err, data) {
    if(err) {
      res.status(500).send('something is wrong');
    } else {
      var prevFile = JSON.parse(data);
      var prevData = prevFile.emailPwPairs;
      for (var dataIndex = 0; dataIndex < prevData.length; dataIndex++) {
        if (prevData[dataIndex].email === emailPwPairs.email) {
          res.send('Same Email is already exist');
          return;
      }};
      prevData.push(emailPwPairs);
      prevFile.pairsNumber = prevData.length;
      fs.writeFile('database/users.txt', JSON.stringify(prevFile), function(err) {
        if(err) {
          res.status(500).send('something is wrong');
        } else {
          res.redirect('/page8');
        }
      });
    }
  });
});



module.exports = router;
