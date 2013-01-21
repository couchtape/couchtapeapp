
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index_noAuth', { title: 'Express', body: 'Foo' });
};
exports.start = function (req, res) {
    res.render('start', { title: 'Express', body: 'Foo' });
};