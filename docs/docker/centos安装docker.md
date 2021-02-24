# 1. 安装Docker

- 官方文档：`https://docs.docker.com/engine/install/`

## 1. 安装流程

```shell
#1.卸载旧版本
yum remove docker \
docker-client \
docker-client-latest \
docker-common \
docker-latest \
docker-latest-logrotate \
docker-logrotate \
docker-engine

#2.需要的安装包
yum install -y yum-utils

#3.设置镜像的仓库
yum-config-manager \
--add-repo \
https://download.docker.com/linux/centos/docker-ce.repo

#默认是从国外的，不推荐
#推荐使用国内的
yum-config-manager \
--add-repo \
https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

#更新yum软件包索引
yum makecache fast

#4.安装docker相关的 docker-ce 社区版 而ee是企业版
yum install docker-ce docker-ce-cli containerd.io

#6. 使用docker version查看是否按照成功
docker version

#7. 测试
docker run hello-world
```

## 2. 替换仓库源地址

- 默认情况下，Docker 下载镜像是从官网下载，下载速度 特别特别的慢

- 使用国内加速器可以提升获取 Docker 官方镜像的速度

  - 科大镜像：**https://docker.mirrors.ustc.edu.cn/**

  - 网易：**https://hub-mirror.c.163.com/**

  - 阿里云：https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors，登陆后，左侧菜单选中镜像加速器就可以看到你的专属地址了

  - 七牛云加速器：**https://reg-mirror.qiniu.com**

    

直接复制即可到 Linux 下回车即可

配置多个地址，避免某个站点不行时自动切换到后面的站点

```
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "http://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://reg-mirror.qiniu.com"
  ]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```



# 2. 安装 Docker Compose

-  官方文档：`https://docs.docker.com/compose/install/`

  

1. 运行以下命令以下载Docker Compose的当前稳定版本

   ```
   sudo curl -L "https://github.com/docker/compose/releases/download/1.28.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   
   # 加速链接
   sudo curl -L "https://get.daocloud.io/docker/compose/releases/download/1.28.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   # 要安装其他版本的Compose，请替换`1.28.2` 为要使用的Compose版本。
   ```

2. 将可执行权限应用于二进制文件：

   ```
   sudo chmod +x /usr/local/bin/docker-compose
   ```


3. 测试安装。

   ```
   $ docker-compose --version
   docker-compose version 1.28.2, build 1110ad01
   ```

4. 卸载

   如果使用`curl`以下命令安装，则要卸载Docker Compose ：

   ```
   sudo rm /usr/local/bin/docker-compose
   ```