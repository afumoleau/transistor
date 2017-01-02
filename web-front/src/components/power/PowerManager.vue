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

			<div class="consumption green-text">
				<div>Heures Pleines : {{consumption.hp.toFixed(0)}}kWh (<span class="cost">{{consumption.hpCost.toFixed(2)}}€</span>)</div>
				<div>Heures Creuses : {{consumption.hc.toFixed(0)}}kWh (<span class="cost">{{consumption.hcCost.toFixed(2)}}€</span>)</div>
				<div>Total : {{consumption.total.toFixed(0)}}kWh (<span class="cost">{{consumption.totalCost.toFixed(2)}}€</span> / BASE: {{consumption.totalCostBase.toFixed(2)}}€)</div>
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
				consumption: {
					hp: 0,
					hc: 0,
					hpCost: 0,
					hcCost: 0,
					total: 0,
					totalCost: 0,
					totalCostBase: 0
				}
			};
		},
		methods: {
			setUnit: function(unit) {
				this.unit = unit;
				this.offset = 0;
				return this.refreshData();
			},
			addOffset: function(delta) {
				this.offset += delta;
				return this.refreshData(this.unit);
			},
			refreshData: function() {
				var self = this;
				var date = moment().add(this.offset, this.unit);
				this.from = moment(date).startOf(this.unit);
				this.to = moment(date).endOf(this.unit);
				this.samples = 100;
				if (this.unit === 'minute') {
					this.samples = Math.min(this.samples, 2);
				}
				this.getPowerData(this.form, this.to, this.samples).then(this.displayChart);
				this.getConsumption(this.form, this.to).then(function(data) {
					var hp = data[0].indexHP;
					var hc = data[0].indexHC;
					self.consumption = {
						hp: hp / 1000,
						hc: hc / 1000,
						hpCost: (hp * 0.000156),
						hcCost: (hc * 0.000127),
						total: (hp + hc) / 1000,
						totalCost: (hp * 0.000156 + hc * 0.000127),
						totalCostBase: ((hp + hc) * 0.00014620)
					};
				});
			},
			getPowerData: function(from, to, samples) {
				return fetch(`${config.api}/power?from=${this.from}&to=${this.to}&samples=${this.samples}`).then(function(res) { return res.json(); });
			},
			getConsumption: function(from, to) {
				return fetch(`${config.api}/consumption?from=${this.from}&to=${this.to}`).then(function(res) { return res.json(); });
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
	.consumption {
		text-align: center;
		font-size: 1.2em;
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
	.cost {
		font-weight: bold;
	}
</style>