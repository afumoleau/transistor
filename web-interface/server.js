var express = require('express');
var influx = require('influx');
var db = new influx.InfluxDB({host: 'localhost', database:'transistor'});

var app = express();

app.get('/api/lights', function(req, res) {
    var hue = require("node-hue-api");
    var _ = require("lodash");

    var api = null;
    var state = hue.lightState.create();
    hue.nupnpSearch()
        .then(_.first)
        .then(connect)
        .then(listLights)
        .then(display)
        .then(turnOffLight)
        .then(function() {
            res.send('OK');
        })
        .fail(display)
        .done();

    function connect(bridge) {
        api = new hue.HueApi(bridge.ipaddress, "GFS6U5Fp8epfexa9Sb2Jc5mT4dXU2sGWCj5zmUwo");
        return api.config();
    }

    function listLights() {
        return api.lights()
    }

    function display(foo) {
        console.log(foo);
        return foo;
    }

    function turnOffLight() {
        return api.setLightState(4, state.off());
    }
});

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