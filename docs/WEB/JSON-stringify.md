[toc]

# 1. 总结

## 1.1. `JSON.stringify()` 九大特性：

* `undefined`、任意的函数以及 `symbol` 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 `null`（出现在数组中时）。函数、`undefined` 被单独转换时，会返回 `undefined`，如`JSON.stringify(function(){})` or `JSON.stringify(undefined)`.
* 非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中。
* 转换值如果有 `toJSON()` 方法，该方法定义什么值将被序列化。
* `Date` 日期调用了 `toJSON()` 将其转换为了 `string` 字符串（同`Date.toISOString()`），因此会被当做字符串处理。
* `NaN` 和 `Infinity` 格式的数值及 `null` 都会被当做 `null`。
* 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
* 其他类型的对象，包括 `Map/Set/WeakMap/WeakSet`，仅会序列化可枚举的属性。
* 所有以 `symbol` 为属性键的属性都会被完全忽略掉，即便 `replacer` 参数中强制指定包含了它们。
* 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。

<!-- more -->

# 2. `JSON.stringify()` 九大特性

## 2.1. `JSON.stringify()`第一大特性

### 2.1.1. 对于`undefined`、任意的函数以及 `symbol` 三个特殊的值作为对象属性的值

```  
const data = {
    a: "aaa",
    b: undefined,
    c: Symbol("dd"),
    fn: function() {
    return true;
    }
};
JSON.stringify(data); // 输出：？

// "{"a":"aaa"}"
```
* `undefined`、任意的函数以及 `symbol` 作为对象属性值时 `JSON.stringify()` 将跳过（忽略）对它们进行序列化

### 2.1.2. `undefined`、任意的函数以及 `symbol` 值作为数组元素

```
JSON.stringify(["aaa", undefined, function aa() {
    return true
    }, Symbol('dd')])  // 输出：？

// "["aaa",null,null,null]"
```
* `undefined`、任意的函数以及 `symbol` 作为数组元素值时，`JSON.stringify()` 会将它们序列化为 `null`

### 2.1.3. `undefined`、任意的函数以及 `symbol` 单独处理

```
JSON.stringify(function a (){console.log('a')})
// undefined
JSON.stringify(undefined)
// undefined
JSON.stringify(Symbol('dd'))
// undefined
```

单独转换的结果就是：

  * `undefined`、任意的函数以及 `symbol` 被 `JSON.stringify()` 作为单独的值进行序列化时都会返回 `undefined`

### 2.1.4. `JSON.stringify()` 第一大特性总结

  * `undefined`、任意的函数以及 `symbol` 作为对象属性值时 `JSON.stringify()` 对跳过（忽略）它们进行序列化

  * `undefined`、任意的函数以及 `symbol` 作为数组元素值时，`JSON.stringify()` 将会将它们序列化为 `null`

  * `undefined`、任意的函数以及 `symbol` 被 `JSON.stringify()` 作为单独的值进行序列化时，都会返回 `undefined`

## 2.2. `JSON.stringify()` 第二大特性

  * 非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中。

```
const data = {
    a: "aaa",
    b: undefined,
    c: Symbol("dd"),
    fn: function() {
    return true;
    },
    d: "ddd"
};
JSON.stringify(data); // 输出：？
// "{"a":"aaa","d":"ddd"}"

JSON.stringify(["aaa", undefined, function aa() {
    return true
    }, Symbol('dd'),"eee"])  // 输出：？

// "["aaa",null,null,null,"eee"]"
```

正如我们在第一特性所说，`JSON.stringify()` 序列化时会忽略一些特殊的值，所以不能保证序列化后的字符串还是以特定的顺序出现（数组除外）。

## 2.3. `JSON.stringify()` 第三大特性

  * 转换值如果有 `toJSON()` 函数，该函数返回什么值，序列化结果就是什么值，并且忽略其他属性的值。

``` 
JSON.stringify({
    say: "hello JSON.stringify",
    toJSON: function() {
        return "today i learn";
    }
})
// "today i learn"
```

## 2.4. `JSON.stringify()`第四大特性

  * `JSON.stringify()` 将会正常序列化 `Date` 的值。

```        
JSON.stringify({ now: new Date() });
// "{"now":"2019-12-08T07:42:11.973Z"}"
```

实际上 `Date` 对象自己部署了 `toJSON()` 方法（同Date.toISOString()），因此 `Date` 对象会被当做字符串处理。

## 2.5. `JSON.stringify()` 第五大特性

  * `NaN` 和 `Infinity` 格式的数值及 `null` 都会被当做 `null`。

直接上代码：

```
JSON.stringify(NaN)
// "null"
JSON.stringify(null)
// "null"
JSON.stringify(Infinity)
// "null"
```

## 2.6. `JSON.stringify()` 第六大特性

关于基本类型的序列化：

  * 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。

```        
JSON.stringify([new Number(1), new String("false"), new Boolean(false)]);
// "[1,"false",false]"
```

## 2.7. `JSON.stringify()` 第七大特性

关于对象属性的是否可枚举：

  * 其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性。

```        
// 不可枚举的属性默认会被忽略：
JSON.stringify( 
    Object.create(
        null, 
        { 
            x: { value: 'json', enumerable: false }, 
            y: { value: 'stringify', enumerable: true } 
        }
    )
);
// "{"y":"stringify"}"
```

