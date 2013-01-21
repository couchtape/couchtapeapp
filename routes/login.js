
var doctape = require('../dtapi'),
    datastore = require('../server/database/DataStore');

var login = module.export = exports;

login.db = {};
login.get = {};
login.set = {};

login.index = function (req, res) {
    res.redirect('https://api.doctape.com' + doctape.api.authUrl('http://localhost:3000/login/response'));
};

login.oauth = function (req, res) {
    var code = req.param('code');

    var auth = doctape.getInstance();

    auth.oauth_exchange(code);
    login.set(code, auth);

    auth.account(function (err, data) {
        var store = {
            "username": data.username,
            "oauth": code
        };
        login.db.collection('playlist', function (err, collection) {
            collection.remove({'session': data.username}, function () {
                login.db.collection('sessions', function (err, col) {
                    col.remove({'username': data.username}, function () {
                        col.insert(store, function () {
                            res.redirect('/tv/' + data.username);
                            datastore.db = login.db;
                            datastore.get = login.get;
                            datastore.init(data.username, code);
                        });
                    });
                });
            });
        });
    });
};
