

## Action

`Action` 是把数据从应用（译者注：这里之所以不叫 `view` 是因为这些数据有可能是服务器响应，用户输入或其它非 `view` 的数据 ）传到 `store` 的有效载荷。它是 `stor`e 数据的唯一来源。一般来说你会通过 `store.dispatch()` 将 `action` 传到 `store`。










## Reducer

`Reducers` 指定了应用状态的变化如何响应 `actions` 并发送到 `store` 的，记住 `actions` 只是描述了有事情发生了这一事实，并没有描述应用如何更新 `state`。







## Store

- 提供 getState() 方法获取 state；
- 提供 dispatch(action) 方法更新 state；
- 通过 subscribe(listener) 注册监听器，返回的函数注销监听器；

























# 参考文章

[https://www.redux.org.cn/docs/introduction/ThreePrinciples.html](https://www.redux.org.cn/docs/introduction/ThreePrinciples.html)