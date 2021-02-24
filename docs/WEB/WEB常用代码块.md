[toc]

# 保留小数点2位

## 四舍五入

### toFixed
`numObj.toFixed(digits)`

**参数**

    digits:小数点后数字的个数；介于0到20（包括）之间，实现环境可能支持更大范围。如果忽略该参数，则默认为 0。
    
**返回值**

    使用定点表示法表示给定数字的字符串。
    
**抛出异常**

    RangeError

    如果 digits 参数太小或太大。0 到 20（包括）之间的值不会引起 RangeError。实现环境（implementations）也可以支持更大或更小的值。

    TypeError
    
    如果该方法在一个非Number类型的对象上调用。

```
12345.6789.toFixed();         // 返回 "12346"：进行四舍五入，不包括小数部分
12345.6789.toFixed(1);        // 返回 "12345.7"：进行四舍五入
12345.6789.toFixed(6);        // 返回 "12345.678900"：用0填充
(1.23e+20).toFixed(2);    // 返回 "123000000000000000000.00"
(1.23e-10).toFixed(2);    // 返回 "0.00"
2.34.toFixed(1);          // 返回 "2.3"
2.35.toFixed(1)           // 返回 '2.4'. Note it rounds up
2.55.toFixed(1)           // 返回 '2.5'. Note it rounds down - see warning above
-2.34.toFixed(1);         // 返回 -2.3 （由于操作符优先级，负数不会返回字符串）
(-2.34).toFixed(1);       // 返回 "-2.3" （若用括号提高优先级，则返回字符串）

问题
chrome上
1.35.toFixed(1) // 1.4 正确
1.335.toFixed(2) // 1.33  错误
1.3335.toFixed(3) // 1.333 错误
1.33335.toFixed(4) // 1.3334 正确
1.333335.toFixed(5)  // 1.33333 错误
1.3333335.toFixed(6) // 1.333333 错误

IE上
```
## 不四舍五入

### 正则
```
Number(15.7784514000.toString().match(/^\d+(?:\.\d{0,2})?/)) // 15.77
Number(15.1.toString().match(/^\d+(?:\.\d{0,2})?/)) // 15.1
```

### 小数变整数

```
Math.floor(15.7784514000 * 100) / 100    // 输出结果为 15.77  
```

问题
```
Math.floor(8.54*100)/100 // 输出结果为 8.53
```

# 全屏/退出全屏

带来来自`viewer.js`源码

```
function requestFullscreen() {
  var document = this.element.ownerDocument;

  if (
    this.fulled &&
    !(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    )
  ) {
    var documentElement = document.documentElement; // Element.requestFullscreen()

    if (documentElement.requestFullscreen) {
      documentElement.requestFullscreen();
    } else if (documentElement.webkitRequestFullscreen) {
      documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (documentElement.mozRequestFullScreen) {
      documentElement.mozRequestFullScreen();
    } else if (documentElement.msRequestFullscreen) {
      documentElement.msRequestFullscreen();
    }
  }
}

function exitFullscreen() {
  var document = this.element.ownerDocument;

  if (
    this.fulled &&
    (document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement)
  ) {
    // Document.exitFullscreen()
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}
```

> `Node.ownerDocument` 只读属性会返回当前节点的顶层的 `document` 对象。
> `Document.documentElement` 是一个会返回文档对象（`document`）的根元素的只读属性（如`HTML`文档的 `<html>` 元素）。


## 金额添加分隔符
```
function milliFormat(num) {
    return num && num.toString()
        .replace(/\d+/, function(s){
             return s.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
         })
}
```

```
(12345678).toLocaleString("en-US") => "12,345,678"
```