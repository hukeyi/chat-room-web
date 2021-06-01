<template>
	<div class="chat-notice-item">
		<div class="chat-notice-content">
			<!-- 消息发送时间 -->
			<span class="chat-notice-time">--- {{ time + '&emsp;' }} </span>
			<!-- 消息内容 -->
			<span class="chat-notice-body"> {{ content }} ---</span>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			time: {
				type: String,
				default: 'hh:mm:ss',
			},
			content: {
				type: String,
				default: `default content.`,
			},
		},
		data() {
			return {};
		},
	};
</script>

<style lang="scss" scoped>
	.chat-notice-item {
		width: 100%;
		.chat-notice-content {
			margin: auto;
			padding: auto;
			display: flex;
			justify-content: center;
			.chat-notice-time {
				color: $fontColorMedium;
				font-size: 14px;
			}

			.chat-notice-body {
				color: $fontColorLight;
				font-weight: bold;
				font-size: 14px;
			}
		}
	}
</style>
