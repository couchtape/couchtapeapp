var doctape = require('../../dtapi.js').api;

var ds = module.exports = exports;

ds.db = {};

ds.getToken = function(sessionname, cb) {
    db.find({'session': sessionname}, function(err,data) {
        if (err) {
            cb(err);
        } else {
            cb(null,data.oauth);
        }

    });
}

ds.init = function(sessionname) {
    ds.getToken(sessionname, function(err,data){

        doctape.oauth_exchange(data);

        doctape.list(function(err,data){
            if (data){

                data.forEach(function(each){

                    var item = {
                        id: each.id,

                    }

                })

            }
        })

    })
}