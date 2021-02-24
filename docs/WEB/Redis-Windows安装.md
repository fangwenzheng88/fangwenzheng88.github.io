>Redis 是一个开源（BSD许可）的，内存中的数据结构存储系统，它可以用作数据库、缓存和消息中间件。 它支持多种类型的数据结构，如 字符串（`strings`）， 散列（`hashes`）， 列表（`lists`）， 集合（`sets`）， 有序集合（`sorted sets`） 与范围查询， `bitmaps`， `hyperloglogs` 和 地理空间（`geospatial`） 索引半径查询。 `Redis` 内置了 复制（`replication`），LUA脚本（`Lua scripting`）， LRU驱动事件（`LRU eviction`），事务（`transactions`） 和不同级别的 磁盘持久化（`persistence`）， 并通过 `Redis`哨兵（`Sentinel`）和自动 分区（`Cluster`）提供高可用性（`high availability`）。

<!-- more -->

# Window 下安装
下载地址：https://github.com/MSOpenTech/redis/releases。

Redis 支持 32 位和 64 位。这个需要根据你系统平台的实际情况选择，这里我们下载 Redis-x64-xxx.zip压缩包到 C 盘，解压后，将文件夹重新命名为 redis。

![](http://fang.images.fangwenzheng.top/redis20200113174955.png)

打开文件夹，内容如下：

![](http://fang.images.fangwenzheng.top/redis20200113175056.png)

打开一个 cmd 窗口 使用 cd 命令切换目录到 C:\redis 运行：

```
redis-server.exe redis.windows.conf
```

如果想方便的话，可以把 redis 的路径加到系统的环境变量里，这样就省得再输路径了，后面的那个 redis.windows.conf 可以省略，如果省略，会启用默认的。输入之后，会显示如下界面：

![](http://fang.images.fangwenzheng.top/redis20200113175137.png)

这时候另启一个 cmd 窗口，原来的不要关闭，不然就无法访问服务端了。

切换到 redis 目录下运行:

```
redis-cli.exe -h 127.0.0.1 -p 6379
```

设置键值对:

```
set myKey abc
```

取出键值对:

```
get myKey
```
