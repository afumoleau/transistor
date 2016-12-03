<template>
	<div id="app" class="container">
		<internet-status></internet-status>
		<lights-manager></lights-manager>
	</div>
</template>

<script>
	import InternetStatus from './components/internet/InternetStatus';
	import LightsManager from './components/lights/LightsManager';

	export default {
		name: 'app',
		components: {
			InternetStatus,
			LightsManager
		}
	};
</script>

<style>
	#app {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
