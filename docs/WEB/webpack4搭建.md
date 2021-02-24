[toc]

# 1. 初始化项目

## 1.1. 创建文件夹webpack4_demo，进入文件夹打开cmd命令行
## 1.2. 输入`npm init` 初始化package.json
```
{
  "name": "webpack4_demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

<!-- more -->

## 1.3. 安装webpack依赖
```
npm i webpack webpack-cli -D // -D 即 -save-dev    版本4.x以上需要安装webpack-cli
npm i webpack-merge -D
npm i webpack-dev-server -D
```

### 1.3.1. webpack-cli

[webpack-cli](https://www.npmjs.com/package/webpack-cli)

`webpack CLI`提供了一组灵活的命令，供开发人员在设置自定义`webpack`项目时提高速度。

从`webpack v4`开始，`webpack`不再需要配置文件，但是开发人员经常希望根据其用例和需求创建更自定义的`webpack`配置。`webpack CLI`通过提供一组工具来改善自定义`Webpack`配置的设置，从而满足了这些需求。

### 1.3.2. webpack-merge

[webpack-merge](https://www.npmjs.com/package/webpack-merge)

`webpack-merge`提供了`merge`连接数组并合并对象以创建新对象的功能。如果遇到函数，它将执行它们，通过算法运行结果，然后将返回的值再次包装在函数中。

尽管此行为具有超出其用途，但在配置`webpack`时特别有用。每当您需要合并配置对象时，`webpack-merge`都会派上用场。


还有一个特定于`webpack`的合并变体，`merge.smart`该变体能够考虑到webpack的特定情况（即，它可以使加载程序定义变平）。

## 1.4. webpack配置

### 1.4.1. 用更加快捷的mode模式来优化配置文件

`webpack4`中提供的`mode`有两个值：`development`和`production`，默认值是 `production`。`mode`是我们为减小生产环境构建体积以及节约开发环境的构建时间提供的一种优化方案，提供对应的构建参数项的默认开启或关闭，降低配置成本。

#### 1.4.1.1. 开启方式 1：直接在启动命令后加入参数
```
"scripts": {
  "dev": "webpack --mode development",
  "build": "webpack --mode production"
}
```

#### 1.4.1.2. 开启方式 2：可以在配置文件中加入一个mode属性：
```
module.exports = {
  mode: 'production' // development
};
```

#### 1.4.1.3. development模式下，将侧重于功能调试和优化开发体验，包含如下内容：

- 浏览器调试工具
- 开发阶段的详细错误日志和提示
- 快速和优化的增量构建机制

#### 1.4.1.4. production模式下，将侧重于模块体积优化和线上部署，包含如下内容：

- 开启所有的优化代码
- 更小的bundle大小
- 去除掉只在开发阶段运行的代码
- Scope hoisting和Tree-shaking
- 自动启用uglifyjs对代码进行压缩

>webpack一直以来最饱受诟病的就是其配置门槛极高，配置内容复杂而繁琐，容易让人从入门到放弃，而它的后起之秀如rollup，parcel等均在配置流程上做了极大的优化，做到开箱即用，webpack在V4中应该也从中借鉴了不少经验来提升自身的配置效率，详见内容可以参考这篇文章[《webpack 4: mode and optimization》](https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a)

### 1.4.2. 指定使用哪个配置文件

```
"scripts": {
    "build": "webpack --config webpack.prod.conf.js",
    "dev": "webpack-dev-server --config webpack.dev.conf.js"
}
```

### 1.4.3. process.env 配置

`process.env` 属性返回一个对象，包含了当前 `Shell` 的所有环境变量。比如，`process.env.HOME` 返回用户的主目录。

通常的做法是，新建一个环境变量 `NODE_ENV` ，用它确定当前所处的开发阶段，生产阶段设为 `production`，开发阶段设为 `development` 或 `staging` ，然后在脚本中读取 `process.env.NODE_ENV` 即可。
要说明的是，`NODE_ENV` 这个名称只是开发社区的一种共识，名称内容是可以修改的。如果需要，你也可以把它定义为 `NODE_abc` 或者 `xxx` 都行。下边我们按照约定就以 `NODE_ENV` 来说。

在 `Webpack` 配置文件中，经常会看到如下类似的代码：

```
// webpack.config.js
module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}
```
`process.env` 是 `Nodejs` 提供的一个 `API` ，那么如果想用 `process.env.NODE_ENV` ，就必须先设置其值才能用。
但是如何设置 这个 `process.env.NODE_ENV` 环境变量呢？在 `webpack` 项目里，我们可以通过设置 `package.json` 来实现，但是 `Windows` 系统和 `Mac` 系统有区别。

`Windows` 系统
```
// package.json
{
  ...
  "scripts": {
    "dev": "set NODE_ENV=development &&  webpack-dev-server --open --hot",
    "build": "set NODE_ENV=production &&   --progress --hide-modules"
  }
}
```

`Mac` 系统

```
// package.json
{
  ...
  "scripts": {
    "dev": "export NODE_ENV=development &&  webpack-dev-server --open --hot",
    "build": "export NODE_ENV=production &&   --progress --hide-modules"
  }
}
```

但它们的语法都不尽相同。这就带来两个问题：
那么问题又来了，我在 `Windows` 开发部署的项目，可能在 `Mac` 系统无法正常打包，反之亦然。为了解决这个问题，有人就开发了 `cross-env`。

`cross-env`是一个跨平台设置环境变量的第三方包，它可以让你只配置一行命令，就能轻松地在多个平台设置环境变量。首先先安装

```
npm install --save-dev cross-env 
```

然后配置 `package.json` 就可以了
```
// package.json
{
  ...
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server",
    "build": "cross-env NODE_ENV=production webpack --mode=production"
  },
}
```

最后就可以在 `webpack.config.js` 中获取环境变量
```
const devMode = process.env.NODE_ENV !== 'production';
```

## 1.5. 初始化配置文件

创建webpack配置文件
```
cd .>webpack.base.conf.js
cd .>webpack.dev.conf.js
cd .>webpack.prod.conf.js
```


webpack.dev.conf.js
```
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.base.conf.js');
module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        host: "localhost",
        open: true,
        port: 9999
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
});
```

webpack.prod.conf.js
```
const merge = require('webpack-merge');
const common = require('./webpack.base.conf.js');
module.exports = merge(common, {
    mode: 'production',
    devtool: "source-map",
    plugins: [
    ]
});
```
webpack.base.conf.js
```
const path = require('path');
module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "[name].[hash:8].js",
    },
    module: {
        rules: []
    },
    plugins: []
};
```



## 1.6. 安装plugins，loaders

### 1.6.1. `clean-webpack-plugin`

默认情况下，此插件将output.path在每次成功重建后删除webpack 目录中的所有文件以及所有未使用的webpack资产。

```
npm install --save-dev clean-webpack-plugin
```

```
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 
const webpackConfig = {
    plugins: [
        /**
         * All files inside webpack's output.path directory will be removed once, but the
         * directory itself will not be. If using webpack 4+'s default configuration,
         * everything under <PROJECT_DIR>/dist/ will be removed.
         * Use cleanOnceBeforeBuildPatterns to override this behavior.
         *
         * During rebuilds, all webpack assets that are not used anymore
         * will be removed automatically.
         *
         * See `Options and Defaults` for information
         */
        new CleanWebpackPlugin(),
    ],
};
 
