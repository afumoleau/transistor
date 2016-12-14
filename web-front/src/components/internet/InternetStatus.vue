<template>
	<div id="internet-status">
		<chartjs-line :datalabel="'INTERNET STATUS'" :fill="true" :beginzero="true" :data="chart.data" :labels="chart.labels" :bind="true"></chartjs-line>
		<input type="range" min="0" max="5" v-model="timeResolution" v-on:change="refreshChart()" />
	</div>
</template>

<script>
	import _ from 'lodash';
	import config from '../../config';

	export default {
		name: 'internet-status',
		created: function () {
			this.refreshChart();
		},
		data: function() {
			return {
				chart: {
					data: [],
					labels: []
				},
				totalDuration: 0,
				timeResolution: 4
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
					case 5 /* Last 12 minutes */ : interval = 30000; samples = 24; break;
					}
				}

				this.totalDuration = interval * samples;
				return this.getInternetStatusData(interval, samples).then(this.displayChart);
			},

			getInternetStatusData: function(interval, samples) {
				return fetch(`${config.api}/internet-status?interval=${interval}&samples=${samples}`)
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
				this.chart.data.splice(0, this.chart.data.length, ..._.map(data, 'value'));
				this.chart.labels.splice(0, this.chart.labels.length, ..._.map(data, this.convertTime));
			}
		}
	};
</script>

<style>
</style>
