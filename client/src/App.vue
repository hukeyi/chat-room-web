<template>
	<div style="height: 100%; width: 100%">
		<!-- <Spinner
			class="full-page-loader"
			v-if="isLoading()"
			:loading="isLoading()"
			:color="colorForLoader"
		/> -->
		<!-- <router-view v-else /> -->
		<transition name="fade" mode="out-in">
			<router-view />
		</transition>
	</div>
</template>

<script>
	// import Spinner from 'vue-spinner/src/PacmanLoader.vue';
	import { mapGetters } from 'vuex';

	export default {
		name: 'App',
		components: {
			// Spinner,
		},
		data() {
			return {
				colorForLoader: '#819c8a',
			};
		},
		methods: {
			...mapGetters({
				isLoading: 'getFullPageLoader',
			}),
		},
	};
</script>
<style lang="scss">
	@import '@/assets/styles/transition.scss';
	#app {
		height: 100%;
		width: 100%;
	}
	.full-page-loader {
		position: fixed !important;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
