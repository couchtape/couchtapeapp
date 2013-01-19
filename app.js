/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    doctape = require('./dtapi').api,
    api = require('./routes/api'),
    login = require('./routes/login'),
    client = require('./routes/client'),
    request = require('request'),
    MongoClient = require('mongodb');
;

var app = express();
var code;

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view', __dirname + '/views');
    app.engine('html', require('uinexpress').__express);
    app.set('view engine', 'html');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('couchtape-xxda561sJJ'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'build')));
});


app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/api/account', api.account);
app.get('/api/tapes', api.tapes);
app.get('/api/files', api.files);
app.get('/api/artists', api.artists);
app.get('/api/get/:session/:id', api.get);
app.get('/login',login.index);
app.get('/login/response',login.oauth);
app.get('/client',client.index);
app.get('/client/mobile',client.mobile);
app.get('/client/station',client.station);


MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
    if(!err) {
        console.log("Connected to Database");

        login.db = db;
        api.db = db;

        http.createServer(app).listen(app.get('port'), function () {
            console.log("Express server listening on port " + app.get('port'));
        });
    }
});



