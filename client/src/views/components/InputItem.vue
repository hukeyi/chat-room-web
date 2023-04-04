<template>
	<div class="input-item" :style="itemStyle">
		<label :style="labelStyle" class="input-label">{{ labelValue }}</label>
		<el-input
			class="input-content"
			:style="inputStyle"
			:placeholder="placeholder"
			:clearable="clearable"
			:show-password="isPassword"
			v-model="inputValue"
			@input="handleInput"
		></el-input>
		<slot></slot>
	</div>
</template>
<script>
	export default {
		name: 'InputItem',
		props: {
			labelValue: {
				// 标签值
				type: String,
				default: 'default',
			},
			placeholder: {
				// 输入框占位值
				type: String,
				default: 'default',
			},
			clearable: {
				// 输入框是否可清空
				type: Boolean,
				default: false,
			},
			isPassword: {
				//输入框是否不显示密码
				type: Boolean,
				default: false,
			},
			itemStyle: {
				// 输入器整体style修改
				type: String,
				default: '',
			},
			labelStyle: {
				// label的style
				type: String,
				default: '',
			},
			inputStyle: {
				// input的style
				type: String,
				default: '',
			},
		},
		data() {
			return {
				// 输入值
				inputValue: '',
			};
		},
		methods: {
			// 传给父组件，通过@onInput绑定监听函数
			handleInput() {
				this.$emit('onInput', this.inputValue);
			},
		},
	};
</script>
<style lang="scss" scoped>
	.input-item {
		text-align: left;
		margin-bottom: 20px;
		// padding: 20px !important;
		// width: 300px;
		.input-label {
			display: inline-block;
			color: $fontColorDeep;
			margin-bottom: 15px;
			font-size: 14px;
		}
		.input-content {
			color: $fontColorDeep;
		}
	}
</style>
