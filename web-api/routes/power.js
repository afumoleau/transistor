var influx = require('influx');

var db = new influx.InfluxDB({host: 'localhost', database:'transistor'});

function getPower(from, to, samples) {
	return db.query(`SELECT MEAN(pApp) AS pApp
		FROM power WHERE time >= '${from.toISOString()}'
		AND time <= '${to.toISOString()}'
		GROUP BY time(${Math.round((to-from)/samples)}ms)`);
};

module.exports = {
	init(app) {
		app.get('/power', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			var from = new Date(parseInt(req.query.from));
			var to = new Date(parseInt(req.query.to));
			var samples = parseInt(req.query.samples) || (100);
			getPower(from, to, samples).then(res.json.bind(res));
		});
	}
}

// var _ = require("lodash");
// var influx = require('influx');

// var db = new influx.InfluxDB({host: '192.168.0.16', database:'transistor'});

// function updatePower(req, res) {
// 	var data = JSON.parse(req.body);
	
// 	var fields = {
// 		pApp: data.pApp,
// 		indexHC: data.indexHC,
// 		indexHP: data.indexHP,
// 		iInst: data.iInst,
// 		// iSousc: data.iSousc,
// 		// iMax: data.iMax,
// 		// motEtat: data.motEtat,
// 		// opTarif: data.opTarif,
// 		// perTarif: data.perTarif,
// 		// typeHoraireHPHC: data.typeHoraireHPHC
// 	};
// 	// Commented fields are not yet available

// 	db.writePoints([{measurement:'power', fields:fields}]).catch(function(err) { console.log(err); });
// 	return res.send('ok');
// }

// function getPower(interval, samples) {
// 	var to = new Date();
// 	var from = new Date(to - interval*samples);

// 	return db.query(`SELECT MEAN(iInst) AS iInst, MEAN(indexHC) AS indexHC, MEAN(indexHP) AS indexHP, MEAN(pApp) AS pApp
// 		FROM power WHERE time >= '${from.toISOString()}'
// 		AND time <= '${to.toISOString()}'
// 		GROUP BY time(${interval}ms)`);
// };

// module.exports = {
// 	init(app) {
// 		app.post('/power', updatePower);
// 		app.get('/power', function(req, res) {
// 			res.setHeader('Content-Type', 'application/json');
// 			var interval = parseInt(req.query.interval) || (60*60*1000);
// 			var samples = parseInt(req.query.samples) || (24);
// 			getPower(interval, samples).then(res.json.bind(res));
// 		})
// 	}
// }