<template>
	<div id="app" class="container">
		<h1>Internet</h1>
		<internet-status></internet-status>

		<h1>Lights</h1>
		<lights-manager></lights-manager>

		<h1>Power</h1>
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
