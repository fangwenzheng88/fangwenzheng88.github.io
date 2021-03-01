const hljs = require('highlight.js');
const marked = require('marked');
const renderer = new marked.Renderer();

module.exports = {
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
      'element-ui': 'ELEMENT',
      highlight: 'highlight'
    }
  },
  chainWebpack: (config) => {
    config.module
      .rule('md')
      .test(/\.md/)
      .use('html-loader')
      .loader('html-loader')
      .end()
      .use('markdown-loader')
      .loader('markdown-loader')
      .options({
        renderer,
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: true,
        highlight: function(code) {
          return hljs.highlightAuto(code).value;
        }
      })
      .end();
  }
};
