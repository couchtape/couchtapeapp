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

var app = express();

var server = http.createServer(app);

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

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/api/account/:session', api.account);
app.get('/api/tapes/:session', api.tapes);
app.get('/api/files/:session', api.files);
app.get('/api/artists/:session', api.artists);
app.get('/api/artists/files/:session/:artist', api.artists);
app.get('/api/get/:session/:id', api.get);
app.get('/api/image/:session/:id', api.getImage);
app.get('/api/image/:session/:id/small', api.getImageSmall);
app.get('/api/enqueue/:session/:id', api.enqueue);
app.get('/api/playlist/:session', api.getPlaylist);
app.get('/login', login.index);
app.get('/login/response', login.oauth);
app.get('/client', client.index);
app.get('/client/mobile', client.mobile);
app.get('/client/station', client.station);
app.get('/tv/:session', function (req, res) {
    var address = "/" + req.param('session');

    if (!registered[address]) {
        registered[address] = true;
        console.log("New Adress: "+address);
        io.of(address).on('connection', function (socket) {

            socket.on('nextsong', function (data) {
                api.playlist.removeFirst(data);
                console.log("Next Song EVENT");
                var ioObject = {};
                ioObject['everyone'] = "in";
                ioObject[address] = "will get";
                socket.broadcast.emit('next', ioObject);
            });
            socket.on('disconnect', function () {

            })

            api.sendEnqueue = function (data) {
                console.log("Event Enqueue: " + data);
                var ioObject = {};
                ioObject['everyone'] = "in";
                ioObject[address] = data;
                socket.broadcast.emit('enqueue', ioObject);
            }

        });
    }

    res.render("../build/tv", {'session': req.param('session'), 'host': req.host + ":" + app.get('port') });
})
app.get('/:session', function (req, res) {
    res.render("../build/mobile", {'session': req.param('session'), 'host': req.host + ":" + app.get('port') });
})

var registered = {};
var store = {};

var data = [];

store.set = function (key, value) {
    data[key] = value;
}

store.get = function (key) {
    return data[key];
}


MongoClient.connect("mongodb://localhost:27017/couchtape", function (err, db) {
    if (!err) {

        db.collection('playlist', function (colError, collection) {
            collection.ensureIndex({'ts': 1});
        })

        console.log("Connected to Database");

        login.db = db;
        login.set = store.set;
        login.get = store.get;

        api.db = db;
        api.get = store.get;


    }
});

