<template>
	<div id="power-manager" class="green lighten-5">
		<div class="container">
			
			<h1 class="green-text">POWER</h1>
			
			<div class="btn-group">
				<div class="btn white green-text" v-on:click="setUnit('year')">YEAR</div>
				<div class="btn white green-text" v-on:click="setUnit('month')">MONTH</div>
				<div class="btn white green-text" v-on:click="setUnit('week')">WEEK</div>
				<div class="btn white green-text" v-on:click="setUnit('day')">DAY</div>
				<div class="btn white green-text" v-on:click="setUnit('hour')">HOUR</div>
				<div class="btn white green-text" v-on:click="setUnit('minute')">MINUTE</div>
			</div>

			<div class="time">
				<div class="btn white green-text" v-on:click="addOffset(-1)">&lt;</div>
				<div class="title green-text">{{title}}</div>
				<div class="btn white green-text" v-on:click="addOffset(1)">&gt;</div>
			</div>

			<div class="chart">
				<canvas id="powerChart" count="2"></canvas>
				<chartjs-line
					target="powerChart"
					:option="chart.options"
					:fill="true"
					:data="chart.dataHP"
					:labels="chart.labels"
					:bind="true"
					:backgroundcolor="'rgba(255, 152, 0, 0.5)'"
					:bordercolor="'rgb(255, 152, 0)'">
				</chartjs-line>
				<chartjs-line
					target="powerChart"
					:option="chart.options"
					:fill="true"
					:data="chart.dataHC"
					:labels="chart.labels"
					:bind="true"
					:backgroundcolor="'rgba(76, 175, 80, 0.5)'"
					:bordercolor="'rgb(76, 175, 80)'">
				</chartjs-line>
			</div>
		</div>
	</div>
</template>

<script>
	import _ from 'lodash';
	import config from '../../config';
	import moment from 'moment';

	export default {
		name: 'power-manager',
		created: function () {
			this.setUnit('day');
		},
		data: function() {
			return {
				chart: {
					dataHC: [],
					dataHP: [],
					labels: [],
					options: {
						responsive: true,
						legend: { display: false },
						scales: {
							yAxes: [{display: true, ticks: {beginAtZero: true}}],
							xAxes: [{display: true, ticks: {autoSkipPadding: 25}}]
						}
					}
				},
				title: '',
				from: moment(),
				to: moment(),
				samples: 100,
				internetUptimePercentage: 100
			};
		},
		methods: {
			setUnit: function(unit) {
				this.unit = unit;
				this.offset = 0;
				return this.refreshChart();
			},
			addOffset: function(delta) {
				this.offset += delta;
				return this.refreshChart(this.unit);
			},
			refreshChart: function() {
				var date = moment().add(this.offset, this.unit);
				this.from = moment(date).startOf(this.unit);
				this.to = moment(date).endOf(this.unit);
				this.samples = 100;
				if (this.unit === 'minute') {
					this.samples = Math.min(this.samples, 2);
				}
				return this.getPowerData(this.form, this.to, this.samples).then(this.displayChart);
			},
			getPowerData: function(interval, samples) {
				return fetch(`${config.api}/power?from=${this.from}&to=${this.to}&samples=${this.samples}`).then(function(res) { return res.json(); });
			},
			convertTime: function(obj) {
				var date = moment(obj.time);
				switch (this.unit) {
				case 'year': return date.format('DD/MM');
				case 'month': return date.format('DD/MM');
				case 'week': return date.format('DD/MM');
				case 'day': return date.format('HH:mm');
				case 'hour': return date.format('HH:mm');
				case 'minute': return date.format('HH:mm:ss');
				}
			},
			displayChart: function(data) {
				var dataHP = _.map(data, _.bind(this.sortHPHC, this, _, true));
				var dataHC = _.map(data, _.bind(this.sortHPHC, this, _, false));
				for (var i = 0; i < dataHP.length - 1; i++) {
					if (dataHP[i] !== null && dataHP[i + 1] === null) {
						dataHC[i] = dataHP[i];
					}
					if (dataHC[i] !== null && dataHC[i + 1] === null) {
						dataHP[i] = dataHC[i];
					}
				}
				this.chart.dataHP.splice(0, this.chart.dataHP.length, ...dataHP);
				this.chart.dataHC.splice(0, this.chart.dataHP.length, ...dataHC);
				this.chart.labels.splice(0, this.chart.labels.length, ..._.map(data, this.convertTime));
				switch (this.unit) {
				case 'year': this.title = moment((this.from + this.to) / 2).format('YYYY'); break;
				case 'month': this.title = moment((this.from + this.to) / 2).format('MMMM YYYY'); break;
				case 'week': this.title = this.from.format('DD/MM/YYYY') + ' - ' + this.to.format('DD/MM/YYYY'); break;
				case 'day': this.title = moment((this.from + this.to) / 2).format('DD/MM/YYYY'); break;
				case 'hour': this.title = this.from.format('DD/MM - HH:mm') + ' - ' + this.to.format('HH:mm'); break;
				case 'minute': this.title = this.from.format('DD/MM - HH:mm') + ' - ' + this.to.format('HH:mm'); break;
				}
			},
			sortHPHC: function(value, hp) {
				var hour = moment(value.time).hour();
				var isHP = hour > 8 && hour < 22;
				return (hp === isHP) ? value.pApp : null;
			}
		}
	};
