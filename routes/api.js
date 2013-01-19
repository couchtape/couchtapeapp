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
api.file = function(req, res){
    api.db.collection('items')
};
api.artists = function(){};