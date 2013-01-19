
/*
 * GET home page.
 */

exports.index = function(req, res){

    res.render('index_noAuth', { title: 'Express', body: 'Foo' });
};