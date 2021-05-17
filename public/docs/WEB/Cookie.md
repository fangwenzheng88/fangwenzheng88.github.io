# 1. HTTP cookies

HTTP Cookie（也叫 Web Cookie 或浏览器 Cookie）是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器，如保持用户的登录状态。Cookie 使基于[无状态](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#http_is_stateless_but_not_sessionless)的HTTP协议记录稳定的状态信息成为了可能。

Cookie 主要用于以下三个方面：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）



![image-20210517150020979](http://fang.images.fangwenzheng.top/image-20210517150020979.png)



## 1.1. Name / Value

存储是以 `Name=Value` 的形式。

## 1.2. Domain 

`Domain` 指定了哪些主机可以接受 Cookie。如果不指定，默认为 [origin](https://developer.mozilla.org/zh-CN/docs/Glossary/Origin)，**不包含子域名**。如果指定了`Domain`，则一般包含子域名。因此，指定 `Domain` 比省略它的限制要少。但是，当子域需要共享有关用户的信息时，这可能会有所帮助。 

例如，如果设置 `Domain=mozilla.org`，则 Cookie 也包含在子域名中（如`developer.mozilla.org`）。

## 1.3. Path 

`Path` 标识指定了主机下的哪些路径可以接受 Cookie（**该 URL 路径必须存在于请求 URL 中**）。以字符 `%x2F` ("/") 作为路径分隔符，子路径也会被匹配。

例如，设置 `Path=/docs`，则以下地址都会匹配：

- `/docs`
- `/docs/Web/`
- `/docs/Web/HTTP`



## 1.4. Expires/Max-age

- Expires/Max-age 不可读，document.cookie 也不会显示出 expires
- `Max-Age` 的优先级比 `Expires` 更高。
- 当Cookie的过期时间被设定时，设定的日期和时间只与**客户端相关，而不是服务端**。

### 1.4.1. Expires

为 Cookie 的删除设置一个过期的日期，使用 GMT 格式的时间，`2031-04-26T08:04:34.000Z`

### 1.4.2. Max-Age

`Max-age` 设置一个 Cookie 将要过期的秒数

1. 大于 0 是计算经过多少秒失效
2. 等于 0 是会话级别，关闭浏览器就失效
3. 小于 0 是指 cookie 无效，立即删除

## 1.5. SameSite

`SameSite` Cookie 允许服务器要求某个 cookie 在跨站请求时不会被发送，（其中  [Site (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/Site) 由可注册域定义），从而可以阻止跨站请求伪造攻击（[CSRF](https://developer.mozilla.org/zh-CN/docs/Glossary/CSRF)）。



`SameSite` 可以有下面三种值：

- **`None`**。浏览器会在同站请求、跨站请求下继续发送 cookies，不区分大小写（Secure 设置为true的情况下才能设置SameSite为None）。
- **`Strict`**。浏览器将只在访问相同站点时发送 cookie。（在原有 Cookies 的限制条件上的加强，如上文 “Cookie 的作用域” 所述）
- **`Lax`**（默认值）。与 **`Strict`** 类似，但用户从外部站点导航至URL时（例如通过链接）除外。 在新版本浏览器中，为默认选项，Same-site cookies 将会为一些跨站子请求保留，如图片加载或者 frames 的调用，但只有当用户从外部站点导航到URL时才会发送。如 link 链接

> 以前，如果 SameSite 属性没有设置，或者没有得到运行浏览器的支持，那么它的行为等同于 None，Cookies 会被包含在任何请求中——包括跨站请求。
>
> 大多数主流浏览器正在将 [**SameSite 的默认值迁移至 Lax**](https://www.chromestatus.com/feature/5088147346030592)。如果想要指定 Cookies 在同站、跨站请求都被发送，现在需要明确指定 SameSite 为 None。



## 1.6. HttpOnly 

HttpOnly是包含在Set-Cookie HTTP响应头文件中的附加标志。生成cookie时使用HttpOnly标志有助于降低客户端脚本访问受保护cookie的风险（如果浏览器支持）。

这个意思就是说，如果某一个Cookie 选项被设置成 HttpOnly = true 的话，那此Cookie 只能通过服务器端修改，Js 是操作不了的，对于 document.cookie 来说是透明的。

- 通过 JavaScript 创建的 Cookie 不能包含 HttpOnly 标志。

- 使用 `HttpOnly` 属性可防止通过 JavaScript 访问 cookie 值。



## 1.7. Secure 

标记为 `Secure` 的 Cookie 只应通过被 HTTPS 协议加密过的请求发送给服务端，因此可以预防 [man-in-the-middle](https://developer.mozilla.org/zh-CN/docs/Glossary/MitM) 攻击者的攻击。但即便设置了 `Secure` 标记，敏感信息也不应该通过 Cookie 传输，因为 Cookie 有其固有的不安全性，`Secure` 标记也无法提供确实的安全保障, 例如，可以访问客户端硬盘的人可以读取它。

>  从 Chrome 52 和 Firefox 52 开始，不安全的站点（`http:`）无法使用Cookie的 `Secure` 标记。



# 2. 设置 Cookie

1. 响应头中的 `Set-Cookie`，这个属于最常用的方式。
   `Set-Cookie: key1=value1; path=path; domain=domain; max-age=max-age-in-seconds; expires=date-in-GMTString-format; secure; httponly; SameSite=None`
2.  document.cookie = "name=value;expires=evalue; path=pvalue; domain=dvalue; secure;”