var express = require('express');
var app = express();

app.listen(3000);

app.get('/', function (req, res) {
  res.send('Hello World! I´m working with CI now!');
});

console.log('Listening on port 3000');
