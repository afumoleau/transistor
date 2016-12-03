<template>
	<div id="internet-status">
		<chartjs-line :beginzero="true" :data="chart.data" :labels="chart.labels" :bind="true"></chartjs-line>
		<button class="waves-effect waves-light btn" v-on:click="refreshChart(3600000, 24)">1 Day</button>
		<button class="waves-effect waves-light btn" v-on:click="refreshChart(120000, 30)">1 Hour</button>
	</div>
</template>

<script>
	import _ from 'lodash';
	import config from '../../config';

	export default {
		name: 'internet-status',
		created: function () {
			this.refreshChart(3600000, 24);
		},
		data: function() {
			return {
				chart: {
					data: [1, 2, 3, 4],
					labels: ['a', 'b', 'c', 'd']
				},
				totalDuration: 0
			};
		},
		methods: {
			refreshChart(interval, samples) {
				this.totalDuration = interval * samples;
				return this.getInternetStatusData(interval, samples).then(this.displayChart);
			},

			getInternetStatusData: function(interval, samples) {
				return fetch(`${config.api}/internet-status?interval=${interval}&samples=${samples}`)
					.then(function(res) { return res.json(); });
			},

			convertTime: function(obj) {
				var date = new Date(obj.time);
				if (this.totalDuration > 86400000) {
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
