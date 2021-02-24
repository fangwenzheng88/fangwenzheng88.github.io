[toc]

# 1. JavaScript数据类型
**[ECMAScript](http://www.ecma-international.org/ecma-262/9.0/index.html)标准规定了7种数据类型，其把这7种数据类型又分为两种：原始类型和对象类型。**
- `Null`：只包含一个值：`null`
- `Undefined`：只包含一个值：`undefined`
- `Boolean`：包含两个值：`true`和`false`
- `Number`：整数或浮点数，还有一些特殊值（`-Infinity`、`+Infinity`、`NaN`）
- `String`：一串表示文本值的字符序列
- `Symbol`：一种实例是唯一且不可改变的数据类型

(在es10中加入了第七种原始类型BigInt，现已被最新Chrome支持)
对象类型

- `Object`：自己分一类丝毫不过分，除了常用的`Object`，`Array`、`Function`等都属于特殊的对象

## 1.1. 原始类型
上面所提到的原始类型，在`ECMAScript`标准中，它们被定义为`primitive values`，即原始值，代表值本身是==不可被改变==的。

以字符串为例，我们在调用操作字符串的方法时，没有任何方法是可以直接改变字符串的：

## 1.2. 引用类型
- 存储的值大小不定，可动态调整
- 空间较大，运行效率低
- 无法直接操作其内部存储，使用引用地址读取
- 通过代码进行分配空间

相对于上面具有不可变性的原始类型，我习惯把对象称为引用类型，引用类型的值实际存储在堆内存中，它在栈中只存储了一个固定长度的地址，这个地址指向堆内存中的值。


# 2. 类型转换

因为JavaScript是弱类型的语言，所以类型转换发生非常频繁，上面我们说的装箱和拆箱其实就是一种类型转换。

类型转换分为两种，隐式转换即程序自动进行的类型转换，强制转换即我们手动进行的类型转换。

强制转换这里就不再多提及了，下面我们来看看让人头疼的可能发生隐式类型转换的几个场景，以及如何转换：

## 2.1. 类型转换规则
![](http://fang.images.fangwenzheng.top/20191011103108.png)

## 2.2. if语句和逻辑语句
在if语句和逻辑语句中，如果只有单个变量，会先将变量转换为`Boolean`值，只有下面几种情况会转换成`false`，其余被转换成`true`：
```
null
undefined
''
NaN
0
false
```

## 2.3. 各种运数学算符
我们在对各种非`Number`类型运用数学运算符`(- * /)`时，会先将非`Number`类型转换为`Number`类型;

```
1 - true // 0
1 - null //  1
1 * undefined //  NaN
2 * ['5'] //  10
```
注意`+`是个例外，执行`+`操作符时：
1. 当一侧为`String`类型，被识别为字符串拼接，并会优先将另一侧转换为字符串类型。
2. 当一侧为`Number`类型，另一侧为原始类型，则将原始类型转换为`Number`类型。
3. 当一侧为`Number`类型，另一侧为引用类型，将引用类型和`Number`类型转换成字符串后拼接。

```
123 + '123' // 123123   （规则1）
123 + null  // 123    （规则2）
123 + true // 124    （规则2）
123 + {}  // 123[object Object]    （规则3）
```

## 2.4. ==
使用`==`时，若两侧类型相同，则比较结果和`===`相同，否则会发生隐式转换，使用`==`时发生的转换可以分为几种不同的情况（只考虑两侧类型不同）：

1. **NaN**

`NaN`和其他任何类型比较永远返回`false`(包括和他自己)。
```
NaN == NaN // false
```

2. **Boolean**

`Boolean`和其他任何类型比较，`Boolean`首先被转换为`Number`类型。
```
true == 1  // true 
true == '2'  // false
true == ['1']  // true
true == ['2']  // false
```
> 这里注意一个可能会弄混的点：`undefined`、`null`和`Boolean`比较，虽然`undefined`、`null`和`false`都很容易被想象成假值，但是他们比较结果是`false`，原因是`false`首先被转换成`0`：
```
undefined == false // false
null == false // false
```

3. **String和Number**

`String`和`Number`比较，先将`String`转换为`Number`类型。
```
123 == '123' // true
'' == 0 // true
```

4. **null和undefined**

`null == undefined`比较结果是`true`，除此之外，`null`、`undefined`和其他任何结果的比较值都为`false`。
```
null == undefined // true
null == '' // false
null == 0 // false
null == false // false
undefined == '' // false
undefined == 0 // false
undefined == false // false
```

5. **原始类型和引用类型**

当原始类型和引用类型做比较时，对象类型会依照`ToPrimitive`规则转换为原始类型:
```
'[object Object]' == {} // true
'1,2,3' == [1, 2, 3] // true
```

来看看下面这个比较：
```
[] == ![] // true
```
`!`的优先级高于`==`，`![]`首先会被转换为`false`，然后根据上面第二点，`false`转换成`Number`类型`0`，左侧`[]`转换为`0`，两侧比较相等。

所以，说了这么多，推荐使用`===`来判断两个值是否相等...


# 3. 类型判断

## 3.1. typeof
`typeof`操作符可以准确判断一个变量是否为下面几个原始类型：
```
typeof 'ConardLi'  // string
typeof 123  // number
typeof true  // boolean
typeof Symbol()  // symbol
typeof undefined  // undefined
typeof function(){}  // function

typeof [] // object
typeof {} // object
typeof new Date() // object
typeof /^\d*$/; // object

typeof null //object //JavaScript初版就流传下来的bug
```

## 3.2. instanceof
`instanceof`操作符可以帮助我们判断 ==引用类型== 具体是什么类型的对象：
```
[] instanceof Array // true
new Date() instanceof Date // true
new RegExp() instanceof RegExp // true
```

## 3.3. toString
![](http://fang.images.fangwenzheng.top/20191011112625.png)




# 4. 参考文章

[https://juejin.im/post/5cec1bcff265da1b8f1aa08f](https://juejin.im/post/5cec1bcff265da1b8f1aa08f)