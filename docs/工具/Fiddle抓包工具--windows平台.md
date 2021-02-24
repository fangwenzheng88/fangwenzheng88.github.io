[https://www.telerik.com/download/fiddler/fiddler4](https://www.telerik.com/download/fiddler/fiddler4)

# 1. 简介

## 1.1. 工作原理

Fiddler是以代理WEB服务器的形式工作的,浏览器与服务器之间通过建立TCP连接以HTTP协议进行通信，浏览器默认通过自己发送HTTP请求到服务器，它使用代理地址:127.0.0.1, 端口:8888. 当Fiddler开启会自动设置代理， 退出的时候它会自动注销代理，这样就不会影响别的程序。不过如果Fiddler非正常退出，这时候因为Fiddler没有自动注销，会造成网页无法访问。解决的办法是重新启动下Fiddler。

![img](http://fang.images.fangwenzheng.top/947566-f51654e6f0018748.jpg)

# 2. https设置

Fiddler会扑获浏览器的http请求，但是要抓取https的JS内容，Fiddler必须解密HTTPS流量，但是浏览器会检查数字证书，并发现会话遭到窃听，为了骗过浏览器，Fiddler通过使用另一个数字证书重新加密HTTPS流量。Fiddler被配置为解密HTTPS流量后，会自动生成一个名为DO_NOT_TRUST_FiddlerRoot的CA证书，并使用该证书颁发每一个域名的TLS证书。若此证书被列为浏览器或其他软件按信任的CA名单内，则浏览器或其他软件就会认为HTTPS绘画是可信任的不会在弹出证书错误警告。

1. 打开 Fiddler，在菜单栏中依次选择 【Tools】->【Fiddler Options】->【HTTPS】，勾上如下图的选项。

2. 点击Actions选择`Trust Root Certificate`, 然后选择`Export Root Certificate to Desktop`导入到桌面后双击打开， 图如下


![image-20210207163249399](http://fang.images.fangwenzheng.top/image-20210207163249399.png)

![img](http://fang.images.fangwenzheng.top/458443-20180419174842880-844252101.png)

# 3. Filters设置

整个过滤集分为7部分

- Hosts
- 客户端进程
- 请求头
- 断点
- 响应状态码
- 响应类型和大小
- 响应头

## 3.1. User Fiters启用

![image-20210207152127562](http://fang.images.fangwenzheng.top/image-20210207152127562.png)



## 3.2. Host过滤（常用）

- `-No Host Filter`：第一个选择框
	- 指定只显示内网（Intranet）;
	- 指定只显示互联网（Internet）的内容；
- `-No Host Filter`：第二个选择框
	- `-No Host Filter`：无HOST过滤；
	- `Hide the following Hosts`：只显示如下HOST；
	- `Flag the following Hosts`：加粗显示如下HOST；
- 输入框输入规则
	- 输入多个HOST，多个之前用半角逗号或者回车分隔；
	- 支持通配符：*,baidu.com；



![img](http://fang.images.fangwenzheng.top/1140207-20171004220038490-957479275.png)

![img](https://images2017.cnblogs.com/blog/1140207/201710/1140207-20171004220047099-2027676117.png)

**步骤**：选择Hosts--->输入过滤条件单条件（ir.baidu.com）或多条件（ir.baidu.com,www.baidu.com或ir.baidu.com+Enter+www.baidu.com）或通配符（*.baidu.com）--->Changes not yet saved--->选择Ations中Run Filterset now；

![image-20210207153703890](http://fang.images.fangwenzheng.top/image-20210207153703890.png)

## 3.3 Client Process过滤

客户端进程过滤规则：

- Show only traffic from：你可以指定只捕获哪个Windows进程中的请求；

- Show only Internet Explorer traffic：只显示IE发出的请求；

- Hide Windows RSS platform traffic：隐藏Windows RSS平台发出的请求；

![image-20210207154639088](http://fang.images.fangwenzheng.top/image-20210207154639088.png)



## 3.4 Request Headers过滤

请求header过滤规则：

- 经常使用：Show only if URL contains；

- Flag requests with headers：标记带有特定header的请求；

- Delete request headers：删除请求header；

- Set request header设置请求的header；

![img](http://fang.images.fangwenzheng.top/1140207-20171004220516802-468891339.png)



## 3.5 Breakpoints

断点设置规则：

- Break request on HTTP POST：给所有POST请求设置断点；
- Break request on HTTP GET with QueryString：给所有带参数的GET请求设置断点；
- Break response on Content-Type：给特定的Content-Type设定断点；

![image-20210207154753197](http://fang.images.fangwenzheng.top/image-20210207154753197.png)

## 3.6 Response Status Code过滤

响应HTTP状态过滤规则：

- Hide success(202,204,206)：隐藏响应成功的session(202,204,206)；
- Hide Authentication demands(401)：隐藏未经授权被拒绝的session(401)；
- Hide redirects(300,301,302,303,307)：隐藏重定向的session(300,301,302,303,307)；
- Hide Not Modified(304)：隐藏无变更的session(304)；

![image-20210207154948499](http://fang.images.fangwenzheng.top/image-20210207154948499.png)

## 3.7 Response Type and Size(常用)

响应类型和大小过滤规则：

- Show all Content-Type：**显示所有响应类型**；

- Hide smaller than ？KB：隐藏小于指定大小的session；

-  Hide larger than ？KB：隐藏大于指定大小的session；

- Time HeatMap：获得即时数据（绿色阴影代表响应时间在50毫秒以内；超过50毫秒但在300毫秒之内的响应条目没有颜色；响应时间在300至500毫秒之间的会涂以黄色；超过500毫秒的用红色底纹显示）；

- Block script files：阻止脚本文件，显示为404；

- Block image files：阻止图片文件；

- Block SWF files：阻止SWF文件；

- Block CSS files：阻止CSS文件；

## 3.8 Response Headers

响应header过滤规则：

- Flag response that set cookies：标记会设置cookie的响应；

- Flag response with headers：标记带有特定header的响应；
- Delete response headers：删除响应header；
- Set response header：设置响应的header；

![img](https://images2017.cnblogs.com/blog/1140207/201710/1140207-20171004221658365-1338290611.png)



## 3.9 会话列表：鼠标右击

不同列鼠标右键展示出来的过滤项会不一样



![image-20210207160350347](http://fang.images.fangwenzheng.top/image-20210207160350347.png)

# 4. 手机端抓包

**步骤：**

- 设置https抓包(前面有配置力促流程)
- Tools-->Options-->Connections-->勾选Allow remote computers to connect-->OK-->可能需要重启
- 操作手机WiFi-->代理设置-->手动-->服务器填写Fiddler所在机器的IP-->端口是上面设置的8888端口
- 手机接下来是安装Fiddler证书。
- 接下来就可以抓包了，如果抓到的请求中Host显示 `tunnel to` 那就说明证书有问题，重新操作一遍安装证书即可

![image-20210207163926570](http://fang.images.fangwenzheng.top/image-20210207163926570.png)

![img](https://upload-images.jianshu.io/upload_images/4789908-c21adae7cd586cf3.png?imageMogr2/auto-orient/strip|imageView2/2/w/574/format/webp)







# 5. fiddler修改返回数据的三种方法

## 5.1. fiddlerScript来修改响应的json数据

顶部Rules-->选择Customize Rule-->在方法 OnBeforeResponse 中插入修改代码-->重新请求即可

```
static function OnBeforeResponse(oSession: Session) {
        if (m_Hide304s && oSession.responseCode == 304) {
            oSession["ui-hide"] = "true";
        }
        
        // 判断是否为目标请求
        var isMusicRequest = false;
        if ((oSession.host == "m.baidu.com") &&                // host  
            oSession.fullUrl.Contains("suggest?ctl=his&action=list"))   // url
        {
            isMusicRequest = true;
        }
        // 修改返回JSON串
        if (isMusicRequest)
        {
            // 1, 获取Response Body中JSON字符串
            var responseStringOriginal =  oSession.GetResponseBodyAsString();
            //FiddlerObject.log(responseStringOriginal);    // 可在控制台中输出Log
           
            // 2, 转换为可编辑的JSONObject变量
            var responseJSON = Fiddler.WebFormats.JSON.JsonDecode(responseStringOriginal);
            
            // 3, 修改JSONObject变量
            // 3.1修改字段
			var str = '{"results":{"ret":100,"list":[],"msg":"成功"},"code":200}';
			responseJSON.JSONObject = Fiddler.WebFormats.JSON.JsonDecode(str).JSONObject;
            
            // 4, 重新设置Response Body
            var responseStringDestinal = Fiddler.WebFormats.JSON.JsonEncode(responseJSON.JSONObject);
            //FiddlerObject.log(responseStringDestinal);
            oSession.utilSetResponseBody(responseStringDestinal);
        }
    }
```

## 5.2. AutoResponder(推荐，使用简单)

1. 将左侧抓的包拖入右侧AutoResponder
2. 选中右键`Edit Response`，修改Response后选择Save
3. 编辑`Rule Edit`
    1. 前缀`EXACT`：表示完全匹配（大小写敏感）
    2. 无前缀表示基本搜索，表示搜索到字符串就匹配
    3. 前缀为“REGEX:”表示使用正则表达式匹配
    4. 前缀为“REGEX:(?insx)”表示匹配方式其中：
        1. i表示不区分大小写；
        2. n表示指定的唯一有效的捕获是显式命名或编号的形式；
        3. s表示单行模式；
        4. x表示空格说明的；
4. 一般无前缀就可以
5. 勾选`Enable rules`，`Unmatched requests passthrough`

![](http://fang.images.fangwenzheng.top/2020042210010.png)

## 5.3. Automatic Breakpoint(不推荐)

1. 选择`Rules`-->选择`Automatic Breakpoint`-->选择断点方式`After Responses`
