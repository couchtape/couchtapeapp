var DoctapeCore = require('doctape'),
    sha1 = require('sha1'),
    oauth = module.exports = exports;

oauth.getApi = function () {
    var dt = new DoctapeCore({
        appType: 'server',
        appId: process.env.APPLICATION_ID,
        appSecret: process.env.APPLICATION_SECRET,
        callbackURL: process.env.APPLICATION_OAUTH_REDIRECT,
        scope: ['docs', 'account']
    });
    return dt;
}

oauth.keyExchange = function (req, res, callback) {
    var oauth_key = req.useOAuthKey || req.session.oauthKey,
        doctape = oauth.getApi();

    if (!oauth_key) {
        res.send("no valid oauth sessionkey");
        return
    }

    doctape.useCode(oauth_key, function () {
        req.doctapeApi = this;
        callback();
    });
}

oauth.login = function (req, res, callback) {
    var doctape = oauth.getApi();
    res.redirect(doctape.authURL);
}

oauth.getSession = function (req, res, callback) {
    req.session.oauthKey = req.param('code');
    callback();
}

oauth.getData = function (req, res, callback) {
    req.doctapeApi.getAccount(function (data){
        req.session.userAccount = data;
        req.storage.userData[data.username] = {};
        req.storage.userData[data.username].apiAdapter = req.doctapeApi;
        req.storage.userData[data.username].info = data;

        req.doctapeApi.getDocumentListWithMetadata(function (files){
            req.storage.userData[data.username].documents = files;
            for (var file in files) {
                var hash = sha1(file+data.username+req.storage.salt);
                req.storage.userData[data.username].documents[file].hash = hash;

                req.storage.itemhash[hash] = {
                    username: data.username,
                    id: file
                };
            }
            callback();
        })
    });
}

oauth.renderUserAccount  = function (req, res, callback) {
    res.send(req.session.userAccount);
}