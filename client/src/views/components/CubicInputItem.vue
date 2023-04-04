<template>
	<div class="control block-cube block-input">
		<input
			:name="name"
			:type="type"
			@input="updateValue($event.target.value)"
			@keydown.enter="handleEnterClear"
			@keyup.enter="$emit('submit')"
			:placeholder="placeholder"
			autocomplete="off"
			:class="{
				'error-prompt': isSubmit && vModel.$dirty && vModel.$error,
			}"
		/>
		<transition name="fade" mode="out-in">
			<div
				v-if="isSubmit && vModel.$dirty && vModel.$error"
				class="input-prompt"
			>
				{{ errorPrompt }}
			</div>
		</transition>
		<div class="bg-top">
			<div class="bg-inner"></div>
		</div>
		<div class="bg-right">
			<div class="bg-inner"></div>
		</div>
		<div class="bg">
			<div class="bg-inner"></div>
		</div>
	</div>
</template>

<script>
	import { defineComponent, reactive } from 'vue';

	export default defineComponent({
		name: 'CubicInput',
		props: {
			name: {
				type: String,
			},
			type: {
				type: String,
				default: 'text',
			},
			placeholder: {
				type: String,
				default: 'placeholder',
			},
			vModel: {
				type: Object,
				required: true,
			},
			isSubmit: {
				type: Boolean,
				default: false,
			},
			errorPrompt: {
				type: String,
			},
		},
		setup(props) {
			// make local reactive prop for vModel
			// otherwise, vue will throw
			// no-mutation-prop error
			const state = reactive({
				value: props.vModel,
			});

			return {
				state,
			};
		},
		methods: {
			updateValue(value) {
				this.$emit('update', value);
				this.vModel.$touch();
				this.state.$model = value;
			},
			handleEnterClear(e) {
				if (e.preventDefault) e.preventDefault();
				else window.event.value = false;
			},
		},
	});
</script>

<style lang="scss" scoped>
	@import '@/assets/styles/login/cube.scss';
	/**
	* 错误提示气泡框
	*/
	.input-prompt {
		color: $themeColorMedium;
		font-weight: bold;
		background-color: $fontColorLight;
		border-radius: 10px;

		padding: 10px !important;
		word-break: break-word;

		position: absolute;
		/* make sure 小尖角与输入框左侧对齐 */
		left: -100%;
		right: calc(100% + 6px);
		top: 0;

		text-align: center;
		// text-decoration: underline dashed rgb(255, 0, 89) 2.5px;

		/**
		* 气泡框的右侧小尖角
		*/
		&::before {
			display: block;
			position: absolute;
			left: 100%;
			top: calc(50% - 3px);

			content: '';
			width: 0;
			height: 0;
			border-width: 6px;
			border-color: transparent transparent transparent $fontColorLight;
			border-style: solid;
		}
	}
</style>
