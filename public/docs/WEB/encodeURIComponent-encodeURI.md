[toc]

统一资源标识符，或叫做 URI，是用来标识互联网上的资源（例如，网页或文件）和怎样访问这些资源的传输协议（例如，HTTP 或 FTP）的字符串。除了encodeURI、encodeURIComponent、decodeURI、decodeURIComponent四个用来编码和解码 URI 的函数之外 ECMAScript 语言自身不提供任何使用 URL 的支持。

<!-- more -->

# 1. URI的组成

URI 是 URN 和 URL 的统称，这里我们主要了解一下URL；

URL中可能由 `:
 / ; ? { } &`、英文字母、数组、中文字符等组成；而除了英文字母和数字以外，其他的字母都有可能被浏览器自动转码。

`: / ; ?` 是当作分隔符的保留字符。不能被 `encodeURI` 和 `decodeURI` 解析

![](http://fang.images.fangwenzheng.top/encodeURI.png)

# 2. 四个方法区别

`encodeURI` 和 `decodeURI` 函数操作的是完整的 `URI`；这俩函数假定 `URI` 中的任何保留字符都有特殊意义，所有不会编码它们。

```
encodeURI('http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor')

http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor
```

`encodeURIComponent` 和 `decodeURIComponent` 函数操作的是组成 URI 的个别组件；这俩函数假定任何保留字符都代表普通文本，所以必须编码它们，所以它们（保留字符）出现在一个完整 URI 的组件里面时不会被解释成保留字符了。

```
encodeURIComponent("http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor")

http%3A%2F%2Fusername%3Apassword%40www.example.com%3A80%2Fpath%2Fto%2Ffile.php%3Ffoo%3D316%26bar%3Dthis%2Bhas%2Bspaces%23anchor
```

## 3. encodeURIComponent

`encodeURIComponent()` 是对统一资源标识符（URI）的组成部分进行编码的方法。它使用一到四个转义序列来表示字符串中的每个字符的UTF-8编码（只有由两个Unicode代理区字符组成的字符才用四个转义字符编码）。

`encodeURIComponent` 转义除了`a-z A-Z 0-9 ( ) . ! ~ * ' - _`之外的所有字符

`encodeURI` 无法对10个保留字符 `; , / ? : @ & = + $` 和 `#` 转义。

对于 `application/x-www-form-urlencoded` (POST) 这种数据方式，空格需要被替换成 `+`，所以通常使用 `encodeURIComponent` 的时候还会把 "%20" 替换为 "+"。

为了更严格的遵循 [RFC 3986](https://tools.ietf.org/html/rfc3986)（它保留 `!, ', (, ), 和 *`），即使这些字符并没有正式划定 URI 的用途，下面这种方式是比较安全的：

```
function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}
```



## 4. encodeURI

[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURI](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)

`encodeURI()`  函数通过将特定字符的每个实例替换为一个、两个、三或四转义序列来对统一资源标识符 (URI) 进行编码 (该字符的 UTF-8 编码仅为四转义序列)由两个 "代理" 字符组成)。

## 4.1. 描述

假定一个URI是完整的URI，那么无需对那些保留的并且在URI中有特殊意思的字符进行编码。

```
http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor
```

`encodeURI` 会替换所有的字符，但不包括以下字符，即使它们具有适当的 `UTF-8` 转义序列：
```
encodeURI(";,/?:@&=+$-_.!~*'()#") // 原样输出 ;,/?:@&=+$-_.!~*'()#
```
类型 | 包含
- | -
保留字符 | `; , / ? : @ & = + $`
非转义的字符 | `a-z A-Z 0-9 - _ . ! ~ * ' ( )`
数字符号 | `#`

并且需要注意，如果URL需要遵循较新的 [RFC3986](https://tools.ietf.org/html/rfc3986) 标准，那么方括号是被保留的(给IPv6)，因此对于那些没有被编码的URL部分(例如主机)，可以使用下面的代码：

```
function fixedEncodeURI (str) {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}
```