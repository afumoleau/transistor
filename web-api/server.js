var express = require('express');
var influx = require('influx');
var hueAPI = require("node-hue-api");
var _ = require("lodash");

var db = new influx.InfluxDB({host: 'localhost', database:'transistor'});
var hue = null;

init().then(setupRoutes).then(startServer);

function init() {
    return hueAPI.nupnpSearch().then(_.first).then(function(bridge) {
        hue = new hueAPI.HueApi(bridge.ipaddress, "GFS6U5Fp8epfexa9Sb2Jc5mT4dXU2sGWCj5zmUwo");
        return hue.config();
    });
}

function setupRoutes() {
    var app = express();
    
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get('/lights', function(req, res) {
        return hue.lights().then(res.json.bind(res)).fail(display).done();
    });

    app.get('/lights/:id/turnoff', function(req, res) {
        var state = hueAPI.lightState.create();
        return hue.setLightState(req.params.id, state.off()).then(res.json.bind(res)).fail(display).done();
    });

    app.get('/lights/:id/turnon', function(req, res) {
        var state = hueAPI.lightState.create();
        return hue.setLightState(req.params.id, state.on()).then(res.json.bind(res)).fail(display).done();
    });

    app.get('/internet-status', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        
        var interval = parseInt(req.query.interval) || (60*60*1000);
        var samples = parseInt(req.query.samples) || (24);
        var to = new Date();
        var from = new Date(to - interval*samples);

        db.query(`SELECT MEAN(value) AS value
                FROM internet WHERE time >= '${from.toISOString()}'
                AND time <= '${to.toISOString()}'
                GROUP BY time(${interval}ms)`)
            .then(res.json.bind(res));
    });

    return app;
}

function startServer(app) {
    app.listen(80);
}

function display(error) {
    console.log(error);
}