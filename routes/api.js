var doctape = require('../dtapi.js').api,
    datastore = require('../server/database/DataStore.js');

Enumerable = require('linq');


var api = module.export = exports;

api.db = {};
api.get = {};
api.sendEnqueue = function(){};

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
        api.get(data).oauth_exchange(data);
        api.get(data).tape(function (errorOut, tapes) {
            res.send(errorOut || tapes);
        });
    })

};
api.files = function (req, res) {
    api.getItemsCollection(function (err, data) {

        data.find({'user': req.param('session'), 'type': 'audio'}).toArray(function (err, mongoData) {
            var result = Enumerable.From(mongoData).Select(function (value, index) {
                value.link = "/api/get/" + value.user + "/" + value.id;
                value.image = "/api/image/" + value.user + "/" + value.id;
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
        api.get(data).oauth_exchange(data);
        api.get(data).downloadStream(id, 'original', res);
    })
};
api.getImage = function (req, res) {
    var id = req.param('id');
    console.log("request: " + req.param('id') + " - " + req.param('session'));
    datastore.getToken(req.param('session'), function (err, data) {
        console.log(api.get(data));
        console.log(data);
        api.get(data).oauth_exchange(data);
        api.get(data).downloadStream(id, 'thumb_320.jpg', res);
    })
};

api.getImageSmall = function (req, res) {
    var id = req.param('id');
    console.log("request: " + req.param('id') + " - " + req.param('session'));
    datastore.getToken(req.param('session'), function (err, data) {
        api.get(data).oauth_exchange(data);
        api.get(data).downloadStream(id, 'thumb_120.jpg', res);
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
        playlistCollection.find({'session': session}).sort({'ts':1}).toArray(function(err,data){
            cb (err,data);
        })
    });

}

api.playlist.removeFirst = function (session) {
    api.getPlaylistCollection(function (playlistErr, playlistCollection) {
        playlistCollection.find({'session': session}).sort({'ts':1}).limit(1).toArray(function(err,data){
            if (data[0]){
                playlistCollection.remove({'_id': data[0]._id});
            }
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
                    'session': session,
                    'ts': Date.now()
                }

                playlistCollection.insert(playlistItem);
                api.sendEnqueue(playlistItem);

            });
        });
    });
}