process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var fetch = require('node-fetch');
var _ = require('lodash');

var config = {
	username:'admin',
	username:'password',
	routerWebInterface: 'https://192.168.0.1'
}

function login() {
	var requestOptions = {
		method: 'POST',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		body: `loginUsername=${config.username}&loginPassword=${config.password}&envoyer=OK`
	};
	return fetch(`${routerWebInterface}/goform/login`, requestOptions);
}

function getDevicesPage() {
	return fetch(`${routerWebInterface}/reseau-pb6-moniteur.html`)
	.then(function(response) { return response.text(); });
}

function parseDevices(html) {
	var devices = [];
	var deviceId = 0;

	var ethRegex = /<div id=apDivetherportmac([0-9])-([0-9])>(.*?)<br>(.*?)<br>(.*?)<br>(.*?)<\/div>/g;
	while (match = ethRegex.exec(html)) {
		devices.push({ id:deviceId++, name: match[3], mac: match[4], ip: match[5], connexion:'ethernet'});
	}

	var wifiRegex = /<div id=apDivwifimac([0-9])-([0-9])>(.*?)<br>(.*?)<br>(.*?)<br>(.*?)<\/div>/g;
	while (match = wifiRegex.exec(html)) {
		devices.push({id:deviceId++, name: match[3], mac: match[4], ip: match[5], connexion:'wifi'});
	}

	return devices;
}

function triggerWPS() {	
	var requestOptions = {
		method: 'POST',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		body: 'RgWiFiWpsWiFiEnable=3&RgWiFiWpsWiFiEncType=44&RgWiFiWpsOperType=3&RgWiFiWpsEnable=1&RgWiFiWpsMethod=1&RgWiFiWpsStaPin='
	};
	return fetch(`${routerWebInterface}/goform/WebUiRgWiFiWpsConfig`, requestOptions);
}

module.exports = {
	init(app) {
		app.get('/devices', function(req, res) {
			login().then(getDevicesPage).then(parseDevices).then(res.json.bind(res));
		});
		app.get('/wps', function(req, res) {
			login().then(triggerWPS).then(res.json.bind(res, true));
		});
	}
}
