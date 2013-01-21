var client = module.export = exports;

client.mobile = function (req, res) {
    res.send("mobile");
};

client.station = function (req, res) {
    res.send("station");
};

client.file = function (req, res) {
    res.send("file");
};

client.index = function (req, res) {
    res.render("client_index", { session: req.param('session')});
};
