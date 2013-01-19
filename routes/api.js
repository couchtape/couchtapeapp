var doctape = require('../dtapi.js').api,
    datastore = require('../server/database/DataStore.js');

var api = module.export = exports;

api.db = {};

api.getItemsCollection = function(session,cb) {

    api.db.collection(session, function(err,data){

        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }

    });

}

api.account = function(){};
api.tapes = function(){};
api.files = function(req, res){
    api.db.collection('items')
};

api.get = function(req, res){
    var id = req.param('id');
    console.log ("request: " + req.param('id') + " - "+ req.param('session'));
    datastore.getToken(req.param('session'), function(err, data){
        doctape.oauth_exchange(data);
        doctape.downloadStream(id,'original', res);
    })
};


api.artists = function(){};