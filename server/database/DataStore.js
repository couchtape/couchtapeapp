var doctape = require('../../dtapi.js').api;

var ds = module.exports = exports;

ds.db = {};

ds.getToken = function (sessionname, cb) {
    ds.db.collection('session', function (err, collection) {

        collection.find({'session': sessionname}, function (err, data) {
            if (err) {
                cb(err);
            } else {
                cb(null, data.oauth);
            }

        })
    });
}

ds.init = function (sessionname) {
    ds.getToken(sessionname, function (err, data) {
        doctape.oauth_exchange(data);
        doctape.list(function (err, items) {
            if (items) {
                ds.db.collection('items', function (err, collection) {
                    for (var key in items) {
                        ds.tryStore(collection, sessionname, items[key]);
                    }
                })

            }
        })

    })
}

ds.tryStore = function (collection, session, item) {
    collection.count({id: item.id}, function (err, idCount) {
        if (idCount !== 1) {
            console.log("New Item: " + item.name + " {" + item.id + "}")
            var store = {
                user: session,
                id: item.id,
                tags: item.tags,
                type: item.media_type,
                name: item.name,
                meta: item.meta
            }
            collection.insert(store);
        }
    })
}