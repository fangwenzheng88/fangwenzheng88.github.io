## 前置条件
安装Jenkins需要有java环境，请先安装并配置好jdk

如果你的系统没有自带git，那么也需要安装一个
```
yum install git
```
## 1.安装
```shell
# 下载依赖
wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo

# 导入秘钥
rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key

# 安装
yum install jenkins
```
## 2.配置
```shell
# 查看配置文件
vim /etc/sysconfig/jenkins
# 修改端口
JENKINS_PORT="8080"
# 设置开机自启动
chkconfig jenkins on
# 启动jenkins
service jenkins start
# 安装完成后浏览器进入需要输入密码，进入jenkins解密界面
cat /var/lib/jenkins/secrets/initialAdminPassword
```

```shell
# 查看安装路径
rpm -ql jenkins
```

## 插件安装
1. 选择推荐配置安装

**jenkins更换国内源**

系统管理>>管理插件>>高级

将 [升级站点] 更换为
```
https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/current/update-center.json
```

**安装Nodejs**

- 系统管理—>管理插件—>下载NodeJS插件
- 下载的插件在：$JENKINS_HOME/plugins目录下
- 系统管理—>Global Tool Configuration—>选择需要安装的nodejs版本
- 会从nodejs官网下载安装，nodejs安装包在：$JENKINS_HOME/tools目录下
![](http://fang.images.fangwenzheng.top/beAJfm.png)

注意: jenkins安装nodeJs插件后不能选择nodejs版本，[处理方式](https://blog.csdn.net/qq_33381971/article/details/89423977)



**安装Publish over SSH**

- 系统管理—>管理插件—>下载Publish over SSH插件
- 系统管理—>系统配置

1.不使用密钥，不配置
![](http://fang.images.fangwenzheng.top/995268-20180805110419541-1206860773.png)

2.使用用户名密码配置
![](http://fang.images.fangwenzheng.top/995268-20180805110504711-168276641.png)

3.构建完成后，文件将会发送到指定服务器 

要拷贝的文件在${jenkins_home}/workspace/${任务名称}，例如:/var/lib/jenkins/workspace/testdemo

远端目录将会置于全局配置目录下,如果目录不存在将会创建

![](http://fang.images.fangwenzheng.top/995268-20180805131949178-914594884.png)

![](http://fang.images.fangwenzheng.top/20200416161125.png)

## 部署一个vue工程

创建任务==>配置git地址信息

![](http://fang.images.fangwenzheng.top/20200416160216.png)

<img src="http://fang.images.fangwenzheng.top/20200416160145.png"  />


执行Shell
```
# 默认当前路径为/var/lib/jenkins/workspace/test
ls -l
hostname
cd demo1
npm install --registry https://registry.npm.taobao.org
npm run build
cd dist
rm -rf test.tar.gz
tar -zcvf test.tar.gz *
cd ../
ls -l
```

执行后操作
```
# 进入需要操作的目录（当前目录为用户根目录）
# 上传的文件为Remote directory配置(全局配置目录对这里会有影响)
cd /data/nginx/html && tar -zxvf test.tar.gz && docker restart docker_nginx
```