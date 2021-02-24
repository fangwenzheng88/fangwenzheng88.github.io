[toc]

# React生命周期

[React16.4生命周期图](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

![](http://fang.images.fangwenzheng.top/20200422155943.png)

**挂载**

当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：

- [constructor()](https://zh-hans.reactjs.org/docs/react-component.html#constructor)
- [static getDerivedStateFromProps()](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromprops)
- [render()](https://zh-hans.reactjs.org/docs/react-component.html#render)
- [componentDidMount()](https://zh-hans.reactjs.org/docs/react-component.html#componentdidmount)


**更新**

当组件的 props 或 state 发生变化时会触发更新。组件更新的生命周期调用顺序如下：

- [static getDerivedStateFromProps()](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromprops)
- [shouldComponentUpdate()](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)
- [render()](https://zh-hans.reactjs.org/docs/react-component.html#render)
- [getSnapshotBeforeUpdate()](https://zh-hans.reactjs.org/docs/react-component.html#getsnapshotbeforeupdate)
- [componentDidUpdate()](https://zh-hans.reactjs.org/docs/react-component.html#componentdidupdate)


**卸载**

当组件从 DOM 中移除时会调用如下方法：

- [componentWillUnmount()](https://zh-hans.reactjs.org/docs/react-component.html#componentwillunmount)


**错误处理**

当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：

- [static getDerivedStateFromError()](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromerror)
- [componentDidCatch()](https://zh-hans.reactjs.org/docs/react-component.html#componentdidcatch)




