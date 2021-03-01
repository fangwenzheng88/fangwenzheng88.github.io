// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
      'element-ui': 'ELEMENT',
      'highlight.js': 'hljs'
    }
  }
  //chainWebpack: (config) => {
  // config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin);
  //}
};
