<template>
	<div class="control block-cube block-input">
		<input
			:name="name"
			:type="type"
			:value="model"
			@input="updateValue($event.target.value)"
			@keydown.enter="handleEnterClear"
			@keyup.enter="$emit('submit')"
			:placeholder="placeholder"
			autocomplete="new-password"
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
		computed: {
			model: {
				get() {
					return this.vModel.$model;
				},
				set(value) {
					this.updateValue(value);
				},
			},
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
	$bg_body: $themeColorDeep;
	$bg_gradient: linear-gradient(
		90deg,
		$emphasisColorA 0%,
		$emphasisColorA 37%,
		$fontColorDeep 94%
	);
	/**
		* 立方体的输入框
		*/
	.control {
		margin: 0 0 24px;
		input {
			width: 100%;
			padding: 14px 16px;
			border: 0;
			background: transparent;
			color: #fff;
			// font-family: monospace, serif;
			letter-spacing: 0.05em;
			font-size: 16px;
			&:hover,
			&:focus {
				outline: none;
				border: 0;
			}
		}
	}
	/**
		* 立方体的按钮
		*/
	.btn {
		// margin: 0 0 24px;
		width: 100%;
		display: block;
		padding: 14px 16px;
		background: transparent;
		outline: none;
		border: 0;
		color: #fff;
		letter-spacing: 0.1em;
		font-weight: bold;
		font-size: 16px;

		cursor: pointer;
	}
	// 输入框格式错误显示红色点线
	.error-prompt {
		text-decoration: underline dashed rgb(255, 0, 89) 2.5px;
	}
	.or-sign-in {
		text-decoration: underline $fontColorLight 1.5px;
		text-align: center;
		&:hover {
			cursor: pointer;
		}
	}
	/**
	* 立方体的三面
	*/
	.block-cube {
		position: relative;
		.bg-top {
			position: absolute;
			height: 10px;
			background: rgb(2, 0, 36);
			background: $bg_gradient;
			bottom: 100%;
			left: 5px;
			right: -5px;
			transform: skew(-45deg, 0);
			margin: 0;
			.bg-inner {
				bottom: 0;
			}
		}
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			background: rgb(2, 0, 36);
			background: $bg_gradient;
		}
		.bg-right {
			position: absolute;
			background: rgb(2, 0, 36);
			background: $fontColorDeep;
			top: -5px;
			z-index: 0;
			bottom: 5px;
			width: 10px;
			left: 100%;
			transform: skew(0, -45deg);
			.bg-inner {
				left: 0;
			}
		}
		.bg {
			.bg-inner {
				transition: all 0.2s ease-in-out;
			}
		}
		.bg-inner {
			background: $bg_body;
			position: absolute;
			left: 2px;
			top: 2px;
			right: 2px;
			bottom: 2px;
		}
		.text {
			position: relative;
			z-index: 2;
		}
		&.block-input {
			input {
				position: relative;
				z-index: 2;
				&:focus ~ .bg-right .bg-inner,
				&:focus ~ .bg-top .bg-inner,
				&:focus ~ .bg-inner .bg-inner {
					top: 100%;
					background: rgba(255, 255, 255, 0.5);
				}
			}
			.bg-top,
			.bg-right,
			.bg {
				background: rgba(255, 255, 255, 0.5);
				transition: background 0.2s ease-in-out;
			}
			.bg-right,
			.bg-top {
				.bg-inner {
					transition: all 0.2s ease-in-out;
				}
			}
			&:focus,
			&:hover {
				.bg-top,
				.bg-right,
				.bg {
					background: rgba(255, 255, 255, 0.8);
				}
			}
		}
		// State hover, focus
		&.block-cube-hover:focus,
		&.block-cube-hover:hover {
			.bg {
				.bg-inner {
					top: 100%;
				}
			}
		}
	}
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
