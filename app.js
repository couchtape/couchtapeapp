/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    request = require('request'),
    sha1 = require('sha1'),
    tapeRequests = require('./src/tapeRequests'),
    session = require('./src/session'),
    oauth = require('./src/oauth');

var app = express(),
    server = http.createServer(app),
    code,
    registered = {};

app.datastore = {
    partys: {},
    userData: {},
    itemhash: {},
    counter: 0,
    salt: sha1(Math.random())
};

var hookstorage = function (req, res, next) {
    req.storage = app.datastore;
    req.storage.counter++;
    next()
}


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

var fail = function (req, res) {
    res.send("Not Implemented YET!");
}

app.get('/', routes.index);

app.get('/login', oauth.login);
app.get('/login/response', oauth.getSession, hookstorage, oauth.keyExchange, oauth.getData, routes.start);
app.get('/api/get/:id', hookstorage, tapeRequests.getStream);
app.get('/api/image/:id', hookstorage, tapeRequests.getImage);
app.get('/api/image/:id/small', hookstorage, tapeRequests.getImageSmall);
app.get('/api/files/:session', hookstorage, session.files);
app.get('/api/enqueue/:session/:id', hookstorage, session.enqueue);
app.get('/api/playlist/:session', hookstorage, session.playlist);
app.get('/session/start', hookstorage, session.start)

/// OLD API
app.get('/api/get/:session/:id', hookstorage, tapeRequests.getStream);
app.get('/api/image/:session/:id', hookstorage, tapeRequests.getImage);
app.get('/api/image/:session/:id/small', hookstorage, tapeRequests.getImageSmall);

app.get('/debug', hookstorage, function (req, res) {
    res.send(req.storage);
})


app.get('/tv/:session', function (req, res) {
    var address = "/" + req.param('session');
    var sessionId = req.param('session');

    if (!registered[address]) {
        registered[address] = true;
        console.log("New Adress: " + address);
        io.of(address).on('connection', function (socket) {

            socket.on('nextSong', function (data) {
                session.removeFirst(data, sessionId);
                console.log("Next Song EVENT");
                var ioObject = {};
                ioObject['everyone'] = "in";
                ioObject[address] = "will get";
                socket.broadcast.emit('next', ioObject);
            });

            session.sendEnqueue[sessionId] = function (data) {
                console.log("Event Enqueue: " + data);
                var ioObject = {};
                ioObject['everyone'] = "in";
                ioObject[address] = data;
                socket.broadcast.emit('enqueue', ioObject);
            };

        });
    }
    res.render("../build/tv", {'session': req.param('session'), 'host': req.host + ":" + app.get('port') });
});

app.get('/:session', function (req, res) {
    res.render("../build/mobile", {'session': req.param('session'), 'host': req.host + ":" + app.get('port') });
})