module.exports = webpackConfig;
```

### 1.6.2. babel

[babel 官网指南](https://babeljs.io/docs/en/usage)

```
npm i @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
npm i @babel/runtime-corejs3
npm i -D babel-loader
```

`babel.config.js` 配置：
```
module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not dead']
        }
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3
      }
    ]
  ]
};
```
- 该方案支持所有，包括转译语法，API 及实例方法的 polyfill。
- 该方案不会污染全局

### 1.6.3. sass

```
npm install --save-dev css-loader
npm install --save-dev style-loader
npm install sass-loader node-sass webpack --save-dev
```

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
};
```

#### 1.6.3.1. node-sass安装失败处理

项目根路径下创建`.npmrc`文件
```
phantomjs_cdnurl=http://cnpmjs.org/downloads
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
registry=https://registry.npm.taobao.org
```
重新运行之前的安装命令


### 1.6.4. HtmlWebpackPlugin

`HtmlWebpackPlugin`简化了HTML文件的创建，以便为你的`webpack`包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 `webpack bundle` 尤其有用。 你可以让插件为你生成一个`HTML`文件，使用`lodash`模板提供你自己的模板，或使用你自己的`loader`。

```
npm install --save-dev html-webpack-plugin
```

```
const HtmlWebpackPlugin = require('html-webpack-plugin')


plugins: [
  new HtmlWebpackPlugin({ // 打包输出HTML
      title: 'Hello World app',
      minify: { // 压缩HTML文件
          removeComments: true, // 移除HTML中的注释
          collapseWhitespace: true, // 删除空白符与换行符
          minifyCSS: true// 压缩内联css
      },
      filename: 'index.html',
      template: path.join(__dirname,'./src/index.html')
  }),
]
```


