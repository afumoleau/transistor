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
	    fetch("http://localhost/api/internet-status")
	       .then(function(res) {
	            return res.json()
	        }).then(function(data) {
	            console.log('parsed json', data)
	            var myChart = new Chart(document.getElementById("internetChart"), {
	            type: 'line',
	            data: {
	                labels: _.map(data, 'time'),
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
	        });
	    /*
	    */
	};

/***/ }
/******/ ]);