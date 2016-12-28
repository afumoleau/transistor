<template>
	<div id="lights-manager" class="container">
		<h1>LIGHTS</h1>
		<div class="collection">
			<div class="collection-item light" v-for="light in lights">
				<div class="name" v-on:click="toggleLight(light)">
					<i class="material-icons">lightbulb_outline</i>
					<div>{{light.name}}</div>
				</div>
				<div class="param brightness" :disabled="light.state.bri == undefined">
					<i class="material-icons">brightness_medium</i>
					<input type="range" min="0" max="255" v-model="light.state.bri" v-on:change="updateBri(light)" :disabled="light.state.bri == undefined" />
				</div>
				<div class="param hue" :disabled="light.state.hue == undefined">
					<i class="material-icons">color_lens</i>
					<input type="range" min="0" max="65535" v-model="light.state.hue" v-on:change="updateHue(light)" :disabled="light.state.hue == undefined" />
				</div>
				<div class="param ct" :disabled="light.state.ct == undefined">
					<i class="material-icons">whatshot</i>
					<input type="range" min="153" max="500" v-model="light.state.ct" v-on:change="updateCT(light)" :disabled="light.state.ct == undefined" />
				</div>
			</div>
		</div>
		<div class="actions">
			<a class="btn" v-on:click="turnOffAllLights()">Turn Off all lights</a>
		</div>
	</div>
</template>

<script>
	import config from '../../config';
	import _ from 'lodash';

	export default {
		name: 'lights-manager',
		data: function() {
			return {
				lights: []
			};
		},
		created() {
			var vm = this;
			this.getLights().then(function(lights) {
				vm.lights.splice(0, vm.lights.length, ...lights);
			});
		},
		methods: {
			getLights() {
				return fetch(`${config.api}/lights`).then(function(response) { return response.json(); });
			},
			updateLight(light, state) {
				return fetch(`${config.api}/lights/${light.id}`, {method: 'POST', body: JSON.stringify(state)});
			},
			toggleLight(light) {
				light.state.on = !light.state.on;
				light.bri = light.state.on ? 255 : 0;
				this.updateLight(light, { on: light.state.on, bri: light.state.bri });
			},
			updateBri(light) {
				light.state.on = (light.state.bri > 0);
				this.updateLight(light, { on: light.state.on, bri: light.state.bri });
			},
			updateHue(light) {
				this.updateLight(light, { hue: light.state.hue });
			},
			updateCT(light) {
				this.updateLight(light, { ct: light.state.ct });
			},
			turnOffAllLights() {
				_.forEach(this.lights, this.turnOff);
			},
			turnOff(light) {
				light.state.on = false;
				this.updateLight(light, { on: light.state.on });
			}

		}
	};
</script>

<style lang="less" scoped>
h1 {
	font-size : 2em;
	text-align: center;
	margin: 10px 0px;
}
.light {
	padding : 10px;
	display: flex;
	align-items: center;
	
	.name {
		width: 7em;
		flex-shrink: 0;
		flex-grow: 0;
		cursor: pointer;
		display: flex;
	}
	.param {
		display:flex;
		flex-grow: 1;
		align-items: center;

		&[disabled] {
			opacity: 0.1;
		}
		&.hue {
			input[type=range]::-webkit-slider-runnable-track {
				background:linear-gradient(to right,red,orange,yellow,green,blue,indigo,violet,red);
			}
		}
		&.ct {
			input[type=range]::-webkit-slider-runnable-track {
				background:linear-gradient(to right,#AACCFF,#FFFFFF,#FFCCAA);
			}
		}
		input[type="range"]::-webkit-slider-thumb {
			background-color : white;
			box-shadow : 0px 1px 5px rgba(0,0,0,0.5);
		}
		input[type=range]::-webkit-slider-runnable-track {
			border-radius: 100px;
		}
	}
	.brightness {
		margin: 0px 5px;
	}
	.btn {
		margin: 0px 5px;
		flex-shrink : 0;
		&:last-child {
			margin-right: 0px;
		}
	}
}
.actions {
	display: flex;
	justify-content: flex-end;
	margin:10px 0px;
}
</style>