### 1.6.5. less-loader

```
npm install less-loader --save-dev
```

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          },
        ],
      },
    ],
  },
};
```

### 1.6.6. postcss-loader

```
npm i -D postcss-loader
npm install --save-dev autoprefixer
```

创建`postcss.config.js`

```
module.exports = {
    plugins:[
        require("autoprefixer")
    ]
}
```

```
//webpack.config.js
module.exports = (env) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  }
})
```


### 1.6.7. `mini-css-extract-plugin` CSS提取插件

📢注意： MiniCssExtractPlugin 推荐只用于生产环境，因为该插件在开发环境下会导致HMR功能缺失，所以日常开发中，还是用style-loader。

[MiniCssExtractPlugin 文档地址](https://webpack.docschina.org/plugins/mini-css-extract-plugin/)

```
npm install --save-dev mini-css-extract-plugin
```

```
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      }
    ]
  }
}
```

### 1.6.8. css优化压缩 optimize-css-assets-webpack-plugin

它将在Webpack构建期间搜索CSS资产，并优化\最小化CSS（默认情况下，它使用cssnano，但可以指定自定义CSS处理器）。

```
npm install --save-dev optimize-css-assets-webpack-plugin
npm i cssnano -D
```

```
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// 使用cssnano配置规则
// 先 npm i cssnano -D
new OptimizeCssAssetsPlugin({
    // 默认是全部的CSS都压缩，该字段可以指定某些要处理的文件
    assetNameRegExp: /\.(sa|sc|c)ss$/g,
    // 指定一个优化css的处理器，默认cssnano
    cssProcessor: require('cssnano'),

    cssProcessorPluginOptions: {
        preset: ['default', {
            discardComments: { removeAll: true }, //对注释的处理
            normalizeUnicode: false // 建议false,否则在使用unicode-range的时候会产生乱码
        }]
    },
    canPrint: true  // 是否打印编译过程中的日志
})
```


### 1.6.9. url-loader

如果页面图片较多，发很多http请求，会降低页面性能。这个问题可以通过url-loader解决。url-loader会将引入的图片编码，生成dataURl并将其打包到文件中，最终只需要引入这个dataURL就能访问图片了。当然，如果图片较大，编码会消耗性能。因此url-loader提供了一个limit参数，小于limit字节的文件会被转为DataURl，大于limit的还会使用file-loader进行copy

```
npm install url-loader --save-dev
```

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
};
```

### 1.6.10. file-loader

