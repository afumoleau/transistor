<template>
	<div id="device-manager">
		<div class="collection">
			<div class="collection-item device" v-for="device in devices">
				<div class="name">{{device.name}}</div>
				<div class="ip">{{device.ip}}</div>
				<div class="mac">{{device.mac}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	import config from '../../config';

	export default {
		name: 'device-manager',
		data: function() {
			return {
				devices: []
			};
		},
		created() {
			var vm = this;
			this.getDevices().then(function(devices) {
				vm.devices.splice(0, vm.devices.length, ...devices);
			});
		},
		methods: {
			getDevices() {
				return fetch(`${config.api}/devices`).then(function(response) { return response.json(); });
			},
			wakeDevice(device) {
				return fetch(`${config.api}/devices/${device.id}/wake`);
			}
		}
	};
</script>

<style lang="less" scoped>
.device {
	display: flex;
	justify-content: space-between;

	.name {
		flex-grow: 1;
	}
	.ip, .mac {
		font-family: monospace;
		flex-grow: 0;
		margin: 0px 1em;
		&:first-child {
			margin-left : 0px;
		}
		&:last-child {
			margin-right : 0px;
		}
	}
}
</style>