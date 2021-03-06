var express = require('express');
var router = express.Router();
var fs = require('fs');
var session = require('express-session');
var multer = require('multer');
var path = require('path');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  })
});

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
      var numId = prevFile.currentId;
      var noTrip = {"title":"Host now!!!", "description":"Host now!!!", "photoName":"airpnp.png"};
      var trip_1 = [];
      for (let i=numId-1; i>numId-4; i--) {
        if(prevData[i]) {
          trip_1.push(prevData[i]);
        } else {
          trip_1.push(noTrip);
        }
      };
      if (numId>3) {
        var trip_2 = [];
        for (let i=numId-4; i>numId-7; i--) {
          if(prevData[i]) {
            trip_2.push(prevData[i]);
          } else {
            trip_2.push(noTrip);
          }
        };
      }
      if (numId>6) {
        var trip_3 = [];
        for (let i=numId-7; i>numId-10; i--) {
          if(prevData[i]) {
            trip_3.push(prevData[i]);
          } else {
            trip_3.push(noTrip);
          }
        };
      }
      if(req.session.userId) {
        res.render('page1', {trips_1: trip_1, trips_2: trip_2, trips_3: trip_3, signin: true});
      } else {
        res.render('page1', {trips_1: trip_1, trips_2: trip_2, trips_3: trip_3});
      }
    }
  });
});
router.get('/page2', function(req, res, next) {
  fs.readFile('database/trips.txt', 'utf8', function(err,data) {
    if(err) {
      res.status(500).send('something is wrong');
    } else {
      var prevFile = JSON.parse(data);
      var prevData = prevFile.tripSpecs;
      for(var i=0; i<prevFile.currentId; i++) {
        if (Number(req.query.id) === i) {
          var hosting = prevData[i];
          break;
        }
      };
      if(req.session.userId) {
        res.render('page2', {signin: true, hostings: hosting});
      } else {
        res.render('page2', {hostings: hosting});
      }
    }
  });
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
  fs.readFile('database/trips.txt', 'utf8', function(err,data) {
    if(err) {
      res.status(500).send('something is wrong');
    } else {
      var prevFile = JSON.parse(data);
      var prevData = prevFile.tripSpecs;
      var numId = prevFile.currentId;
      var noTrip = {"title":"Host now!!!", "description":"Host now!!!", "photoName":"airpnp.png"};
      var trip_1 = [];
      for (let i=numId-1; i>numId-4; i--) {
        if(prevData[i]) {
          trip_1.push(prevData[i]);
        } else {
          trip_1.push(noTrip);
        }
      };
      if (numId>3) {
        var trip_2 = [];
        for (let i=numId-4; i>numId-7; i--) {
          if(prevData[i]) {
            trip_2.push(prevData[i]);
          } else {
            trip_2.push(noTrip);
          }
        };
      } else if (numId>6) {
        var trip_3 = [];
        for (let i=numId-7; i>numId-10; i--) {
          if(prevData[i]) {
            trip_3.push(prevData[i]);
          } else {
            trip_3.push(noTrip);
          }
        };
      }
      res.render('page1', {trips_1: trip_1, trips_2: trip_2, trips_3: trip_3});
    }
  });
});
router.post('/reservation', function(req, res, next) {
  if(req.session.userId) {
    fs.readFile('database/users.txt', 'utf8', function(err, data) {
      if(err) {
        res.status(500).send('something is wrong');
      } else {
        var userFile = JSON.parse(data);
        var userData = userFile.emailPwPairs;
        var overlap = false;
        for(var i=0; i<userFile.pairsNumber; i++) {
          if(i === req.session.userId) {
            for(var j=0; j<=userData[i].tripIds.length; j++) {
              if(userData[i].tripIds[j] === Number(req.body.hostingId)) {
                overlap = true;
                break;
              }
            };
            if(!overlap) {
              userData[i].tripIds.push(Number(req.body.hostingId));
            }
            break;
          }
        };
        var trips = userData[req.session.userId].tripIds;
        fs.readFile('database/trips.txt', 'utf8', function(err, data) {
          if(err) {
            res.status(500).send('something is wrong');
          } else {
            var prevFile = JSON.parse(data);
            var prevData = prevFile.tripSpecs;
            var numId = trips.length;
            var noTrip = {"title":"Book now!!!", "description":"Book now!!!", "photoName":"airpnp.png"};
            var trip_1 = [];
            for (let i=numId-1; i>numId-4; i--) {
              if(prevData[trips[i]]) {
                trip_1.push(prevData[trips[i]]);
              } else {
                trip_1.push(noTrip);
              }
            };
            if (numId>3) {
              var trip_2 = [];
              for (let i=numId-4; i>numId-7; i--) {
                if(prevData[trips[i]]) {
                  trip_2.push(prevData[trips[i]]);
                } else {
                  trip_2.push(noTrip);
                }
              };
            }
            if (numId>6) {
              var trip_3 = [];
              for (let i=numId-7; i>numId-10; i--) {
                if(prevData[trips[i]]) {
                  trip_3.push(prevData[trips[i]]);
                } else {
                  trip_3.push(noTrip);
                }
              };
            }
          }
          res.render('page5', {trips_1: trip_1, trips_2: trip_2, trips_3: trip_3});
        });
        fs.writeFile('database/users.txt', JSON.stringify(userFile), function(err) {
          if(err) {
            res.status(500).send('something is wrong');
          }
        });
      }
    });
  } else {
    res.render('page8');
  }
});
router.get('/MyReservation',function(req, res, next) {
  if(req.session.userId){
    fs.readFile('database/users.txt', 'utf8', function(err, data) {
      if(err) {
        res.status(500).send('something is wrong');
      } else {
        var userFile = JSON.parse(data)
        var userData = userFile.emailPwPairs;
        var reservations = userData[req.session.userId].tripIds;
        fs.readFile('database/trips.txt', 'utf8', function(err, data) {
          if(err) {
            res.status(500).send('something is wrong');
          } else {
            var prevFile = JSON.parse(data);
            var prevData = prevFile.tripSpecs;
            var numId = reservations.length;
            var noTrip = {"title":"Book now!!!", "description":"Book now!!!", "photoName":"airpnp.png"};
            var trip_1 = [];
            for (let i=numId-1; i>numId-4; i--) {
              if(prevData[reservations[i]]) {
                trip_1.push(prevData[reservations[i]]);
              } else {
                trip_1.push(noTrip);
              }
            };
            if (numId>3) {
              var trip_2 = [];
              for (let i=numId-4; i>numId-7; i--) {
                if(prevData[reservations[i]]) {
                  trip_2.push(prevData[reservations[i]]);
                } else {
                  trip_2.push(noTrip);
                }
              };
            }
            if (numId>6) {
              var trip_3 = [];
              for (let i=numId-7; i>numId-10; i--) {
                if(prevData[reservations[i]]) {
                  trip_3.push(prevData[reservations[i]]);
                } else {
                  trip_3.push(noTrip);
                }
              };
            }
            res.render('page5', {trips_1: trip_1, trips_2: trip_2, trips_3: trip_3});
          }
        });
      }
    });
  } else {
    res.render('page8');
  }
});
router.get('/MyHosting',function(req, res, next) {
  if(req.session.userId){
    fs.readFile('database/users.txt', 'utf8', function(err, data) {
      if(err) {
        res.status(500).send('something is wrong');
      } else {
        var userFile = JSON.parse(data)
        var userData = userFile.emailPwPairs;
        var hostings = userData[req.session.userId].hostIds;
        fs.readFile('database/trips.txt', 'utf8', function(err, data) {
          if(err) {
            res.status(500).send('something is wrong');
          } else {
            var prevFile = JSON.parse(data);
            var prevData = prevFile.tripSpecs;
            var numId = hostings.length;
            var noTrip = {"title":"Host now!!!", "description":"Host now!!!", "photoName":"airpnp.png"};
            var trip_1 = [];
            for (let i=numId-1; i>numId-4; i--) {
              if(prevData[hostings[i]]) {
                trip_1.push(prevData[hostings[i]]);
              } else {
                trip_1.push(noTrip);
              }
            };
            if (numId>3) {
              var trip_2 = [];
              for (let i=numId-4; i>numId-7; i--) {
                if(prevData[hostings[i]]) {
                  trip_2.push(prevData[hostings[i]]);
                } else {
                  trip_2.push(noTrip);
                }
              };
            }
            if (numId>6) {
              var trip_3 = [];
              for (let i=numId-7; i>numId-10; i--) {
                if(prevData[hostings[i]]) {
                  trip_3.push(prevData[hostings[i]]);
                } else {
                  trip_3.push(noTrip);
                }
              };
            }
            res.render('page6', {trips_1: trip_1, trips_2: trip_2, trips_3: trip_3});
          }
        });
      }
    });
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
        fs.readFile('database/trips.txt', 'utf8', function(err,data) {
          if(err) {
            res.status(500).send('something is wrong');
          } else {
            var prevFile = JSON.parse(data);
            var prevData = prevFile.tripSpecs;
            var numId = prevFile.currentId;
            var noTrip = {"title":"Host now!!!", "description":"Host now!!!", "photoName":"airpnp.png"};
            var trip_1 = [];
            for (let i=numId-1; i>numId-4; i--) {
              if(prevData[i]) {
                trip_1.push(prevData[i]);
              } else {
                trip_1.push(noTrip);
              }
            };
            if (numId>3) {
              var trip_2 = [];
              for (let i=numId-4; i>numId-7; i--) {
                if(prevData[i]) {
                  trip_2.push(prevData[i]);
                } else {
                  trip_2.push(noTrip);
                }
              };
            } else if (numId>6) {
              var trip_3 = [];
              for (let i=numId-7; i>numId-10; i--) {
                if(prevData[i]) {
                  trip_3.push(prevData[i]);
                } else {
                  trip_3.push(noTrip);
                }
              };
            }
            res.render('page1', {signin: true, trips_1: trip_1, trips_2: trip_2, trips_3: trip_3});
          }
        });
      } else {
        res.render('page8', {invalid: true});
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
  req.session.item = {};
  var item = req.session.item;
  item.kind = req.body.kind;
  item.type = req.body.type;
  item.room = req.body.room;
  res.render('page9');
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
});
router.post('/hosting3', upload.single('photo'), function(req, res, next) {
  var tripSpecs = {};
  var hostId = 0;
  tripSpecs.kind = req.session.item.kind;
  tripSpecs.type = req.session.item.type;
  tripSpecs.room = req.session.item.room;
  tripSpecs.title = req.session.item.title;
  tripSpecs.description = req.session.item.description;
  if (req.file) {
    tripSpecs.photoName = req.file.filename;
    fs.readFile('database/trips.txt', 'utf8', function(err, data) {
      if(err) {
        res.status(500).send('something is wrong');
      } else {
        var prevFile = JSON.parse(data);
        var prevData = prevFile.tripSpecs;
        tripSpecs.id = prevData.length;
        hostId = tripSpecs.id;
        prevData.push(tripSpecs);
        prevFile.currentId = prevData.length;
        fs.readFile('database/users.txt', 'utf8', function(err, data) {
          if(err) {
            res.status(500).send('something is wrong');
          } else {
            var userFile = JSON.parse(data);
            var userData = userFile.emailPwPairs;
            for(i=0; i<userFile.pairsNumber; i++) {
              if(req.session.userId === i) {
                userData[i].hostIds.push(hostId);
              }
            };
            var hostings = userData[req.session.userId].hostIds;
            var numId = hostings.length;
            var noTrip = {"title":"Host now!!!", "description":"Host now!!!", "photoName":"airpnp.png"};
            var trip_1 = [];
            for (let i=numId-1; i>numId-4; i--) {
              if(prevData[hostings[i]]) {
                trip_1.push(prevData[hostings[i]]);
              } else {
                trip_1.push(noTrip);
              }
            };
            if (numId>3) {
              var trip_2 = [];
              for (let i=numId-4; i>numId-7; i--) {
                if(prevData[hostings[i]]) {
                  trip_2.push(prevData[hostings[i]]);
                } else {
                  trip_2.push(noTrip);
                }
              };
            }
            if (numId>6) {
              var trip_3 = [];
              for (let i=numId-7; i>numId-10; i--) {
                if(prevData[hostings[i]]) {
                  trip_3.push(prevData[hostings[i]]);
                } else {
                  trip_3.push(noTrip);
                }
              };
            }

            fs.writeFile('database/users.txt', JSON.stringify(userFile), function(err) {
              if(err) {
                res.status(500).send('something is wrong');
              } else {
                res.render('page6', {fillin: false, trips_1: trip_1, trips_2: trip_2, trips_3: trip_3});
              }
            });
          }
        });
        fs.writeFile('database/trips.txt', JSON.stringify(prevFile), function(err) {
          if(err) {
            res.status(500).send('something is wrong');
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
