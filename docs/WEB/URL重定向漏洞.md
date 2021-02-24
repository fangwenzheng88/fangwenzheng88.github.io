[toc]
# URI

> URI 的格式由 URI 协议名（例如 http, ftp, mailto, file），一个冒号，和协议对应的内容组成。特定的协议定义了协议内容的语法和语义，而所有的协议都必须遵循一定的 URI 文法通用规则。URI 文法同时也就各种原因对协议内容加以其他的限制，例如，保证各种分层协议之间的协同性。百分号编码也为 URI 提供了附加信息。

```
[协议]://[用户名]:[密码]@[主机名]:[端口]/[路径]?[查询参数]#[片段 ID]
```

![](http://fang.images.fangwenzheng.top/20200426144503.png)


## @符号绕过

```
http://www.xxx.com?url=http://test.com@fishing.com
```

此时`test.com`被浏览器识别为`username`，浏览器`hostname`实际为`fishing.com`，如果只验证了`url.startsWith('http://test.com')`的话，就会被绕过

## 问号绕过

```
http://www.xxx.com?url=http://fishing.com?test.com
```

## #号绕过

```
http://www.xxx.com?url=http://fishing.com#test.com
```

## 正反斜杠绕过

```
http://www.xxx.com?url=http://fishing.com/test.com
http://www.xxx.com?url=http://fishing.com\test.com
http://www.xxx.com?url=http://fishing.com\\test.com
http://www.xxx.com?url=http://fishing.com\.test.com
```

## 白名单

`http://www.aaa.com/acb?Url=http://login.aaa.com`，这个`login.aaa.com`也可以改成`aaa.com`同样可以跳转对吧，因为白名单里只要有包含这个域名就直接成功跳转。那么当我在这个域名前面加上如`fishaaa.com`，白名单里会检查是否包含`aaa.com`这个域名，包含，然后直接跳转，而并没有检查这个域名的整个信息，然后可以利用这个问题，直接注册一个`fishaaa.com`这个域名就可以利用这个跳转。

```=
http://www.aaa.com?Url=http://fishaaa.com
```

## 协议绕过

删除或切换http和https，或者增加多个斜杠

```
[协议]://[用户名]:[密码]@[主机名]:[端口]/[路径]?[查询参数]#[片段 ID]
```
```
http://www.xxx.com?url=//fishing.com#test.com
http://www.xxx.com?url=///fishing.com#test.com
```

# 参考文章

[任意URL跳转漏洞修复与JDK中getHost()方法之间的坑](https://www.freebuf.com/articles/web/196165.html)
