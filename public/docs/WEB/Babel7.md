[toc]

本文适用版本
```
"@babel/core": "^7.4.4",
"@babel/plugin-transform-runtime": "^7.4.4",
"@babel/preset-env": "^7.4.5",
"@babel/runtime": "^7.4.5",
"@babel/runtime-corejs2": "^7.4.5",
"@babel/runtime-corejs3": "^7.4.5",
"babel-loader": "^8.0.6",
"core-js": "^3.1.4",
"regenerator-runtime": "^0.13.2",
"webpack": "^4.17.1",
"webpack-cli": "^3.1.0"
```

<!-- more -->


# 1. `Babel7` 安装设置

## 1.1. 什么是 `babel`
babel 把 JavaScript 中 es2015/2016/2017/2046 的新语法转化为 es5，让低端运行环境(如浏览器和 node )能够认识并执行。

## 1.2. 运行方式
babel 总共分为三个阶段：解析，转换，生成。

babel 本身不具有任何转化功能，它把转化的功能都分解到一个个 plugin 里面。因此当我们不配置任何插件时，经过 babel 的代码和输入是相同的。

### 1.2.1. `Plugin`

语法插件(@babel/parser):使得 babel 能够解析更多的语法。

转译插件:源码转换并输出。
### 1.2.2. `Preset`

preset即一组官方推荐的预设插件的集合。目前推荐使用@babel/preset-env。

- Plugin 和 Preset 执行顺序
- Plugin 会运行在 Preset 之前。
- Plugin 会从前到后顺序执行。
- Preset 的顺序则 刚好相反(从后向前)。
### 1.2.3. `browserslist`

browserslist 是在不同的前端工具之间共用目标浏览器和 node 版本的配置工具,中文参阅。浏览器特性支持可查询caniuse。

eg:package.json
```
"browserslist": [
  "last 1 version",
  "> 1%",
  "maintained node versions",
  "not dead"
]
```
### 1.2.4. 各 `babel` 包介绍

#### 1.2.4.1. `@babel/core`
babel的编译核心包，内置 helpers 插件模块，是语法转换的主要辅助工具，所谓babel版本多少就是指这个包的版本多少。

#### 1.2.4.2. `babel-loader`
webpack中使用babel加载文件。

#### 1.2.4.3. `@babel/preset-env`

