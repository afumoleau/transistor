<template>
	<div id="lights-manager">
		<button class="waves-effect waves-light btn" v-on:click="turnOffTVLight">Turn off TV Light</button>
	</div>
</template>

<script>
	import config from '../../config';

	export default {
		name: 'lights-manager',
		methods: {
			turnOffTVLight() {
				return fetch(`${config.api}/lights`);
			}
		}
	};
</script>

<style>
</style>
