var express = require('express');
var router = express.Router();
var fs = require('fs');
var session = require('express-session');

router.use(session({
  secret: 'hahahahah',
  resave: false,
  saveUninitialized: true,
}));

router.get('/page1', function(req, res, next) {
  fs.readFile('database/trips.txt', 'utf8', function(err,data) {
    if(err) {
      res.status(500).send('something is wrong');
    } else {
      var prevFile = JSON.parse(data);
      var prevData = prevFile.tripSpecs;
      var trip = [];
      var numId = prevFile.currentId;
      if (numId > 3) {
        for (let i=numId-1; i>=numId-3; i--) {
          trip.push(prevData[i]);
        }
      } else {
        for (let i=numId-1; i>=0; i--) {
          trip.push(prevData[i]);
        }
      }
      console.log(trip);
      if(req.session.userId) {
        res.render('page1', {signin: true, trips: trip});
      } else {
        res.render('page1', {trips: trip});
      }
    }
  });
});
router.get('/page2', function(req, res, next) {
  if(req.session.userId) {
    res.render('page2', {signin: true});
  } else {
    res.render('page2');
  }
});
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
  // var tripSpecs = {kind: req.body.kind, type: req.body.type, room: req.body.room, photoUrl: null};
  req.session.item = {};
  var item = req.session.item;
  item.kind = req.body.kind;
  item.type = req.body.type;
  item.room = req.body.room;
  res.render('page9');
  // fs.readFile('database/trips.txt', 'utf8', function(err, data) {
  //   if(err) {
  //     res.status(500).send('something is wrong');
  //   } else {
  //     var prevFile = JSON.parse(data);
  //     var prevData = prevFile.tripSpecs;
  //     if(prevData[prevData.length-1].photoUrl === tripSpecs.photoUrl) {
  //       tripSpecs.id = prevData.length
  //       prevData.pop();
  //       prevData.push(tripSpecs);
  //     } else {
  //       tripSpecs.id = prevData.length; // potential hazard
  //       prevData.push(tripSpecs);
  //       prevFile.currentId = prevData.length;
  //     }
  //
  //     fs.writeFile('database/trips.txt', JSON.stringify(prevFile), function(err) {
  //       if(err) {
  //         res.status(500).send('something is wrong');
  //       } else {
  //         res.render('page9');
  //       }
  //     });
  //   }
  // });
});
router.post('/hosting2', function(req, res, next) {
  var item = req.session.item;
  if (req.body.title && req.body.description) {
    item.title = req.body.title;
    item.description = req.body.description;
    res.render('page4', {fillin: false});
  } else {
    res.render('page9', {fillin: true});
  }

  // fs.readFile('database/trips.txt', 'utf8', function(err, data) {
  //   if(err) {
  //     res.status(500).send('something is wrong');
  //   } else {
  //     var prevFile = JSON.parse(data);
  //     var prevData = prevFile.tripSpecs;
  //     prevData[prevFile.currentId-1].title = req.body.title;
  //     prevData[prevFile.currentId-1].description = req.body.description;
  //     fs.writeFile('database/trips.txt', JSON.stringify(prevFile), function(err) {
  //       if(err) {
  //         res.status(500).send('something is wrong');
  //       } else {
  //         if (req.body.title && req.body.description) {
  //           res.render('page4');
  //         } else {
  //
  //         }
  //       }
  //     });
  //   }
  // });
});
router.post('/hosting3', function(req, res, next) {
  var tripSpecs = {};
  tripSpecs.kind = req.session.item.kind;
  tripSpecs.type = req.session.item.type;
  tripSpecs.room = req.session.item.room;
  tripSpecs.title = req.session.item.title;
  tripSpecs.description = req.session.item.description;
  if (req.body.photo) {
    tripSpecs.photoUrl = req.body.photo;
    fs.readFile('database/trips.txt', 'utf8', function(err, data) {
      if(err) {
        res.status(500).send('something is wrong');
      } else {
        var prevFile = JSON.parse(data);
        var prevData = prevFile.tripSpecs;
        tripSpecs.id = prevData.length;
        prevData.push(tripSpecs);
        prevFile.currentId = prevData.length;
        fs.writeFile('database/trips.txt', JSON.stringify(prevFile), function(err) {
          if(err) {
            res.status(500).send('something is wrong');
          } else {
            res.render('page6', {fillin: false});
          }
        });
      }
    });
  } else {
    res.render('page4', {fillin: true});
  }
});

router.get('/page4', function(req, res, next) {
  res.render('page4');
});
module.exports = router;
