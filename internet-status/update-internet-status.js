var influx = require('influx');
var fetch = require('node-fetch');
var timers = require('timers');
var _ = require('lodash');

var config = {
	dbHost: 'localhost',
	dbName: 'transistor',
	url: 'https://www.google.com',
	delay: 30000,
	measurement: 'internet'
}

var db = new influx.InfluxDB({host: config.dbHost, database:config.dbName});

init(db).then(function() {
	timers.setInterval(fetchURL, config.delay);
	fetchURL();
});

function init(db) {
	return db.getDatabaseNames().then(function(names) {
		if(!_.includes(names, config.dbName)) {
			return db.createDatabase(config.dbName);
		}
	});
}

function fetchURL() {
	fetch(config.url)
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
	db.writePoints([{measurement:config.measurement, fields:{ value: value }}])
		.catch(function(err) { console.log(err); });
}