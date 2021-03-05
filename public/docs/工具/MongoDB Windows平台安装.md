[toc]

# 1. MongoDB 下载
MongoDB 提供了可用于 32 位和 64 位系统的预编译二进制包，你可以从MongoDB官网下载安装，MongoDB 预编译二进制包下载地址：https://www.mongodb.com/download-center/community

> 注意：在 MongoDB 2.2 版本后已经不再支持 Windows XP 系统。最新版本也已经没有了 32 位系统的安装文件。

![](http://fang.images.fangwenzheng.top/mongondb001.png)

* MongoDB for Windows 64-bit 适合 64 位的 Windows Server 2008 R2, Windows 7 , 及最新版本的 Window 系统。
* MongoDB for Windows 32-bit 适合 32 位的 Window 系统及最新的 Windows Vista。 32 位系统上 MongoDB 的数据库最大为 2GB。
* MongoDB for Windows 64-bit Legacy 适合 64 位的 Windows Vista, Windows Server 2003, 及 Windows Server 2008 。
根据你的系统下载 32 位或 64 位的 .msi 文件，下载后双击该文件，按操作提示安装即可。

安装过程中，你可以通过点击 "Custom(自定义)" 按钮来设置你的安装目录。


![](http://fang.images.fangwenzheng.top/20191219112643.png)
![](http://fang.images.fangwenzheng.top/20191219112712.png)


下一步安装 "install mongoDB compass" 不勾选（当然你也可以选择安装它，可能需要更久的安装时间），MongoDB Compass 是一个图形界面管理工具，我们可以在后面自己到官网下载安装，下载地址：https://www.mongodb.com/download-center/compass。

![](http://fang.images.fangwenzheng.top/20191219112737.png)

## 1.1. 创建数据目录

MongoDB默认将数据目录存储在根目录C:\data\db 目录下。但是这个数据目录不会主动创建，我们在安装完成后需要创建它。

在本教程中，我们已经在 `D:\Program Files\MongoDB\Server\4.2` 安装了 `mongodb`，在 `data` 目录里创建 `db`和`log` 目录。

## 1.2. 命令行下运行 MongoDB 服务器

为了从命令提示符下运行 MongoDB 服务器，你必须从 MongoDB 目录的 bin 目录中执行 mongod.exe 文件。

```
D:\Program Files\MongoDB\Server\4.2\bin\mongod --dbpath D:\Program Files\MongoDB\Server\4.2\data\db
```

如果执行成功，会输出如下信息：

```
2015-09-25T15:54:09.212+0800 I CONTROL  Hotfix KB2731284 or later update is not
installed, will zero-out data files
2015-09-25T15:54:09.229+0800 I JOURNAL  [initandlisten] journal dir=c:\data\db\j
ournal
2015-09-25T15:54:09.237+0800 I JOURNAL  [initandlisten] recover : no journal fil
es present, no recovery needed
2015-09-25T15:54:09.290+0800 I JOURNAL  [durability] Durability thread started
2015-09-25T15:54:09.294+0800 I CONTROL  [initandlisten] MongoDB starting : pid=2
488 port=27017 dbpath=c:\data\db 64-bit host=WIN-1VONBJOCE88
2015-09-25T15:54:09.296+0800 I CONTROL  [initandlisten] targetMinOS: Windows 7/W
indows Server 2008 R2
2015-09-25T15:54:09.298+0800 I CONTROL  [initandlisten] db version v3.0.6
……
```
## 1.3. 连接MongoDB
我们可以在命令窗口中运行 mongo.exe 命令即可连接上 MongoDB，执行如下命令：

`D:\Program Files\MongoDB\Server\4.2\bin\mongo.exe`

# 2. 配置 MongoDB 服务

安装这个之后可以通过命令行快速启动关闭MongoDB

**管理员模式打开命令行窗口**

创建一个配置文件。该文件必须设置 `systemLog.path` 参数，包括一些附加的配置选项更好。

例如，创建一个配置文件位于 `D:\Program Files\MongoDB\Server\4.2\mongod.cfg`，其中指定 `systemLog.path` 和 `storage.dbPath`。具体配置内容如下：

```
systemLog:
    destination: file
    path: D:\Program Files\MongoDB\Server\4.2\data\log\mongod.log
storage:
    dbPath: D:\Program Files\MongoDB\Server\4.2\data\db
```

## 2.1. 安装 MongoDB服务
通过执行`mongod.exe`，使用--install选项来安装服务，使用--config选项来指定之前创建的配置文件。

`D:\Program Files\MongoDB\Server\4.2\bin\mongod.exe --config "D:\Program Files\MongoDB\Server\4.2\mongod.cfg" --install`

要使用备用 dbpath，可以在配置文件（例如：C:\mongodb\mongod.cfg）或命令行中通过 --dbpath 选项指定。

如果需要，您可以安装 `mongod.exe` 或 `mongos.exe` 的多个实例的服务。只需要通过使用 `--serviceName` 和 `--serviceDisplayName` 指定不同的实例名。只有当存在足够的系统资源和系统的设计需要这么做。

启动MongoDB服务 `net start MongoDB`

关闭MongoDB服务 `net stop MongoDB`

移除 MongoDB 服务 `D:\Program Files\MongoDB\Server\4.2\bin\mongod.exe --remove`

命令行下运行 MongoDB 服务器 和 配置 MongoDB 服务 任选一个方式启动就可以。

## 2.2. 可能遇见的错误：

(1.)提示“服务没有响应控制” 造成错误的原因是在第一步配置时，输入有误。删除之前安装的服务，并重新执行第一步并确保准确无误。

(2.)报错“拒绝访问”

```
2016-11-01T20:52:21.647+0800 I CONTROL [main] Trying to install Windows service ‘MongoDB'
2016-11-01T20:52:21.648+0800 I CONTROL [main] Error connecting to the Service Control Manager: 拒绝访问
```

原因：则应该使用管理员身份运行cmd

找到命令处理程序`C:\Windows\System32\cmd.exe`

右键：以管理员身份运行

# 3. 参考文档

https://www.runoob.com/mongodb/mongodb-window-install.html
