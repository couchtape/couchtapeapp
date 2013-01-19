var doctape = require('../dtapi').api,
    datastore = require('../server/database/DataStore');


var login = module.export = exports;

login.db = {};

login.index = function(req,res) {
    res.redirect('https://api.doctape.com' + doctape.authUrl('http://localhost:3000/login/response'));
}

login.oauth = function(req,res) {
    var code = req.param('code');
    doctape.oauth_exchange(code);

    doctape.account(function (err, data) {
        var store = {
            "username": data.username,
            "oauth": code
        }

        login.db.collection('sessions', function(err, col){
            col.remove({'username': data.username});
            col.insert(store);

            res.redirect('/tv.html#session='+data.username);
            datastore.db = login.db;
            datastore.init(data.username);
        })

    })
}
