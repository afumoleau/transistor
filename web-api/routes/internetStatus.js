var influx = require('influx');

var db = new influx.InfluxDB({host: 'localhost', database:'transistor'});

function getInternetStatus(from, to, samples) {
	return db.query(`SELECT MEAN(value) AS value
		FROM internet WHERE time >= '${from.toISOString()}'
		AND time <= '${to.toISOString()}'
		GROUP BY time(${Math.round((to-from)/samples)}ms)`);
};

module.exports = {
	init(app) {
		app.get('/internet-status', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			var from = new Date(parseInt(req.query.from));
			var to = new Date(parseInt(req.query.to));
			var samples = parseInt(req.query.samples) || (100);
			getInternetStatus(from, to, samples).then(res.json.bind(res));
		});
	}
}