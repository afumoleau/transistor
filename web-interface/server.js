var express = require('express');
var influx = require('influx');

var db = new influx.InfluxDB({host: 'localhost', database:'transistor'});

var app = express();

app.get('/api/internet-status', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    
    var interval = parseInt(req.query.interval) || (60*60*1000);
    var samples = parseInt(req.query.samples) || (24);
    var to = new Date();
    var from = new Date(to - interval*samples);

    db.query(`SELECT MEAN(value) AS value
              FROM internet WHERE time >= '${from.toISOString()}'
              AND time <= '${to.toISOString()}'
              GROUP BY time(${interval}ms)`)
        .then(rows => { res.send(JSON.stringify(rows)); });
});

app.use(express.static('dist'));
app.listen(80);