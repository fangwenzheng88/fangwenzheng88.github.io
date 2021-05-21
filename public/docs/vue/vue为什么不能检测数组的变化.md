### 前言

`Vue2.0`对于响应式数据的实现有一些不足：

- 无法检测数组/对象的新增
- 无法检测通过索引改变数组的操作。

`Vue2.0`中响应式数据是通过`Object.defineProperty`实现，因此无法检测数组/对象的新增，但为什么无法检测到通过索引改变数组的操作呢？也是因为`Object.defineProperty`的原因么？
[官方文档](https://cn.vuejs.org/v2/guide/list.html#注意事项)中对于这两点都是简要的概括为“由于`JavaScript`的限制”无法实现，而`Object.defineProperty`是实现检测数据改变的方案，那这个限制是指`Object.defineProperty`吗？

### 无法检测数组的索引变化？

我们来测试一下看看。以下例子，对遍历数组中的每一项，用`Object.defineProperty`对其进行监测

```javascript
function defineReactive(data, key, value) {
	 Object.defineProperty(data, key, {
		 enumerable: true,
		 configurable: true,
		 get: function defineGet() {
			 console.log(`get key: ${key} value: ${value}`)
			 return value
		 },
		 set: function defineSet(newVal) {
			 console.log(`set key: ${key} value: ${newVal}`)
			 value = newVal
		 }
	 })
}
 
function observe(data) {
	Object.keys(data).forEach(function(key) {
		defineReactive(data, key, data[key])
	})
}
 
let arr = [1, 2, 3]
observe(arr)
```

> 说明：`Vue`对数组的7个变异方法（`push、pop、shift、unshift、splice、sort、reverse`）实现了响应式，因此这里我们就不做测试了。

![img](http://fang.images.fangwenzheng.top/006tNbRwgy1gaqjvfoe08j307v02a0sn.jpg)

通过索引改变`arr[1]`，可以发现触发了`set`，也就是`Object.defineProperty`是可以检测到通过索引改变数组的操作的，那`Vue2.0`为什么没有实现呢？
一位开发小哥在`github`对尤大大提了[issue](https://github.com/vuejs/vue/issues/8562)，回答如下：

<img src="http://fang.images.fangwenzheng.top/006tNbRwgy1gaqk0orjnqj30hq0njdjl.jpg" alt="img" style="zoom:80%;" />

尤大大回答是因为性能问题。看来不是JavaScript的锅，更不是`Object.defineProperty`的锅了。

### 验证

通过我们上面的测试，`Object.property`是可以检测到通过索引改变数组的操作的，而Vue没有实现。那我们看看源码，`Vue`的实现逻辑是怎样的?

<img src="http://fang.images.fangwenzheng.top/006tNbRwgy1gaqk76f1flj30rg0x4q94.jpg" alt="img" style="zoom:50%;" />

我们改下对数组的操作逻辑，遍历数组对每一项采用`Object.defineProperty`进行检测

<img src="http://fang.images.fangwenzheng.top/006tNbRwgy1gaqkexnwhnj30og0rkjvp.jpg" alt="img" style="zoom:50%;" />

<img src="http://fang.images.fangwenzheng.top/006tNbRwgy1gaqkg9a3fqj313s0h6gnq.jpg" alt="img" style="zoom:50%;" />

此时点击按钮2，可以发现数值改变为0了，说明通过索引改变arr的操作被检测到了，`Vue`是可以实现的！我们进一步确认下：

<img src="http://fang.images.fangwenzheng.top/006tNbRwgy1gaqkjiqovmj30rm0wk7ar.jpg" alt="img" style="zoom:50%;" />

在`defineReactive`的`Object.defineProperty`的set中，加一行`console.log`，可以发现，当点击按钮2时，控制台会输出“set 0”，更加确切的说明`arr[index]=0`被`set`检测到了。



**参考：**

- [为什么Vue3.0使用Proxy实现数据监听(defineProperty表示不背这个锅)](https://www.jb51.net/article/171869.htm)
- [记一次思否问答的问题思考：Vue为什么不能检测数组变动](https://segmentfault.com/a/1190000015783546#comment-area)

