[toc]

https://www.runoob.com/docker/windows-docker-install.html

## 启用Hyper-V
![](http://fang.images.fangwenzheng.top/20191011184259.png)
![](http://fang.images.fangwenzheng.top/20191011184357.png)

## 下载docker
https://store.docker.com/editions/community/docker-ce-desktop-windows
dockerhubshare
Dockerhub666

直接安装下一步，右下角有会有个小鲸鱼

## 修改镜像服务器地址
http://hub-mirror.c.163.com
![](http://fang.images.fangwenzheng.top/20191011183944.jpg)

## 启动redis
直接启动cmd
```
docker pull redis
docker run -p 6379:6379 -d redis:latest redis-server
docker exec -ti ==d0b86== redis-cli
```