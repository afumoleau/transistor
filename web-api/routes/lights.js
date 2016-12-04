var _ = require("lodash");
var hueAPI = require("node-hue-api");

var hue = null;

function getLights(req, res) {
	return hue.lights()
	.then(function(data) { return res.json(data.lights); })
	.fail(display)
	.done();
}

function updateLight(req, res) {
	data = JSON.parse(req.body);

	var state = hueAPI.lightState.create();
	if(data.on != undefined) state.on(data.on);
	if(data.bri != undefined) state.bri(data.bri);
	if(data.hue != undefined) state.hue(data.hue);
	if(data.sat != undefined) state.sat(data.sat);
	if(data.ct != undefined) state.ct(data.ct);
	if(data.effect != undefined) state.effect(data.effect);
	if(data.xy != undefined) state.xy(data.xy.x, data.xy.y);

	return hue.setLightState(req.params.id, state).then(res.json.bind(res)).fail(display).done();
}

function display(data) {
	console.log(data);
}

module.exports = {
	init(app) {
		hueAPI.nupnpSearch()
		.then(_.first)
		.then(function(bridge) {
			hue = new hueAPI.HueApi(bridge.ipaddress, 'GFS6U5Fp8epfexa9Sb2Jc5mT4dXU2sGWCj5zmUwo');
			return hue.config()
		})
		.then(function() {
			app.get('/lights', getLights);
			app.post('/lights/:id', updateLight);
		});
	}
}