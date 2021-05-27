# proxy_pass路径的唯一拼接规则

**如果`proxy_pass`后面没有任何URL路径信息（比如`/`，`/xxx`等），则反向代理的地址会包含`location`中的匹配部分，否则只会拼接匹配后的剩余路径**
 *PS: 上面是最重要且唯一的一条规则，请记住*

假设请求：`http://localhost/online/wxapi/test/loginSwitch`

```conf
location /online/wxapi/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header X-Real-IP $remote_addr;
}
# 代理后的实际地址：http://localhost:8080/test/loginSwitch


location /online/wxapi/ {
        proxy_pass http://localhost:8080;
        proxy_set_header X-Real-IP $remote_addr;
}
# 代理后的实际地址：http://localhost:8080/online/wxapi/test/loginSwitch


location /online/wxapi/ {
        proxy_pass http://localhost:8080/web;
        proxy_set_header X-Real-IP $remote_addr;
}
# 代理后的实际地址：http://localhost:8080/webtest/loginSwitch


location /online/wxapi/ {
        proxy_pass http://localhost:8080/web/;
        proxy_set_header X-Real-IP $remote_addr;
}
# 代理后的实际地址：http://localhost:8080/web/test/loginSwitch
```



# root/alias区别

`root` 与 `alias` 主要区别在于 `nginx` 如何解释 `location` 后面的 `uri`，这会使两者分别以不同的方式将请求映射到服务器文件上。

`root`的处理结果是：`root` 路径＋`location` 路径

`alias` 的处理结果是：使用 `alias` 路径替换 `location` 路径

`alias` 是一个目录别名的定义，`root` 则是最上层目录的定义。

配置demo：

```
location /xxx {
    root yyy
}
```

浏览器访问 /xxx，实际访问的是 yyy/xxx
浏览器访问 /xxx/abc.html，实际访问的是 yyy/xxx/abc.html
浏览器访问 /xxx/ccc/abc.html，实际访问的是 yyy/xxx/ccc/abc.html

配置demo：

```
location /xxx {
    alias yyy
}
```

浏览器访问 /xxx，实际访问的是 yyy
浏览器访问 /xxx/abc.html，实际访问的是 yyy/abc.html
浏览器访问 /xxx/ccc/abc.html，实际访问的是 yyy/ccc/abc.html