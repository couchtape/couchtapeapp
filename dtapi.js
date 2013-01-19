var doctapecore = require('./server/api/doctape_node');

var doctape = module.export = exports;

doctape.api = new doctapecore;

doctape.api.setCredentials('9b56b6e5-ba5b-4f4d-8fea-48051696d176', '718a18af-a662-45b0-a84f-40e750d79b9e');
doctape.api.setScope(['docs', 'account']);
