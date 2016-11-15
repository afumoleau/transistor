var influx = require('influx');
var fetch = require('node-fetch');
var timers = require('timers');

var client = influx({hosts: [{host: '192.168.0.16', database:'transistor'}]});

timers.setInterval(fetchURL, 1000);

function fetchURL() {
    fetch('http://google.com')
        .then(function (res) {
            if(res.status === 200) {
                registerSuccess();
            } else {
                registerFailure();
            }
        })
        .catch(function(err) {
            registerFailure();
        });
}

function registerSuccess() {
    client.writePoint('internet', 1.0, [], {db:'transistor'}, function (err) {
        console.log(err);
    });
}

function registerFailure() {
    client.writePoint('internet', 0.0, [], {db:'transistor'}, function (err) {
        console.log(err);
    });
}