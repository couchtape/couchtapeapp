var request = require('request');

var tape = module.exports = exports;

tape.getStream = function (req, res, next) {
    tape.streamFromCloud("audio.mp3",req,res);
}
tape.getImage = function (req, res, next) {
    tape.streamFromCloud("thumb_320.jpg",req,res);
}
tape.getImageSmall = function (req, res, next) {
    tape.streamFromCloud("thumb_120.jpg",req,res);
}

tape.streamFromCloud = function (type, req, res) {
    var itemhash = req.param('id');
    if (!req.storage.itemhash[itemhash]) {
        res.send("HASH NOT FOUND!");
        return
    }

    var username = req.storage.itemhash[itemhash].username,
        itemid = req.storage.itemhash[itemhash].id,
        options = req.storage.userData[username].apiAdapter.core.options.resourcePt,
        endpoint = "/doc/"+itemid+"/"+type,
        token = req.storage.userData[username].apiAdapter.core._token.access;

    request({
            method: 'GET',
            host: options.host,
            port: options.port,
            path: options.base + endpoint,
            uri: 'https://' + options.host + options.base + endpoint,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    ).pipe(res);
}