const path = require('path');
const serverUrl =
	process.env.NODE_ENV != 'production'
		? process.env.VUE_APP_SERVER_URL_LOCAL
		: process.env.VUE_APP_SERVER_URL; // 后端服务器 host 地址

function resolve(dir) {
	return path.join(__dirname, dir);
}

module.exports = {
	chainWebpack: (config) => {
		//路径配置
		config.resolve.alias.set('assets', resolve('src/assets'));
	},

	// webpack-dev-server 相关配置
	devServer: {
		port: 8080,
		https: false,
		open: false,
		proxy: {
			'/api': {
				target: serverUrl + '/api/',
				changeOrigin: true, //是否跨域
				ws: true,
				pathRewrite: {
					'^/api': '',
				},
			},
		},
	},
	css: {
		loaderOptions: {
			scss: {
				//sass loader v10+ 必须用addtionalData
				additionalData: `@import "@/assets/styles/global.scss";`,
			},
		},
		// requireModuleExtension: false, //fixme: 加了这个之后element ui的样式会失效！
	},
	configureWebpack: {
		devtool: 'source-map',
	},
};
