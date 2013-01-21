var session = module.exports = exports;

session.sendEnqueue = {};

session.storage = {};

session.start = function (req, res, next) {
    session.storage = req.storage.partys;
    var sessionName = req.param('name');
    var tag = req.param('tag') || null;
    var party = {};
    var userdata = req.session.userAccount;
    var files = {};

    var documents = req.storage.userData[userdata.username].documents;

    for (var fileId in documents) {
        if (documents[fileId].media_type == "audio") {
            var file = {};
            file.id = documents[fileId].hash;
            file.hash = documents[fileId].hash;
            file.meta = documents[fileId].meta;
            file.name = documents[fileId].name;
            file.link = "/api/get/" + file.hash;
            file.image = "/api/image/" + file.hash;
            files[file.id]=file;
        }
    }

    req.storage.partys[sessionName] = {};
    req.storage.partys[sessionName].files = files;
    req.storage.partys[sessionName].playlist = [];
    res.redirect("/tv/" + sessionName);
}

session.files = function (req, res, next) {
    var sessionName = req.param('session');
    res.send(req.storage.partys[sessionName].files);
}

session.playlist = function (req, res, next) {
    var sessionName = req.param('session');

    res.send(req.storage.partys[sessionName].playlist);

}

session.enqueue = function (req, res, next) {
    var id = req.param('id'),
        sessionName = req.param('session');

    var data = req.storage.partys[sessionName].files[id];

    var playlistItem = {
        'img': "/api/image/"+data.id,
        'file': "/api/get/"+data.id,
        'title': data.meta.title || data.name,
        'artist': data.meta.artist || 'Unknown',
        'class': '',
        'id': id,
        'session': sessionName,
        'ts': Date.now()
    };
    req.storage.partys[sessionName].playlist.push(playlistItem);
    res.send({'enqueue': 'ok'});
    session.sendEnqueue[sessionName](playlistItem);
}

session.removeFirst = function (data, sessionName) {
    session.storage[sessionName].playlist.shift();
}

/*
 value.link = "/api/get/" + value.user + "/" + value.id;
 value.image = "/api/image/" + value.user + "/" + value.id;
 */