<template>
	<div id="app">
		<internet-status></internet-status>

		<lights-manager></lights-manager>

		<power-manager></power-manager>
	</div>
</template>

<script>
	import InternetStatus from './components/internet/InternetStatus';
	import LightsManager from './components/lights/LightsManager';
	import PowerManager from './components/power/PowerManager';

	export default {
		name: 'app',
		components: {
			InternetStatus,
			LightsManager,
			PowerManager
		}
	};
</script>

<style lang="less" scoped>
	#app {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
	}
	h1 {
		text-transform: uppercase;
		text-align: center;
		font-size: 1.5em;
		color: #555;
	}
</style>
