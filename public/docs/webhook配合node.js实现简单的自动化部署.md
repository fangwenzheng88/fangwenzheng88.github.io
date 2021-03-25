



# 1. 配置github

进入项目-->选择Setting-->点击Webhooks

![image-20210225154548138](http://fang.images.fangwenzheng.top/image-20210225154548138.png)



# 2. 部署脚本

```shell
# 1. 创建目录
mkdir webhook
# 2. 初始化npm
npm init
# 3. 安装github-webhook-handler依赖
npm i github-webhook-handler
```

## 2.1. 创建处理webhook的脚本

```javascript
var http = require('http')
var createHandler = require('github-webhook-handler')
// secret保持和github项目webhook中填写的一致即可
var handler = createHandler({ path: '/webhook', secret: 'xxx' })

function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = "";

  child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
  child.stdout.on('end', function() { callback (resp) });
}

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  console.log("==========处理webhook==========")
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
  console.log("==========执行./deploy.sh脚本==========")
    run_cmd('sh', ['./deploy.sh',event.payload.repository.name], function(text){ console.log(text) });
})

handler.on('issues', function (event) {
    console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})
```



## 2.2. 创建deploy.sh脚本


```sh
WEB_PATH='/root/github_codes/'$1

echo "####################开始####################"
cd $WEB_PATH
echo "pulling"
git reset --hard origin/main
git clean -f
git checkout main
git pull
echo "安装依赖"
npm config set registry https://registry.npm.taobao.org
npm install
echo "开始打包"
npm run build
echo "启动docker"
cd docker
docker-compose restart
echo "启动docker结束"
docker ps
echo "####################结束####################"
```



## 2.3. 后台运行app.js

### 2.3.1 nohup方式

```javascript
[root@VM-0-2-centos ~]# screen
[root@VM-0-2-centos ~]# nohup node app.js &
[1] 16545
[root@VM-0-2-centos ~]# nohup: ignoring input and appending output to ‘nohup.out’

[1]+  Exit 1                  nohup node app.js
[root@VM-0-2-centos ~]# 
```

> screen //创建 screen 终端，不然关闭ssh链接后程序会关闭
>
> 注意，`nohup`命令不会自动把进程变为"后台任务"，所以必须加上`&`符号。
>
> 运行命令后nohup: ignoring input and appending output to ‘nohup.out’，回车即可退出nohup模式

### 2.3.2 pm2(推荐)

```shell
# 安装pm2
[root@VM-0-2-centos bin]# npm install -g pm2
# 查询nodejs安装路径
[root@VM-0-2-centos bin]# whereis node
node: /usr/local/bin/node
[root@VM-0-2-centos bin]# cd /usr/local/bin/
[root@VM-0-2-centos bin]# ll
total 11940
-rwxr-xr-x 1 root root 12219168 Dec 29 17:06 docker-compose
lrwxrwxrwx 1 root root       33 Dec 28 17:44 node -> /usr/local/node-v10.15.3/bin/node
lrwxrwxrwx 1 root root       32 Dec 28 17:44 npm -> /usr/local/node-v10.15.3/bin/npm
lrwxrwxrwx 1 root root       27 Dec 30 19:44 pip3 -> /usr/local/python3/bin/pip3
lrwxrwxrwx 1 root root       32 Mar 19 16:27 pm2 -> /usr/local/node-v10.15.3/bin/pm2
lrwxrwxrwx 1 root root       30 Dec 30 19:44 python3 -> /usr/local/python3/bin/python3
[root@VM-0-2-centos bin]# cd /usr/local/node-v10.15.3/bin
[root@VM-0-2-centos bin]# ls
node  npm  npx  pm2  pm2-dev  pm2-docker  pm2-runtime
# 将pm2加至本地的环境变量(需要知道nodejs安装位置)
[root@VM-0-2-centos bin]# ln -s /usr/local/node-v10.15.3/bin/pm2 /usr/local/bin
```

```shell
# 运行app.js
pm2 start app.js
```