在css文件中定义background的属性或者在html中引入image的src，我们知道在webpack打包后这些图片会打包至定义好的一个文件夹下，和开发时候的相对路径会不一样，这就会导致导入图片路径的错误。而file-loader正是为了解决此类问题而产生的，他修改打包后图片的储存路径，再根据配置修改我们引用的路径，使之对应引入

```
npm install file-loader --save-dev
```

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
};
```



### 1.6.11. optimization 优化持久化缓存

最初，块（及其内部导入的模块）通过内部Webpack图形中的父子关系连接。将`CommonsChunkPlugin`被用来避免在这些重复的依赖，但进一步的优化是不可能的。

从`webpack v4`开始，`CommonsChunkPlugin`删除了，而改为`optimization.splitChunks`。

[SplitChunks插件](https://webpack.docschina.org/plugins/split-chunks-plugin/)

```
module.exports = {
  //...
  optimization: {
    splitChunks: {
        chunks: 'async',
        // 拆分前必须共享模块的最小块数。
        minSize: 30000,
        // maxSize享有比更高的优先权maxInitialRequest/maxAsyncRequests。实际优先级为maxInitialRequest/maxAsyncRequests < maxSize < minSize。
        maxSize: 0,
        // 拆分前必须共享模块的最小块数。
        minChunks: 1,
        // 按需加载时最大并行请求数
        maxAsyncRequests: 5,
        // 入口点的最大并行请求数。
        maxInitialRequests: 3,
        // 指定用于生成名称的定界符
        automaticNameDelimiter: '~',
        // 允许设置由生成的块名称的最大字符数
        automaticNameMaxLength: 30,
        name: true,
        // 缓存组可以继承和/或覆盖splitChunks.*;中的任何选项
        cacheGroups: {
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
            },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
            }
        }
    }
  }
};
```



## 1.7. 引入bootstrap

[bootstrap官方文档](https://getbootstrap.com/docs/4.3/getting-started/webpack/)

```
npm install --save jquery popper.js
npm install bootstrap
```
`Bootstrap`依赖于`jQuery`和`Popper`，它们定义为`peerDependencies`，这意味着您必须确保将它们都添加到`package.json`

通过将以下行添加到应用的入口文件中（通常是`index.js`或`app.js`）来导入`Bootstrap`
```
import 'bootstrap';
```
或者，您可以根据需要分别导入插件：
```
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/alert';
```

### 1.7.1. 导入预编译的Sass

要充分发挥Bootstrap的潜力并根据需要对其进行自定义，请将源文件用作项目捆绑过程的一部分。

首先，创建您自己的文件，_custom.scss并使用它覆盖内置的自定义变量。然后，使用您的主Sass文件导入您的自定义变量，然后导入`Bootstrap`：

```
$primary:       #e95420 !default;
$secondary:     #0e8420 !default;
$success:       #fff !default;
$light:         #e8cd56 !default;
$dark:          #e95420 !default;

$input-bg: #c34113;
$input-border-color: #c34113;
$input-placeholder-color: #ccc;
$input-color: #fff;

$jumbotron-bg: rgb(247, 247, 247);

