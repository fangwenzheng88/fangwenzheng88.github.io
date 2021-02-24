[toc]

[下载地址](https://dev.mysql.com/downloads/mysql/)

<!-- more -->

# 1. 设置环境变量：

注意:MYSQL_HOME的路径，请根据自己的实际安装目录进行修改

```
MYSQL_HOME:D:\devlops\MySQL\mysql-5.7.20
PATH路径后前%MYSQL_HOME%\bin;
```

# 2. 添加文件my.ini文件

将如下代码放入my.ini文件中

注意:basedir和datadir，请根据自己的实际安装目录进行修改

```
[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8
[mysqld]
# 设置3306端口
port = 3306
# 设置mysql的安装目录
basedir=D:\devlops\MySQL\mysql-5.7.20
# 设置mysql数据库的数据的存放目录
datadir=D:\devlops\MySQL\mysql-5.7.20\data
# 允许最大连接数
max_connections=200
# 服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
sql-mode="STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION"
```
# 3. 在mysql的实际安装目录下创建空的data文件夹

# 4. 以管理员身份运行cmd进入mysql-5.7.20\bin目录下，

1. 初始化数据库:执行 `mysqld --initialize-insecure --user=mysql`进行初始化数据库操作，
1. 安装mysql服务:执行 `mysqld -install mysql`安装成服务，如果之前有安装过，则卸载
1. 卸载mysql服务:执行 `mysqld -remove` 或`sc delete mysql`即可卸载/删除服务
1. mysql服务的启动与停止:启动: `net start mysql` 停止: `net stop mysql`
1. `mysql -uroot -p` 无密码进入
1. 改密码：`SET PASSWORD = PASSWORD('密码');`