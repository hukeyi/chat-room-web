<template>
	<div style="height: 100%; width: 100%">
		<Spinner
			v-if="isLoading()"
			class="full-page-loader"
			:loading="isLoading()"
			:color="colorForLoader"
		/>
		<router-view v-else v-slot="{ Component }">
			<transition name="fade" mode="out-in">
				<component :is="Component" />
			</transition>
		</router-view>
	</div>
</template>

<script>
	import Spinner from 'vue-spinner/src/PacmanLoader.vue';
	import { mapGetters } from 'vuex';

	export default {
		name: 'App',
		components: {
			Spinner,
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
