```
docker pull jenkins/jenkins:latest //最新版
```

# volume方式(推荐)

```
docker run \
-p 8082:8080 \
-p 50000:50000 \
--name jenkins \
--restart=always \
-v jenkins_data:/home/docker/data/jenkins \
-v jenkins_home:/var/jenkins_home \
-v /etc/localtime:/etc/localtime \
-e JAVA_OPTS=-Duser.timezone=Asia/Shanghai \
-d jenkins/jenkins:latest
```

解析下上面的命令：
- `-p 8082:8080`: 将docker80端口映射到本地的80端口
- `-v /home/docker/data/project/jenkins:/home/docker/data/jenkins`：此目录挂载，是为了方便在宿主机编写执行脚本，jenkins容器也能调用；
- `-v /data/jenkins_home:/var/jenkins_home`：将容器中的 /var/jenkins_home 目录映射到 /data/jenkins_home，此目录挂载，是为了方便做Jenkins迁移，无需在重新安装

> 注意：-p 50000:50000这个端口号，要默认，不要修改，只有-p 8080:8080 这个端口号，是可以根据咱们自己需要而设定


运行成功后访问该地址登录Jenkins，第一次登录需要输入管理员密码：

`http://localhost:8082/`

查看密码
```
docker logs jenkins
```

插件安装提速

```
cd /var/lib/docker/volumes/jenkins_home/_data/updates
sed -i 's/http:\/\/www.google.com/https:\/\/www.baidu.com/g' default.json
sed -i 's/http:\/\/updates.jenkins-ci.org\/download/https:\/\/mirrors.tuna.tsinghua.edu.cn\/jenkins/g' default.json

# 重启服务
docker restart jenkins
```


# bind mount方式

创建本地数据卷

```
mkdir -p /data/jenkins_home/
```

需要修改下目录权限，因为当映射本地数据卷时，/data/jenkins_home/目录的拥有者为root用户，而容器中jenkins用户的 uid 为 1000。

```
chown -R 1000:1000 /data/jenkins_home/
```

```
docker run \
-p 8082:8080 \
-p 50000:50000 \
--name jenkins \
-v /home/docker/data/project/jenkins:/home/docker/data/jenkins
-v /data/jenkins_home:/var/jenkins_home \
-v /etc/localtime:/etc/localtime \
-e JAVA_OPTS=-Duser.timezone=Asia/Shanghai \
-d jenkins/jenkins:latest
```

解析下上面的命令：
- `-p 8082:8080`: 将docker80端口映射到本地的80端口， 用以访问
- `-v /home/docker/data/project/jenkins:/home/docker/data/jenkins`：此目录挂载，是为了方便在宿主机编写执行脚本，jenkins容器也能调用；
- `-v /data/jenkins_home:/var/jenkins_home`：将容器中的 /var/jenkins_home 目录映射到 /data/jenkins_home，此目录挂载，是为了方便做Jenkins迁移，无需在重新安装

> 注意：-p 50000:50000这个端口号，要默认，不要修改，只有-p 8080:8080 这个端口号，是可以根据咱们自己需要而设定


运行成功后访问该地址登录Jenkins，第一次登录需要输入管理员密码：

`http://localhost:8082/`

查看密码
```
sudo docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```
可以使用以下命令从容器启动日志中获取管理密码：
```
docker logs jenkins
```


参考文章

https://segon.cn/install-jenkins-using-docker.html