</script>

<style lang="less" scoped>
	h1, .uptime {
		font-size : 1.5em;
		text-align: center;
		margin: 10px 0px;
	}
	h1 {
		font-size: 2em;
	}
	.btn-group {
		display : flex;
		box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
		.btn {
			flex-grow : 1;
			box-shadow:none;
			border-right:1px solid #e0e0e0;
			&:last-child {
				border-right:0px;
			}
		}
		margin:10px 0px;
	}
	.time {
		display : flex;
		align-items: center;
		* {
			flex-grow: 1;
		}
		.title {
			text-align: center;
			font-size:1.5em;
		}
	}
	.chart {
		margin-top:10px;
	}
</style>


<!--<template>
	<div id="power-manager">
		<canvas id="shortterm" count="2"></canvas>
		<chartjs-line target="shortterm" :datalabel="'Puissance'" :fill="true" :beginzero="true" :data="chart.pApp" :labels="chart.labels" :bind="true"></chartjs-line>
		<chartjs-line target="shortterm" :datalabel="'Intensité'" :fill="true" :beginzero="true" :data="chart.iInst" :labels="chart.labels" :bind="true"></chartjs-line>
		<canvas id="longterm" count="2"></canvas>
		<chartjs-line target="longterm" :datalabel="'Heures Pleines'" :fill="true" :beginzero="true" :data="chart.indexHP" :labels="chart.labels" :bind="true":bordercolor="'#ff5722'" :backgroundcolor="'rgba(255, 87, 34, 0.5)'"></chartjs-line>
		<chartjs-line target="longterm" :datalabel="'Heures Creuses'" :beginzero="true" :data="chart.indexHC" :labels="chart.labels" :bind="true":bordercolor="'#03a9f4'" :backgroundcolor="'rgba(3, 169, 244, 0.5)'"></chartjs-line>
		<input type="range" min="0" max="5" v-model="timeResolution" v-on:change="refreshChart()" />
	</div>
</template>

<script>
	import _ from 'lodash';
	import config from '../../config';

	export default {
		name: 'power-manager',
		created: function () {
			this.refreshChart();
		},
		data: function() {
			return {
				chart: {
					iInst: [],
					pApp: [],
					indexHC: [],
					indexHP: [],
					labels: []
				},
				totalDuration: 0,
				timeResolution: 3
			};
		},
		methods: {
			refreshChart(interval, samples) {
				if (!interval) {
					switch (parseInt(this.timeResolution)) {
					case 0 /* Last Year */ : interval = 1314000000; samples = 24; break;
					case 1 /* Last Month */ : interval = 86400000; samples = 30; break;
					case 2 /* Last Week */ : interval = 25200000; samples = 24; break;
					case 3 /* Last Day */ : interval = 3600000; samples = 24; break;
					case 4 /* Last Hour */ : interval = 120000; samples = 30; break;
					case 5 /* Last minute */ : interval = 2000; samples = 30; break;
					}
				}

				this.totalDuration = interval * samples;
				return this.getPowerData(interval, samples).then(this.displayChart);
			},

			getPowerData: function(interval, samples) {
				return fetch(`${config.api}/power?interval=${interval}&samples=${samples}`)
					.then(function(res) { return res.json(); });
			},

			convertTime: function(obj) {
				var date = new Date(obj.time);
				if (this.totalDuration > 2073600000) {
					return date.toLocaleDateString();
				} else if (this.totalDuration > 86400000) {
					return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
				} else {
					return date.toLocaleTimeString();
				}
			},

			displayChart: function(data) {
				this.chart.pApp.splice(0, this.chart.pApp.length, ..._.map(data, 'pApp'));
				this.chart.iInst.splice(0, this.chart.iInst.length, ..._.map(data, 'iInst'));
				this.chart.indexHC.splice(0, this.chart.indexHC.length, ..._.map(data, 'indexHC'));
				this.chart.indexHP.splice(0, this.chart.indexHP.length, ..._.map(data, 'indexHP'));
				this.chart.labels.splice(0, this.chart.labels.length, ..._.map(data, this.convertTime));
			}
		}
	};
</script>

<style>
</style>-->
