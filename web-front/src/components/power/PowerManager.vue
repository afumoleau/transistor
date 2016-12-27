<template>
	<div id="power-manager">
		<canvas id="shortterm" count="2"></canvas>
		<chartjs-line target="shortterm" :datalabel="'Puissance'" :fill="true" :beginzero="true" :data="chart.pApp" :labels="chart.labels" :bind="true"></chartjs-line>
		<chartjs-line target="shortterm" :datalabel="'Intensité'" :fill="true" :beginzero="true" :data="chart.iInst" :labels="chart.labels" :bind="true"></chartjs-line>
		<canvas id="longterm" count="2"></canvas>
		<chartjs-line target="longterm" :datalabel="'Heures Pleines'" :beginzero="true" :data="chart.indexHC" :labels="chart.labels" :bind="true":bordercolor="'#ff5722'" :backgroundcolor="'rgba(255, 87, 34, 0.5)'"></chartjs-line>
		<chartjs-line target="longterm" :datalabel="'Heures Creuses'" :fill="true" :beginzero="true" :data="chart.indexHP" :labels="chart.labels" :bind="true":bordercolor="'#03a9f4'" :backgroundcolor="'rgba(3, 169, 244, 0.5)'"></chartjs-line>
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
</style>
