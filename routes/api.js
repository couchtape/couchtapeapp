var doctape = require('../dtapi.js').api,
    datastore = require('../server/database/DataStore.js');
Enumerable = require('linq');


var api = module.export = exports;

api.db = {};

api.getItemsCollection = function (cb) {

    api.db.collection('items', function (err, data) {

        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }

    });

}

api.account = function () {
};

api.tapes = function (req, res) {
    datastore.getToken(req.param('session'), function (err, data) {
        doctape.oauth_exchange(data);
        doctape.tape(function (errorOut, tapes) {
            res.send(errorOut || tapes);
        });
    })

};
api.files = function (req, res) {
    api.getItemsCollection(function (err, data) {

        data.find({'user': req.param("session"), 'type': 'audio'}).toArray(function (err, mongoData) {
            var result = Enumerable.From(mongoData).Select(function (value, index) {
                value.link = "/api/get/" + req.param("session") + "/" + value.id;
                value.image = "/api/image/" + req.param("session") + "/" + value.id;
                return value;
            }).ToArray();
            res.send(result);
        })

    })
};

api.get = function (req, res) {
    var id = req.param('id');
    console.log("request: " + req.param('id') + " - " + req.param('session'));
    datastore.getToken(req.param('session'), function (err, data) {
        doctape.oauth_exchange(data);
        doctape.downloadStream(id, 'original', res);
    })
};
api.getImage = function (req, res) {
    var id = req.param('id');
    console.log("request: " + req.param('id') + " - " + req.param('session'));
    datastore.getToken(req.param('session'), function (err, data) {
        doctape.oauth_exchange(data);
        doctape.downloadStream(id, 'thumb_320.jpg', res);
    })
};


api.artists = function () {
};