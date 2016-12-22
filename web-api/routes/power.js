var _ = require("lodash");
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
	// Commented fields are not yet available

	db.writePoints([{measurement:'power', fields:fields}]).catch(function(err) { console.log(err); });
	return res.send('ok');
}

module.exports = {
	init(app) {
		app.post('/power', updatePower);
	}
}