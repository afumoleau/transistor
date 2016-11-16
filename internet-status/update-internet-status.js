var influx = require('influx');
var fetch = require('node-fetch');
var timers = require('timers');

var db = new influx.InfluxDB({host: 'localhost', database:'transistor'});

timers.setInterval(fetchURL, 30000);
fetchURL();

function fetchURL() {
    fetch('https://www.google.com')
        .then(getStatusFromResponse)
        .then(registerStatus)
        .catch(function(err) {
            registerStatus(0);
        });
}

function getStatusFromResponse(res) {
    return res.status === 200 ? 1 : 0;
}

function registerStatus(value) {
    db.writePoints([{measurement:'internet', fields:{ value: value }}])
        .catch(function(err) { console.log(err); });
}