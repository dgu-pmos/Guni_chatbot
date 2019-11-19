var express = require('express');
var router = express.Router();

const MongoClient = require("mongodb").MongoClient;
const {CONNECTION_URL} = require('../config/connect_url'); 
const DATABASE_NAME = "kunikun";
var database;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log(CONNECTION_URL);
});

router.post('/insert', function(req, res) {
  const tn = req.body.action.params.tname;
  const tt = req.body.action.params.ttheme;
  const tp = req.body.action.params.tpeople;
  const tm = req.body.action.params.tmoney;
  MongoClient.connect(CONNECTION_URL, {
          useNewUrlParser : true,
          useUnifiedTopology : true }, (error, client) => {
                  if( error ) {
                    throw error;
                  }
                  database = client.db(DATABASE_NAME);
                  var myobj = { tname: tn, ttheme: tt, tpeople: tp, tmoney: tm };
                  database.collection("kunikun1").insertOne(myobj, function(err, results) {
                          if (err) throw err;
                          const responseBody = {
                                  version: "2.0",
                                  template: {
                                          outputs: [{
                                                  simpleText: {
                                                          text: "data insert complete!"
                                                  }
                                          }]
                                  }
                          };
                          res.status(200).send(responseBody);
                  });
                  client.close();
          }
  );
});

router.post('/route', function(req, res) {
  const pp = req.body.action.params.tpeople;
  const mn = req.body.action.params.tmoney;
  const tm = req.body.action.params.ttheme;
  MongoClient.connect(CONNECTION_URL, {
          useNewUrlParser : true,
          useUnifiedTopology : true }, (error, client) => {
                  if( error ) {
                          throw error;
                  }
                  database = client.db(DATABASE_NAME);
                  database.collection("kunikun1").find({ tpeople: pp, tmoney: mn, ttheme: tm }).toArray( function( err, result ) {
                          if( err ) throw err;
                          const responseBody = {
                                  version: "2.0",
                                  template: {
                                          outputs: [{
                                                  basicCard: {
                                                          title: result[0].tname,
                                                          description: result[0].tdescription,
                                                          thumbnail: {
                                                                  imageUrl: result[0].timage
                                                          },
                                                          buttons: [
                                                          {
                                                                  action:  "webLink",
                                                                  label: "구경하기",
                                                                  webLinkUrl: result[0].tlink
                                                          }]
                                                  }
                                          }]
                                        }
                                      };
                                      res.status(200).send(responseBody);
                              });
                              client.close();
                      }
              );
      });

module.exports = router;
