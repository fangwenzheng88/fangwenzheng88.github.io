# 拉取镜像
```
docker pull redis:latest
```

# 获取redis.conf

去redis官网下载redis获取redis.conf配置文件 `http://download.redis.io/redis-stable/redis.conf`

创建数据卷
```
docker volume create redis_redis
docker volume ls
cd /var/lib/docker/volumes/redis_redis/_data/
```

- 将上面的redis.conf内容复制进去，
    - 将 bind 127.0.0.1注释，不然只能内网访问
    - daemonize yes注释掉
    - 如果需要redis密码则找到 requirepass 并填上你的密码
    - 开启数据持久化，appendonly 设置为yes

# 创建并运行一个名为 myredis 的容器

```
docker run \
-p 6379:6379 \
-v redis_data:/data \
-v redis_redis:/etc/redis \
--name myredis \
-d redis \
redis-server /etc/redis/redis.conf
```

# 修改密码

1. 命令行设置密码。
```
# 进入容器
docker exec -it myredis /bin/bash

# 启动redis客户端
redis-cli

# 查看密码
config get requirepass
    # 如果设置过密码会提示(error) NOAUTH Authentication required.
    # 设置过密码需要登录：auth 密码

# 修改密码
config set requirepass 123456

```

2. 配置文件设置密码

在redis根目录下找到redis.conf配置文件，搜索requirepass，找到注释密码行，添加密码如下：

```
# requirepass foobared
requirepass 123456     //注意，行前不能有空格
```

重启服务