## 2.8. `JSON.stringify()` 第八大特性

我们都知道实现深拷贝最简单粗暴的方式就是序列化：`JSON.parse(JSON.stringify())`，这个方式实现深拷贝会因为序列化的诸多特性从而导致诸多的坑点：比如现在我们要说的循环引用问题。

```
// 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。 
const obj = {
    name: "loopObj"
};
const loopObj = {
    obj
};
// 对象之间形成循环引用，形成闭环
obj.loopObj = loopObj;
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
deepClone(obj)
/**
    VM44:9 Uncaught TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    |     property 'loopObj' -> object with constructor 'Object'
    --- property 'obj' closes the circle
    at JSON.stringify (<anonymous>)
    at deepClone (<anonymous>:9:26)
    at <anonymous>:11:13
    */
```

  * 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。

这也就是为什么用序列化去实现深拷贝时，遇到循环引用的对象会抛出错误的原因。

## 2.9. `JSON.stringify()` 第九大特性

  * 所有以 `symbol` 为属性键的属性都会被完全忽略掉，即便 `replacer` 参数中强制指定包含了它们。

```        
JSON.stringify({ [Symbol.for("json")]: "stringify" }, function(k, v) {
    if (typeof k === "symbol") {
        return v;
    }
})

// undefined
```

# 3. 第二个参数和第三个参数

## 3.1. `replacer`

`replacer` 参数可以是一个函数或者一个数组。作为函数，它有两个参数，键（key）和值（value），它们都会被序列化。

在开始时, `replacer` 函数会被传入一个空字符串作为 `key` 值，代表着要被 `stringify` 的这个对象。随后每个对象或数组上的属性会被依次传入。 

函数应当返回JSON字符串中的value, 如下所示:
* 如果返回一个 `Number`, 转换成相应的字符串作为属性值被添加入 `JSON` 字符串。
* 如果返回一个 `String`, 该字符串作为属性值被添加入 `JSON` 字符串。
* 如果返回一个 `Boolean`, `"true"` 或者 `"false"` 作为属性值被添加入 `JSON` 字符串。
* 如果返回任何其他对象，该对象递归地序列化成 `JSON` 字符串，对每个属性调用 `replacer` 方法。除非该对象是一个函数，这种情况将不会被序列化成 `JSON` 字符串。
* 如果返回 `undefined`，该属性值不会在 `JSON` 字符串中输出。

📢 注意: 不能用 `replacer` 方法，从数组中移除值（`values`），如若返回 `undefined` 或者一个函数，将会被 `null` 取代。

### 3.1.1. `replacer` 作为函数时

#### 3.1.1.1. 可以打破九大特性的大多数特性

第二个参数 `replacer` 非常强大， `replacer` 作为函数时，我们可以打破九大特性的大多数特性，我们直接来看代码吧。

``` 
const data = {
    a: "aaa",
    b: undefined,
    c: Symbol("dd"),
    fn: function() {
    return true;
    }
};
// 不用 replacer 参数时
JSON.stringify(data); 

// "{"a":"aaa"}"
// 使用 replacer 参数作为函数时
JSON.stringify(data, (key, value) => {
    switch (true) {
    case typeof value === "undefined":
        return "undefined";
    case typeof value === "symbol":
        return value.toString();
    case typeof value === "function":
        return value.toString();
    default:
        break;
    }
    return value;
})
// "{"a":"aaa","b":"undefined","c":"Symbol(dd)","fn":"function() {\n    return true;\n  }"}"
```

虽然使用 `toString()` 方法有点耍流氓的意思但是不得不说第二个参数很强大。

#### 3.1.1.2. 传入 `replacer` 函数的第一个参数

**需要注意的是，replacer 被传入的函数时，第一个参数不是对象的第一个键值对，而是空字符串作为 key 值，value 值是整个对象的键值对：**

```
const data = {
    a: 2,
    b: 3,
    c: 4,
    d: 5
};
JSON.stringify(data, (key, value) => {
    console.log(value);
    return value;
})
// 第一个被传入 replacer 函数的是 {"":{a: 2, b: 3, c: 4, d: 5}}
// {a: 2, b: 3, c: 4, d: 5}   
// 2
// 3
// 4
// 5
    
```

### 3.1.2. `replacer` 作为 `array`

如果 `replacer` 是一个数组，数组的值代表将被序列化成 JSON 字符串的属性名。

```        
JSON.stringify(foo, ['week', 'month']);  
// '{"week":45,"month":7}', 只保留 “week” 和 “month” 属性值。
```

## 3.2. space 参数

`space` 参数用来控制结果字符串里面的间距。如果是一个数字, 则在字符串化时每一级别会比上一级别缩进多这个数字值的空格（最多10个空格）；如果是一个字符串，则每一级别会比上一级别多缩进该字符串（或该字符串的前10个字符）。

```       
JSON.stringify({ uno: 1, dos : 2 }, null, '\t')
// '{            \
//     "uno": 1, \
//     "dos": 2  \
// }' 
```

```       
JSON.stringify({ uno: 1, dos : 2 }, null, '\n')
// '{\n "a": 2\n}'
```