[文档查阅](https://babeljs.io/docs/en/next/babel-preset-env)

1. `@babel/preset-env`是一个智能预设，集合了一系列常用插件，会根据browserslist设置的目标浏览器，自动将代码中的新特性转换成目标浏览器支持的代码。
2. 默认的`@babel/preset-env`是无法转换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法(比如 Object.assign)都不会转码。需要根据需要添加core-js包和regenerator-runtime包支持。
```
npm i core-js egenerator-runtime
```

`babel.config.js`配置:
```
module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not dead']
        },
        modules: false, //取值可以是 amd, umd, systemjs, commonjs 和 false,为false时可以用于webpack做tree shaking。
        useBuiltIns: 'usage', // usage-按需引入 entry-入口引入（代码里需手动引入core-js） false-不引入
        corejs: 3 // 2-corejs@2  3-corejs@3
      }
    ]
  ]
};
```
#### 1.2.4.4. `core-js`

JavaScript 标准库的 polyfill，目前提供 core-js，core-js-pure，core-js-bundle 3 个版本。
可直接项目里引用各种 polyfill。
```
// polyfill all `core-js` features:
import 'core-js';
// polyfill only stable `core-js` features - ES and web standards:
import 'core-js/stable';
```
1. regenerator-runtime
2. regenerator-runtime 模块来自 facebook 的 regenerator 模块。
生成器函数、async、await 函数经 babel 编译后，regenerator-runtime 模块用于提供功能实现。
[源码查阅](https://www.iteye.com/blog/schifred-2369320)

#### 1.2.4.5. `@babel/polyfill`

babel7.4 版本已废弃，因为他仅仅依赖了core-js和regenerator-runtime,安装这两个就可以了。

#### 1.2.4.6. `@babel/runtime/@babel/runtime-corejs2/@babel/runtime-corejs3`
1. @babel/runtime提供 helpers 函数，并会去安装regenerator-runtime包，只做语法转换(helpers 和 regenerator)， 没有新 api 的实现。
2. @babel/runtime-corejs2包含@babel/runtime的全部并额外安装core-js@2
3. @babel/runtime-corejs3包含@babel/runtime的全部并额外安装core-js-pure@3
4. 相比之下@babel/runtime-corejs3支持更多，包括实例，api 等。
5. 三者均需要与@babel/plugin-transform-runtime搭配使用（但@babel/plugin-transform-runtime不一定要和他们用）。
```
module.exports = {
  presets: ['@babel/env'],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3 //为false就安装 npm i @babel/runtime,为2就安装@babel/runtime-corejs2，为3就安装@babel/runtime-corejs3
      }
    ]
  ]
};
```
@babel/plugin-transform-runtime
对 Babel 编译过程中产生的 helper 方法进行重新利用(聚合)，以达到减少打包体积的目的.
避免全局补丁污染，对打包过的 bundler 提供”沙箱”式的补丁。
文档查阅

# 2. 总结

> 首先要确认，`@babel/polyfill` 和 `@babel/plugin-transform-runtime` 各自都可以完成 `ES` 新 `API` 的转译，`ES` 新语法是由 `@babel/preset-env` 完成转译，所以，`@babel/polyfill`、`@babel/plugin-transform-runtime` 都需各自搭配 `@babel/preset-env` 一起使用。翻阅、参考了大量资料，并在实际生产开发中验证，二者的配置、原理总结如下：

## 2.1. useBuiltIns

1. `useBuiltIns` 设置为 `entry` 比较不错，推荐使用。
在js代码第一行 `import '@babel/polyfill'`，或在 `webpack` 的入口 `entry` 中写入模块 `@babel/polyfill`，会将 `browserslist` 环境不支持的所有垫片都导入；
能够覆盖到 `‘hello‘.includes(‘h‘)`这种句法，足够安全且代码体积不是特别大！
2. `useBuiltIns` 设置为 `usage`。
项目里不用主动 `import`，会自动将代码里已使用到的、且 `browserslist` 环境不支持的垫片导入；
相对安全且打包的js体积不大，但是，通常我们转译都会排除 `node_modules/` 目录，如果使用到的第三方包有个别未做好ES6转译，有遇到bug的可能性，并且检测不到 `‘hello‘.includes(‘h‘)` 这种句法。
代码书写规范，且信任第三方包的时候，可以使用！
3. `useBuiltIns` 设置为 `false` 比较不错。
在js代码第一行 `import '@babel/polyfill'`，或在 `webpack` 的入口 `entry` 中写入模块@babel/polyfill，会将 `@babel/polyfill`整个包全部导入；
最安全，但打包体积会大一些，一般不选用。

## 2.2. @babel/preset-env + @babel/polyfill

```
yarn add babel-loader@8 @babel/core @babel/preset-env -D
yarn add @babel/polyfill
```
```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false, // 推荐
        "useBuiltIns": "entry", // 推荐
        "corejs": 3, // 新版本的@babel/polyfill包含了core-js@2和core-js@3版本，所以需要声明版本，否则webpack运行时会报warning，此处暂时使用core-js@3版本
      }
    ]
  ],
  "plugins": []
}
```
入口文件中导入 `import '@babel/polyfill'`

## 2.3. 使用 corejs+useBuiltIns

npm 安装：
```
npm i @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
npm i core-js regenerator-runtime
````
babel.config.js 配置：
```
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not dead']
        },
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ],
  plugins: [['@babel/plugin-transform-runtime']]
};
```
- 该方案支持所有，包括转译语法，API 及实例方法的 polyfill。
- 该方案会污染全局。

## 2.4. 使用 runtime-corejs3(最佳)

npm 安装：
```
npm i @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
npm i @babel/runtime-corejs3
```
`babel.config.js` 配置：
```
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not dead']
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


# 3. 参考文章

[https://blog.flqin.com/350.html](https://blog.flqin.com/350.html)

[https://segmentfault.com/a/1190000020237790?utm_source=tag-newest](https://segmentfault.com/a/1190000020237790?utm_source=tag-newest)