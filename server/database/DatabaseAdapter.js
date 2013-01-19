/*
 Database Connection Class
 */

var MongoClient = require('mongodb').mongoClient;

var dbconnection = null;

var db = module.exports = exports;

db.setConnection = function (connection) {
    dbconnection = connection;
};

db.findBySession = function (sessionId, cb) {
    dbconnection.collection()
}
