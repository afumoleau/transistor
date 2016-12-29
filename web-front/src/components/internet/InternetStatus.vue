<template>
	<div id="internet-status" class="blue lighten-5">
		<div class="container">
			
			<h1 class="blue-text">INTERNET</h1>
			
			<div class="btn-group">
				<div class="btn white blue-text" v-on:click="setUnit('year')">YEAR</div>
				<div class="btn white blue-text" v-on:click="setUnit('month')">MONTH</div>
				<div class="btn white blue-text" v-on:click="setUnit('week')">WEEK</div>
				<div class="btn white blue-text" v-on:click="setUnit('day')">DAY</div>
				<div class="btn white blue-text" v-on:click="setUnit('hour')">HOUR</div>
				<div class="btn white blue-text" v-on:click="setUnit('minute')">MINUTE</div>
			</div>

			<div class="time">
				<div class="btn white blue-text" v-on:click="addOffset(-1)">&lt;</div>
				<div class="title blue-text">{{title}}</div>
				<div class="btn white blue-text" v-on:click="addOffset(1)">&gt;</div>
			</div>

			<div class="chart">
				<chartjs-line
					:option="chart.options"
					:fill="true"
					:data="chart.data"
					:labels="chart.labels"
					:bind="true"
					:backgroundcolor="'rgba(33,150,243,0.5)'"
					:bordercolor="'rgba(33,150,243)'">
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
		name: 'internet-status',
		created: function () {
			this.setUnit('day');
		},
		data: function() {
			return {
				chart: {
					data: [],
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
				return this.getInternetStatusData(this.form, this.to, this.samples).then(this.displayChart);
			},
			getInternetStatusData: function(interval, samples) {
				return fetch(`${config.api}/internet-status?from=${this.from}&to=${this.to}&samples=${this.samples}`).then(function(res) { return res.json(); });
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
				this.chart.data.splice(0, this.chart.data.length, ..._.map(data, 'value'));
				this.chart.labels.splice(0, this.chart.labels.length, ..._.map(data, this.convertTime));
				switch (this.unit) {
				case 'year': this.title = moment((this.from + this.to) / 2).format('YYYY'); break;
				case 'month': this.title = moment((this.from + this.to) / 2).format('MMMM YYYY'); break;
				case 'week': this.title = this.from.format('DD/MM/YYYY') + ' - ' + this.to.format('DD/MM/YYYY'); break;
				case 'day': this.title = moment((this.from + this.to) / 2).format('DD/MM/YYYY'); break;
				case 'hour': this.title = this.from.format('DD/MM - HH:mm') + ' - ' + this.to.format('HH:mm'); break;
				case 'minute': this.title = this.from.format('DD/MM - HH:mm') + ' - ' + this.to.format('HH:mm'); break;
				}
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
			padding:0px 5px;
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
