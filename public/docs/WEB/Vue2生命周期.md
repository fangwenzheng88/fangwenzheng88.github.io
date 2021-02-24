[toc]

# 1. Vue生命周期

[vue生命周期图](https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA)

![https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA](http://fang.images.fangwenzheng.top/vue生命周期20200121145102.png)

## 1.1. beforeCreate: Function

在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。

此阶段为实例初始化之后，this指向创建的实例，此时的数据观察事件机制都未形成，不能获得DOM节点。

data，computed，watch，methods 上的方法和数据均不能访问。

## 1.2. created: Function

在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前尚不可用。

此阶段为实例已经创建，完成数据（data、props、computed）的初始化导入依赖项。
可访问 data computed watch methods 上的方法和数据。

初始化完成时的事件写在这里，异步请求也适宜在这里调用（请求不宜过多，避免白屏时间太长）。

未挂载DOM，若在此阶段进行DOM操作一定要放在Vue.nextTick()的回调函数中。

## 1.3. beforeMount：挂载前

在挂载开始之前被调用：相关的 render 函数首次被调用。

虽然得不到具体的DOM元素，但vue挂载的根节点已经创建，下面vue对DOM的操作将围绕这个根元素继续进行。

beforeMount这个阶段是过渡性的，一般一个项目只能用到一两次。


## 1.4. mounted: Function

实例被挂载后调用，这时 el 被新创建的 vm.$el 替换了。 如果根实例挂载到了一个文档内的元素上，当mounted被调用时vm.$el也在文档内。

注意 mounted 不会保证所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以在 mounted 内部使用 vm.$nextTick：

挂载，完成创建vm.$el，和双向绑定

## 1.5. beforeUpdate: Function

数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。


## 1.6. updated: Function

由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或 watcher 取而代之。

注意 updated 不会保证所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以在 updated 里使用 vm.$nextTick：

## 1.7. activated: Function

被 keep-alive 缓存的组件激活时调用。

## 1.8. deactivated: Function

被 keep-alive 缓存的组件停用时调用。


## 1.9. beforeDestroy: Function

实例销毁之前调用。在这一步，实例仍然完全可用。

## 1.10. destroyed: Function

实例销毁后调用。该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。