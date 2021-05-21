[toc]

# 1. HTTP缓存

缓存这东西，第一次必须获取到资源后，然后根据返回的信息来告诉如何缓存资源，可能采用的是强缓存，也可能告诉客户端浏览器是协商缓存，这都需要根据响应的header内容来决定的。

HTTP缓存分为两种：==强缓存==和==协商缓存==。强缓存如果命中缓存不需要和服务器端发生交互，而协商缓存不管是否命中都要和服务器端发生交互，强制缓存的优先级高于协商缓存。

浏览器第一次获取资源，在后续在进行请求时：

<img src="http://fang.images.fangwenzheng.top/20200415001.png" style="zoom:80%;" />

## 1.1. 强缓存

可以理解为无须验证的缓存策略。对强缓存来说，响应头中有两个字段 `Expires/Cache-Control` 来表明规则。

- 不会向服务器发送请求，直接从缓存中读取资源
- 请求返回`200`的状态码
- 在`chrome`控制台的`network`选项中可以看到`size`显示`from disk cache`或`from memory cache`。

`from memory cache`代表使用内存中的缓存，`from disk cache`则代表使用的是硬盘中的缓存，浏览器读取缓存的顺序为`memory –> disk`。在浏览器中，浏览器会在js和图片等文件解析执行后直接存入内存缓存中，那么当刷新页面时只需直接从内存缓存中读取(`from memory cache`)；而css文件则会存入硬盘文件中，所以每次渲染页面都需要从硬盘读取缓存(`from disk cache`)。

![](http://fang.images.fangwenzheng.top/20200417153232.png)

### 1.1.1. Expires

[Expires](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Expires) 响应头包含日期/时间，即在此时候之后，响应过期。有一个问题是由于使用具体时间，如果时间表示出错或者没有转换到正确的时区都可能造成缓存生命周期出错。并且 `Expires` 是 `HTTP/1.0` 的标准，现在更倾向于用 `HTTP/1.1` 中定义的 `Cache-Control`。如果在`Cache-Control`响应头设置了 "`max-age`" 或者 "`s-max-age`" 指令，那么 `Expires` 头会被忽略。

缺点：使用的是绝对时间，服务器的时间和浏览器的时间可能并不一致，那服务器返回的这个过期时间可能就是不准确的。因此这种方式很快在后来的`HTTP1.1`版本中被抛弃了。

### 1.1.2. Cache-Control

在`HTTP1.1`中，采用了一个非常关键的字段：`Cache-Control`。这个字段也是存在于，它和Expires本质的不同在于它并没有采用具体的过期时间点这个方式，而是采用过期时长来控制缓存，对应的字段是`max-age`。

[Cache-Control](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control) 可以由多个字段组合而成，主要有以下几个取值：

**到期时间**

1. `max-age=<seconds>` 设置缓存存储的最大周期，超过这个时间缓存被认为过期(单位秒)。与`Expires`相反，时间是相对于请求的时间。例如设置 `Cache-Control:max-age=31536000`，也就是说缓存有效期为（31536000 / 24 / 60 * 60）天，第一次访问这个资源的时候，服务器端也返回了 `Expires` 字段，并且过期时间是一年后。

![](http://fang.images.fangwenzheng.top/20200415140058.png)

在没有禁用缓存并且没有超过有效时间的情况下，再次访问这个资源就命中了缓存，不会向服务器请求资源而是直接从浏览器缓存中取。

![](http://fang.images.fangwenzheng.top/20200415140502.png)

2. `s-maxage=<seconds>` 覆盖`max-age`或者`Expires`头，但是仅适用于共享缓存(比如各个代理)，私有缓存会忽略它。

3. `max-stale[=<seconds>]` 表明客户端愿意接收一个已经过期的资源。可以设置一个可选的秒数，表示响应不能已经过时超过该给定的时间。

4. `min-fresh=<seconds>` 表示客户端希望获取一个能在指定的秒数内保持其最新状态的响应。

**可缓存性**

3. `public` 表明响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存，即使是通常不可缓存的内容。（例如：1.该响应没有max-age指令或Expires消息头；2. 该响应对应的请求方法是 POST 。）

4. `private` 表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）。私有缓存可以缓存响应内容，比如：对应用户的本地浏览器。

5. `no-cache` ==在发布缓存副本之前，强制要求缓存把请求提交给原始服务器进行验证(协商缓存验证)==。不是字面意思上的不缓存。

6. `no-store` 缓存不应存储有关客户端请求或服务器响应的任何内容，即不使用任何缓存。

## 1.2. 协商缓存

缓存的资源到期了，并不意味着资源内容发生了改变，如果和服务器上的资源没有差异，实际上没有必要再次请求。客户端和服务器端通过某种验证机制验证当前请求资源是否可以使用缓存。

浏览器第一次请求数据之后会将数据和响应头部的缓存标识存储起来。再次请求时会带上存储的头部字段，服务器端验证是否可用。如果返回 `304 Not Modified`，代表资源没有发生改变可以使用缓存的数据，获取新的过期时间。反之返回 `200` 就相当于重新请求了一遍资源并替换旧资源。

### 1.2.1. Last-modified/If-Modified-Since

[Last-modified](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Last-Modified): 服务器端资源的最后修改时间，响应头部会带上这个标识。第一次请求之后，浏览器记录这个时间，再次请求时，请求头部带上 `If-Modified-Since` 即为之前记录下的时间。服务器端收到带 `If-Modified-Since` 的请求后会去和资源的最后修改时间对比。若修改过就返回最新资源，状态码 `200`，若没有修改过则返回 `304`。

![](http://fang.images.fangwenzheng.top/20200415141213.png)

**缺点：**
1、某些服务端不能获取精确的修改时间 
2、文件修改时间改了，但文件内容却没有变

**注意🔊:**
如果响应头中有 `Last-modified` 而没有 `Expire` 或 `Cache-Control`
时，浏览器会有自己的算法来推算出一个时间缓存该文件多久，不同浏览器得出的
时间不一样，所以 `Last-modified` 要记得配合 `Expires/Cache-Control` 使用。

### 1.2.2. Etag/If-None-Match

浏览器初次发起请求，服务端返回 [Etag](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/ETag)（根据当前文件内容生成的唯一标识码）字段，浏览器再次发起请求时，会在请求头通过 `If-None-Match` 携带服务器返回的 `Etag` 的值，服务器拿到 `If-None-Match` 的值和服务器中资源当前的 `Etag` 值对比，相同则返回 `304`，证明缓存有效，否则返回 `200` 说明服务器资源已更新。

![](http://fang.images.fangwenzheng.top/20200415141321.png)

关于 `last-modified` 和 `Etag` 区别，已经有很多人总结过了：

- 一些资源的最后修改时间改变了，但是内容没改变，使用 `Last-modified` 看不出内容没有改变。
- `Etag` 的精度比 `Last-modified` 高，属于强验证，要求资源字节级别的一致，服务器的 `Etag` 的优先级`Conditional Request`。
- `Last-Modified` 只能精确到秒，在秒级改变的情况下是无法更新的，如果文件在1秒内改变了多次，可能会导致客户端得到的资源不是最新的。
- 关于 `Etag`，每次客户端发出请求，服务端都会根据资源重新生成一个 `Etag`，影响性能。

注意🔊：实际使用 `ETag/Last-modified` 要注意保持一致性，做负载均衡和反向代理的话可能会出现不一致的情况。计算 `ETag` 也是需要占用资源的，如果修改不是过于频繁，看自己的需求用 `Cache-Control` 是否可以满足。


![](http://fang.images.fangwenzheng.top/20200415002.png)