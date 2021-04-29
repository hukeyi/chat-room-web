<template>
	<div
		class="chat-message-item"
		:class="{ 'my-message': direction === 'right' }"
	>
		<div class="chat-avator-name">
			<!-- 头像 -->
			<img :src="avator" class="chat-avator" />
			<!-- 昵称 -->
			<span class="chat-name">{{ name }}</span>
		</div>
		<div class="chat-message">
			<!-- 消息发送时间 -->
			<span class="chat-send-time">{{ time }}</span>
			<!-- 消息内容 -->
			<span class="chat-content">{{ message }}</span>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			// 消息item的方向
			direction: {
				type: String,
				default: 'left',
			},
			avator: {
				type: String,
				default: require('@/assets/styles/common/img/user.png'),
			},
			name: {
				type: String,
				default: 'test',
			},
			time: {
				type: String,
				default: 'yy/MM/dd hh:mm:ss',
			},
			message: {
				type: String,
				default: `default message content.`,
			},
		},
		data() {
			return {};
		},
	};
</script>

<style lang="scss" scoped>
	$message-bg-color: $fontColorDeep;
	$message-font-color: $themeColorMedium;
	.chat-message-item {
		clear: both;
		height: auto;
		min-height: 70px;
		* {
			box-sizing: border-box;
		}
		padding: 10px;
		margin-bottom: 15px;

		display: flex;
		justify-content: flex-start;

		.chat-avator-name {
			display: flex;
			flex-direction: column;
			margin: 0 15px;
			justify-content: flex-start;

			.chat-avator {
				margin-top: 17px;
				width: 40px;
				height: 40px;
				border: 1px solid $fontColorDeep;
				border-radius: 10px;
				background-color: $message-bg-color;
			}
			.chat-name {
				margin: 0 auto;
				font-size: 12px;
				display: inline-block;
			}
		}
		.chat-message {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			max-width: calc(100% - 155px);

			.chat-send-time {
				color: $fontColorMedium;
				font-size: 12px;
			}

			.chat-content {
				color: $message-font-color;
				font-weight: bold;
				background-color: $message-bg-color;
				border-radius: 10px;

				padding: 10px !important;
				word-break: break-word;

				position: relative;

				&::before {
					display: block;
					position: absolute;
					right: 100%;

					content: '';
					width: 0;
					height: 0;
					border-width: 6px;
					border-color: transparent $message-bg-color transparent transparent;
					border-style: solid;
				}
			}
		}
	}
	//reverse
	.my-message {
		flex-direction: row-reverse;

		.chat-message {
			align-items: flex-end;

			.chat-content::before {
				left: 100%;
				border-color: transparent transparent transparent $message-bg-color;
			}
		}
	}
</style>
