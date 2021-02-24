[toc]

JavaScript中的运算符优先级是一套规则。该规则在计算表达式时控制运算符执行的顺序。具有较高优先级的运算符先于较低优先级的运算符执行。
<!-- more -->

# 1. 首先先了解下优先级(由高到低)

![](http://fang.images.fangwenzheng.top/20191107231454.png)

<details>
<summary>展开查看所有</summary>
<img src="http://fang.images.fangwenzheng.top/js操作符优先级002.png">
</details>

# 2. 例子

```
function foo() {
    getName = function () { console.log (1); };
    return this;
}
foo.getName = function () { console.log(2);};
foo.prototype.getName = function () { console.log(3);};
var getName = function () { console.log(4);};
function getName () { console.log(5);}
new foo.getName ();      // 第一种       
new foo().getName ();         // 第二种
new new foo().getName ();       // 第三种
```

- 第一种

new foo.getName (); '.'的优先级比new高

所以先执行foo.getName，在来执行new

也就是new (foo.getName) () // 返回一个foo.getName的实力 获得就是2

- 第二种

new foo().getName (); 主要犹豫的地方是先foo()函数运算还是先new

如果new 不带参数的优先级确实比函数调用的优先级低，但现在new是带参数的所有优先级
所以执行的 (new foo()).getName() // foo()上的getName方法，但是没有这个方法所以去原型上找,结果为3

- 第三种

new new foo().getName (); 从上面分析得，new带参数会优先执行，这是在从左至右的运算基础下实现的

也就是第一步new (new foo().getName)()

第二步 new ((new foo()).getName)()

最后进行运算 先计算new foo(), 在获取getName，在对获取内容进行new ()计算
new ((new foo()).getName)() 也就是 new (foo.prototype.getName)()
返回的就是3



