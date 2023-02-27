const path = require('path');
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
		// 调试端口
		port: 8080,
		// host: 'localhost',
		https: false,
		open: false,
		proxy: {
			'/api': {
				// target: 'http://localhost:3000/api/',
				target: server_url + '/api/',
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
