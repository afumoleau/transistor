var influx = require('influx');

var db = new influx.InfluxDB({host: 'localhost', database:'transistor'});

function getInternetStatus(interval, samples) {
	var to = new Date();
	var from = new Date(to - interval*samples);

	return db.query(`SELECT MEAN(value) AS value
		FROM internet WHERE time >= '${from.toISOString()}'
		AND time <= '${to.toISOString()}'
		GROUP BY time(${interval}ms)`);
};

module.exports = {
	init(app) {
		app.get('/internet-status', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			var interval = parseInt(req.query.interval) || (60*60*1000);
			var samples = parseInt(req.query.samples) || (24);
			getInternetStatus(interval, samples).then(res.json.bind(res));
		});
	}
}