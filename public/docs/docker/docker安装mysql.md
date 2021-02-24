## 1.查找镜像：

```
docker search mysql
```
也可以去官网查看镜像tag，选择自己需要的版本，否则会下载最新版本：https://hub.docker.com/_/mysql/



## 2.下载镜像（如上一步，可以指定想要的版本，不指定则为最新版）：
```
docker pull mysql
```
## 3.通过镜像创建容器并运行：

```
docker run -p 3306:3306 \
-v mysql8_conf:/etc/mysql/conf.d \
-v mysql8_data:/var/lib/mysql \
-v /etc/localtime:/etc/localtime:ro \
--restart=on-failure:3 \
--name mysql8 \
-e MYSQL_ROOT_PASSWORD=qwer4r\$R \
-d mysql
```

- `-p 3306:3306`：将容器的 3306 端口映射到主机的 3306 端口。
- `-v /etc/localtime:/etc/localtime:ro`：是让容器的时钟与宿主机时钟同步，避免时区的问题，ro是read only的意思，就是只读。
- `-e MYSQL_ROOT_PASSWORD=123456`：此变量是必需变量，它指定将为MySQLroot超级用户帐户设置的密码。

此时，用`navicat for mysql`连接`mysql`如果发现报错：`Client does not support authentication protocol requested  by server。。。`

解决方案：

进入容器：
```
docker exec -it mysql8 /bin/bash
```
进入mysql：
```
mysql -uroot -p
```

授权：
```
use mysql;

GRANT ALL ON *.* TO 'root'@'%';
```
刷新权限：
```
mysql> flush privileges;
```

## 创建数据库

```
字符集
utf8mb4
排序规则
utf8mb4_unicode_ci
```