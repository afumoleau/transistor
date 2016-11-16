var express = require('express');
var influx = require('influx');
var db = new influx.InfluxDB({hosts: [{host: 'localhost', database:'transistor'}]});

var app = express();

app.get('/api/internet-status', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    db.query(`select * from internet order by time desc limit 20`, {database:'transistor'})
        .then(rows => { res.send(JSON.stringify(rows)); });
});

app.use(express.static('dist'));
app.listen(80);