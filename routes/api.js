var doctape = require('../dtapi.js').api,
    datastore = require('../server/database/DataStore.js');

Enumerable = require('linq');


var api = module.export = exports;

api.db = {};

api.getItemsCollection = function (cb) {

    api.db.collection('items', function (err, data) {
        if (err) {
            console.log("Unable to get oAUTH2 Token from MongoDB");
            cb(err);
        } else {
            cb(null, data);
        }

    });

}
api.getPlaylistCollection = function (cb) {

    api.db.collection('playlist', function (err, data) {
        if (err) {
            console.log("Unable to get Playlistcollection from MongoDB");
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

api.getImageSmall = function (req, res) {
    var id = req.param('id');
    console.log("request: " + req.param('id') + " - " + req.param('session'));
    datastore.getToken(req.param('session'), function (err, data) {
        doctape.oauth_exchange(data);
        doctape.downloadStream(id, 'thumb_120.jpg', res);
    })
};

api.enqueue = function(req,res) {
    var session = req.param('session');
    var id = req.param('id');
    console.log("Playlist Enqueue: " + id + " to " + session);
    api.playlist.enqueue(session, id);
    res.send({'enqueue': 'ok'});
}

api.getPlaylist = function (req, res) {
    api.playlist.get(req.param('session'), function (err, data){
        res.send(data);
    })
}

api.artists = function () {
};

api.playlist = {};

api.playlist.get = function (session, cb) {
    api.getPlaylistCollection(function (playlistErr, playlistCollection) {
        playlistCollection.find({'session': session}).sort({'_id':1}).toArray(function(err,data){
            cb (err,data);
        })
    });

}

api.playlist.enqueue = function (session, id) {

    api.getItemsCollection(function (itemsErr, itemsCollection) {
        api.getPlaylistCollection(function (playlistErr, playlistCollection) {

            itemsCollection.findOne({'id': id}, function(err, data){
                if (err) {
                    return;
                }
                var playlistItem = {
                    'img': "/api/image/"+data.user+"/"+data.id,
                    'file': "/api/get/"+data.user+"/"+data.id,
                    'title': data.meta.title || data.name,
                    'artist': data.meta.artist || 'Unknown',
                    'class': '',
                    'id': id,
                    'session': session
                }

                playlistCollection.insert(playlistItem);

            });
        });
    });
}