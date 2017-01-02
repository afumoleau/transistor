var influx = require('influx');

var db = new influx.InfluxDB({host: 'localhost', database:'transistor'});

function updatePower(req, res) { 
	var data = JSON.parse(req.body); 
	 
	var fields = { 
		pApp: data.pApp, 
		indexHC: data.indexHC, 
		indexHP: data.indexHP, 
		iInst: data.iInst, 
		// iSousc: data.iSousc, 
		// iMax: data.iMax, 
		// motEtat: data.motEtat, 
		// opTarif: data.opTarif, 
		// perTarif: data.perTarif, 
		// typeHoraireHPHC: data.typeHoraireHPHC 
	}; 
	// Commented fields are not available yet
 
	db.writePoints([{measurement:'power', fields:fields}]).catch(function(err) { console.log(err); }); 
	return res.send('ok'); 
} 

function getPower(from, to, samples) {
	return db.query(`SELECT MEAN(pApp) AS pApp
		FROM power WHERE time >= '${from.toISOString()}'
		AND time <= '${to.toISOString()}'
		GROUP BY time(${Math.round((to-from)/samples)}ms)`);
};

function getConsumption(from, to) {
	return db.query(`SELECT LAST(indexHP)-FIRST(indexHP) as indexHP, LAST(indexHC)-FIRST(indexHC) as indexHC
		FROM power WHERE time >= '${from.toISOString()}'
		AND time <= '${to.toISOString()}'`);
}

module.exports = {
	init(app) {
		app.get('/power', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			var from = new Date(parseInt(req.query.from));
			var to = new Date(parseInt(req.query.to));
			var samples = parseInt(req.query.samples) || (100);
			getPower(from, to, samples).then(res.json.bind(res));
		});
		app.get('/consumption', function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			var from = new Date(parseInt(req.query.from));
			var to = new Date(parseInt(req.query.to));
			getConsumption(from, to).then(res.json.bind(res));
		});
		app.post('/power', updatePower);
	}
}