@import "~bootstrap/scss/bootstrap";
```

为了使`Bootstrap`进行编译，请确保安装并使用所需的加载程序：`sass-loader`，`postcss-loader`和`Autoprefixer`。通过最少的设置，您的`webpack`配置应包含此规则或类似规则：
```
{
  test: /\.(scss)$/,
  use: [{
    loader: 'style-loader', // inject CSS to page
  }, {
    loader: 'css-loader', // translates CSS into CommonJS modules
  }, {
    loader: 'postcss-loader', // Run postcss actions
    options: {
      plugins: function () { // postcss plugins, can be exported to postcss.config.js
        return [
          require('autoprefixer')
        ];
      }
    }
  }, {
    loader: 'sass-loader' // compiles Sass to CSS
  }]
},
```

### 1.7.2. 导入编译的CSS

另外，您可以通过将Bootstrap的现成CSS添加到项目的入口点来使用它：

```
import 'bootstrap/dist/css/bootstrap.min.css';
```

在这种情况下，您可以使用现有规则，css而无需对webpack配置进行任何特殊修改，除非您不需要`sass-loader`仅`style-loader`和`css-loader`。

```
...
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
  ]
}
...
```

# 2. webpack项目添加react

[https://www.html.cn/archives/9436](https://www.html.cn/archives/9436)

## 2.1. 添加`@babel/preset-react`

[https://www.babeljs.cn/docs/babel-preset-react](https://www.babeljs.cn/docs/babel-preset-react)
```
npm install --save-dev @babel/preset-react
```
```
//babel.config.js
{
  "presets": [
    [
      "@babel/preset-react",
      {
        "pragma": "dom", // default pragma is React.createElement
        "pragmaFrag": "DomFrag", // default is React.Fragment
        "throwIfNamespace": false // defaults to true
      }
    ]
  ]
}
```
![](http://fang.images.fangwenzheng.top/20191012145636.jpg)


## 2.2. `@babel/plugin-proposal-class-properties`
```
npm install --save-dev @babel/plugin-proposal-class-properties

//babel.config.js
{
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

## 2.3. 添加babel-loader中添加jsx
```
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
 ...
};
```

## 2.4. 引入react
```
npm install --save react react-dom
```

修改`index.js`
```
import React from 'react';
import ReactDOM from 'react-dom';

const title = 'My Minimal React Webpack Babel Setup';

ReactDOM.render(
  <div>{title}</div>,
  document.getElementById('app')
);
```

## 2.5. 配置热加载
```
npm install --save-dev react-hot-loader
```

修改`webpack.config.js`
```

const webpack = require('webpack');

module.exports = {
  ...
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
  ...
};
```

修改`index.js`
```
import React from 'react';
import ReactDOM from 'react-dom';

const title = 'My Minimal React Webpack Babel Setup';

ReactDOM.render(
  <div>{title}</div>,
  document.getElementById('app')
);

+ module.hot.accept();
```

## 2.6. 引入ant

```
npm install antd --save
```

```
  // src/App.js
  import React, { Component } from 'react';
- import Button from 'antd/es/button';
+ import { Button } from 'antd';
  import './App.css';

  class App extends Component {
    render() {
      return (
        <div className="App">
          <Button type="primary">Button</Button>
        </div>
      );
    }
  }

  export default App;
```
自定义antd主题
```
// webpack.config.js
module.exports = {
  rules: [{
    test: /\.less$/,
    use: [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader', // translates CSS into CommonJS
    }, {
      loader: 'less-loader', // compiles Less to CSS
+     options: {
+       modifyVars: {
+         'primary-color': '#1DA57A',
+         'link-color': '#1DA57A',
+         'border-radius-base': '2px',
+         // or
+         'hack': `true; @import "${path.resolve('./src')}\\ant-theme.less";`, // Override with less file
+       },
+       javascriptEnabled: true,
+     },
    }],
    // ...other rules
  }],
  // ...other config
}
```
`ant-theme.less`
```
@primary-color: #1890ff; // 全局主色
@link-color: #1890ff; // 链接色
@success-color: #52c41a; // 成功色
@warning-color: #faad14; // 警告色
@error-color: #f5222d; // 错误色
@font-size-base: 14px; // 主字号
@heading-color: rgba(0, 0, 0, 0.85); // 标题色
@text-color: rgba(0, 0, 0, 0.65); // 主文本色
@text-color-secondary : rgba(0, 0, 0, .45); // 次文本色
@disabled-color : rgba(0, 0, 0, .25); // 失效色
@border-radius-base: 4px; // 组件/浮层圆角
@border-color-base: #d9d9d9; // 边框色
@box-shadow-base: 0 2px 8px rgba(0, 0, 0, 0.15); // 浮层阴影
```

5. 添加react-router
```
npm install --save react-router-dom
```

## 2.7. React.lazy() 和 Suspense

[参考文章](http://www.ptbird.cn/react-lazy-suspense-error-boundaries.html)

`React.lazy()`

动态 import 主要应用场景是延迟加载方法，对于组件来说，并不是很适用，但是 React.lazy 对于组件的加载则是有比较大的帮助。
> 目前明确指出，React.lazy 和 suspense 并不适用于服务端渲染

之前代码
```
import OtherComponent from './OtherComponent';

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```
之后：
```
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

### 2.7.1. Suspense ##
```
import React, { Component, Suspense } from 'react';
```

既然是延迟加载，就会有一个加载过程，之前在渲染的时候，我们基本都是自顶一个一个 `<Loading>` 组件，然后通过变量控制进行操作，如果加载完成，则取消掉 `<Loading>` 组件。

如果直接使用 `React.lazy`，会报错误：需要一个 `placeholder ui`
![](http://fang.images.fangwenzheng.top/20191014155626.png)
既然是延迟加载，就一定会有一个`loading`的过程，而 `Suspense` 正是完成这个过程。

### 2.7.2. 在组件中使用错误边界 ##
```
import React, {Component} from 'react';

class Error extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }
  
  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }  
}

