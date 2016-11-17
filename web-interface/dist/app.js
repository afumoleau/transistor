/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	window.onload = function() {
	    function getInternetStatusData(interval, samples) {
	        return fetch(`http://localhost/api/internet-status?interval=${interval}&samples=${samples}`)
	            .then(function(res) {
	                return res.json()
	            });
	    }

	    function turnOffTVLight() {
	        return fetch(`http://localhost/api/lights`);
	    }

	    function convertTime(obj) {
	        var date = new Date(obj.time);
	        return date.toLocaleDateString()+' '+date.toLocaleTimeString();
	        
	    }

	    function displayChart(data) {
	        var myChart = new Chart(document.getElementById("internetChart"), {
	            type: 'line',
	            data: {
	                labels: _.map(data, convertTime),
	                datasets: [{
	                    label: 'Internet Status',
	                    data: _.map(data, 'value'),
	                }]
	            },
	            options: {
	                scales: {
	                    yAxes: [{
	                        ticks: {
	                            beginAtZero:true
	                        }
	                    }]
	                }
	            }
	        });
	    }

	    document.querySelector("#b1").addEventListener('click', function() {
	        getInternetStatusData(3600000, 24)
	            .then(displayChart);
	    });

	    document.querySelector("#b2").addEventListener('click', function() {
	        getInternetStatusData(60000, 60)
	            .then(displayChart);
	    });

	    document.querySelector("#b3").addEventListener('click', function() {
	        turnOffTVLight();
	    });
	    
	    getInternetStatusData(3600000, 24)
	        .then(displayChart);
	};

/***/ }
/******/ ]);