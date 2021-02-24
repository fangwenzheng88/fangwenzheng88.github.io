
# 取最新版的 MongoDB 镜像
```
docker pull mongo:latest
```

# 运行容器

```
docker run -d \
--name mongodb \
-p 27017:27017 \
-v mongo_data:/data/db \
-v mongo_conf:/data/configdb \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=qwer4r\$R \
--restart=on-failure:3 \
mongo:latest
```


- MONGO_INITDB_ROOT_USERNAME，MONGO_INITDB_ROOT_PASSWORD 这两个变量都是创建用户所必需的。如果两者都存在，则MongoDB将以启用身份验证（mongod --auth）开始，此时--atuh可以省略。
- --restart=always Docker服务重启容器也启动
- --privileged 拥有真正的root权限
- --restart=on-failure:3：是指容器在未来出现异常退出（退出码非0）的情况下循环重启3次

# 接着使用以下命令添加用户和设置密码，并且尝试连接。

```
# 进入容器内部
$ docker exec -it mongodb mongo admin

# 创建一个名为 admin，密码为 qwer4r 的用户(可以省略,创建容器的时候创建了账户)。
>  db.createUser({ user:'admin',pwd:'qwer4r',roles:[ { role:'userAdminAnyDatabase', db: 'admin'}]});

# 尝试使用上面创建的用户信息进行连接(使用创建容器时指定的账户登录)。
> db.auth('admin', 'qwer4r')
# 查看当前库下的账户
> show users
```

刚建立了 userAdminAnyDatabase 角色，用来管理用户，可以通过这个角色来创建、删除用户。

```
db.createUser(
  {
    user: "root",
    pwd: "qwer4r",
    roles: [ { role: "root", db: "admin" } ]
  }
)
db.auth("root","qwer4r")  认证通过后可以操作数据库
```

```
// 修改用户密码
db.changeUserPassword('tank2','test');
```

# 下载 MongoDB Compass

```
https://www.mongodb.com/try/download/compass
```
