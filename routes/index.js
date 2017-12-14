var express = require('express');
var router = express.Router();
var fs = require('fs');
var session = require('express-session');

router.use(session({
  secret: 'hahahahah',
  resave: false,
  saveUninitialized: true,
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expresso' });
});
router.get('/page1', function(req, res, next) {
  if(req.session.userId) {
    res.render('page1', {signin: true, trips:[{},{},{}]);
  } else {
    res.render('page1');
  }
});
router.get('/page2', function(req, res, next) {
  if(req.session.userId) {
    res.render('page2', {signin: true});
  } else {
    res.render('page2');
  }
});
// router.get('/page3', function(req, res, next) {
//   res.render('page3');
// });
// router.get('/page4', function(req, res, next) {
//   res.render('page4');
// });
// router.get('/page5', function(req, res, next) {
//   res.render('page5');
// });
// router.get('/page6', function(req, res, next) {
//   res.render('page6');
// });
router.get('/page7', function(req, res, next) {
  if(req.session.userId) {
    res.render('page7', {signin: true});
  } else {
    res.render('page7');
  }
});
router.get('/page8', function(req, res, next) {
  res.render('page8');
});
router.get('/page_template', function(req, res, next) {
  res.render('page_template');
});
router.get('/logout',function(req, res, next) {
  req.session.destroy();
  res.render('page1');
});
router.get('/MyReservation',function(req, res, next) {
  if(req.session.userId){
    res.render('page5', {reservations:[]});
  } else {
    res.render('page8');
  }
});
router.get('/MyHosting',function(req, res, next) {
  if(req.session.userId){
    res.render('page6', {hostings:[]});
  } else {
    res.render('page8');
  }
});
router.get('/HostHome',function(req, res, next) {
  if(req.session.userId){
    res.render('page3');
  } else {
    res.render('page8');
  }
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
          req.session.userId = prevData[dataIndex].id;
          break;
        }
      };
    if(correct) {
      res.render('page1', {signin: true});
    } else {
      res.send('Invalid Email or Password');
      }
    }
  });
});
router.post('/signup', function(req, res, next) {
  var emailPwPairs = {email: req.body.email, pw: req.body.password, hostIds: [], tripIds: []};
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
      emailPwPairs.id = prevData.length;
      prevData.push(emailPwPairs);
      prevFile.pairsNumber = prevData.length;
      fs.writeFile('database/users.txt', JSON.stringify(prevFile), function(err) {
        if(err) {
          res.status(500).send('something is wrong');
        } else {
          res.render('page8');
        }
      });
    }
  });
});
router.post('/hosting1', function(req, res, next) {
  var idNum = 0;
  var tripSpecs = {id: idNum, kind: req.body.kind, type: req.body.type, room: req.body.room};
  fs.readFile('database/trips.txt', 'utf8', function(err, data) {
    if(err) {
      res.status(500).send('something is wrong');
    } else {
      var prevFile = JSON.parse(data);
      var prevData = prevFile.tripSpecs;
      tripSpecs.id = prevData.length; // potential hazard
      prevData.push(tripSpecs);
      prevFile.currentId = prevData.length;
      fs.writeFile('database/trips.txt', JSON.stringify(prevFile), function(err) {
        if(err) {
          res.status(500).send('something is wrong');
        } else {
          res.render('page4');
        }
      });
    }
  });
});
router.post('/hosting2', function(req, res, next) {
  fs.readFile('database/trips.txt', 'utf8', function(err, data) {
    if(err) {
      res.status(500).send('something is wrong');
    } else {
      var prevFile = JSON.parse(data);
      var prevData = prevFile.tripSpecs;
      prevData[prevFile.currentId-1].photoUrl = req.body.photo; // url로 저장
      prevData[prevFile.currentId-1].description = req.body.description;

      fs.writeFile('database/trips.txt', JSON.stringify(prevFile), function(err) {
        if(err) {
          res.status(500).send('something is wrong');
        } else {
          res.render('page6');
        }
      });
    }
  });
});

module.exports = router;
