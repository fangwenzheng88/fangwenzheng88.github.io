// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
module.exports = {
  configureWebpack: (config) => {
    config.externals = {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
      'element-ui': 'ELEMENT',
      'highlight.js': 'hljs'
    };
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css||md|html|htm)$/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false // 不删除源文件
        })
      );
    }
  }
  //chainWebpack: (config) => {
  // config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin);
  //}
};