export default Error;

```

```
//app.js

<Error>
    <Suspense fallback={<div>Loading...</div>}>
        <Switch>
            <Redirect from="/" exact to="/food" />
            <Route path="/food" component={Food} />
            <Route path="/wiki" component={Wiki} />
            <Route path="/profile" component={Profile} />
            <Route component={Page404} />
        </Switch>
    </Suspense>
</Error
```

```
//Wiki.js

render() {
  throw new Error('I crashed!');
  return (
    <div>
      <p>{this.state.title}</p>
    </div>
  );
}
```

![](http://fang.images.fangwenzheng.top/20191014162254.png)


# 3. 添加redux
[https://redux.js.org/basics/example](https://redux.js.org/basics/example)
```
npm install redux --S
npm install react-redux --S
```

## 3.1. 使用装饰器模式

[https://babeljs.io/docs/en/babel-plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators)
```
npm install --save-dev @babel/plugin-proposal-decorators
```
Add the following line to your .babelrc file:

If you are including your plugins manually and using @babel/plugin-proposal-class-properties, make sure that @babel/plugin-proposal-decorators comes before @babel/plugin-proposal-class-properties.

When using the legacy: true mode, @babel/plugin-proposal-class-properties must be used in loose mode to support the @babel/plugin-proposal-decorators.
```
{
  "plugins": [
    "@babel/plugin-proposal-decorators",
    "@babel/plugin-proposal-class-properties"
  ]
}

//or 

{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ]
}
```

```
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import Todo from '../components/Todo'

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed)
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed)
        case 'SHOW_ALL':
        default:
            return todos
    }
}

const mapStateToProps = state => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTodoClick: id => {
            dispatch(toggleTodo(id))
        }
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class VisibleTodoList extends Component {
    render() {
        return (
            <ul>
                {this.props.todos.map(todo => (
                    <Todo key={todo.id} {...todo} onClick={() => this.props.onTodoClick(todo.id)} />
                ))}
            </ul>
        );
    }
}
```

## 3.2. 添加redux-devtools

[https://github.com/zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)
```
let store = createStore(todoApp, /* preloadedState, */
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
```

## 3.3. 添加链式取值插件

[@babel/plugin-proposal-optional-chaining](https://babeljs.io/docs/en/next/babel-plugin-proposal-optional-chaining)
```
npm install --save-dev @babel/plugin-proposal-optional-chaining

//babel.config.js
{
  "plugins": ["@babel/plugin-proposal-optional-chaining"]
}
```