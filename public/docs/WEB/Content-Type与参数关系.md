[toc]

# 1. 关于三种 Content-Type

这里主要介绍三种 `Content-Type`：
1. `multipart/form-data` 请求中既可以携带文件，又可以携带参数。其中参数以键值对的方式传递，参数之间、参数与文件之间以 `content-disposition` 分隔；
1. `application/x-www-form-urlencoded` 只能上传参数，不能携带文件，参数通过 ?xxx=xxx&xxx=xxx 的方式被组织在一起；
1. `application/json` 只能上传参数，不能携带文件，参数不被特殊组织，保持原 JSON 字符串的形式。

不同参数chrome显示
1. `get`请求浏览器显示 `Query String Parameters` 注：get请求数据在url上用&拼接，post请求数据放在body中
1. `application/json`  浏览器显示 `Request Payload`
1. `multipart/form-data` 浏览器显示 `Request payload`
1. `application/x-www-form-urlencoded`浏览器显示 `Form Data`

<!-- more -->

# 2. `application/json`

`application/json` 作为请求头，用来告诉服务端消息主体是序列化的JSON字符串

将 `Content-Type` 设置为这种的时候，参数为json字符串，Java后台用 `@RequestBody` 来接收

# 3. `application/x-www-form-urlencoded`
```
class User {
	private PageInfo pageInfo;
	private String username;
	private String[] ids;
	private Map<String, Object> map;
 }
@RequestMapping(value = "/hello")
public User applicationJson(@RequestBody User user) {
	return user;
}

//参数
pageInfo.pageSize=10&username=jack&ids=1&ids=2&map[key]=value
//注意这里的连接符中括号和点，后台解析上会有区别

//返回值
{
	"pageInfo":{
		"pageSize":10
	},
	"username":"jack",
	"ids":["1","2"],
	"map":{
		"key":"value"
	}
}
```
