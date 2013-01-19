/**
 * Module dependencies.
 */

var express = require('express'),
    fs = require('fs'),
    doctapecore = require('./api/doctape_node'),
    request = require('request'),
    DatabaseAdapter = require('./database/DatabaseAdapter'),
    MongoClient = require('mongodb');


var app = module.exports = express();
var doctape = new doctapecore;
var code;

doctape.setCredentials('9b56b6e5-ba5b-4f4d-8fea-48051696d176', '718a18af-a662-45b0-a84f-40e750d79b9e');
doctape.setScope(['docs', 'account']);

// Configuration

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/../client'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// functions

app.get('/login', function (req, res) {
    res.redirect('https://api.doctape.com' + doctape.authUrl('http://localhost:3000/oauth'));
})


app.get('/oauth', function (req, res) {
    code = req.param('code');
    doctape.oauth_exchange(code);
    doctape.account(function (err, data) {
        res.redirect('/frontend.html');
    })
//    var id = "786c7aa3-105a-4302-b68e-77c69981c885";
//    doctape.downloadStream(id,'original',res);
})

// api

app.get('/api/files', function (req, res) {
    if (!code) {
        res.redirect('/login');
        return;
    }
    doctape.oauth_exchange(code);
    doctape.list(function (err, data) {
        res.send(data || err);
    })
})
app.get('/api/account', function (req, res) {
    if (!code) {
        res.redirect('/login');
        return;
    }
    doctape.oauth_exchange(code);
    doctape.account(function (err, data) {
        res.send(data || err);
    })
})

// Start server

MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
    if(!err) {
        console.log("Connected to Database");

        DatabaseAdapter.setConnection(db);

        app.listen(3000, function () {
            console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
        });
    }
});

