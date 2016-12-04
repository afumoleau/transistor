<template>
	<div id="device-manager">
		<div class="collection">
			<div class="collection-item device" v-for="device in devices">
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
</style>