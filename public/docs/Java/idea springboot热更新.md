[toc]

# 1. springboot热更新

## 1.1. `IDEA`提供了对`spring-boot-devtools`的相应支持的

## 1.2. 修改`pom.xml`

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

```
<plugins>
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <!--fork :  如果没有该项配置，肯定devtools不会起作用，即应用不会restart -->
        <fork>true</fork>
        <!--<addResources>true</addResources>-->
    </configuration>
</plugin>
</plugins>
```

## 1.3. 修改idea配置

通过main方法启动一次项目

![](http://fang.images.fangwenzheng.top/idea热更新003.png)


打开启动配置窗口

![](http://fang.images.fangwenzheng.top/idea热更新.png)

修改启动类配置

![](http://fang.images.fangwenzheng.top/idea热更新002.png)

- `On 'Update' action`（手动触发）: 选择一个策略。您只能更新资源，更新类和资源（构建应用程序），更新触发器文件（重新启动）或执行类热插拔，如果失败，则IntelliJ IDEA将更新触发器文件（重新启动）。

- `On frame deactivation`（idea窗口失去焦点）: 可以选择在切换到另一个应用程序后IDE将执行的操作。`IntelliJ IDEA`可以更新资源或构建您的应用程序。

> 以上配置效果，修改静态文件页面刷新后即可看到修改，修改java文件后ctrl+f10(或者点击下方启动窗口左侧的刷新按钮)即可刷新代码(也可以配置成自动更新,将上一张图update resourecs 修改为 update classes and resources)

## 1.4. 参考文章

[idea官方使用文档](https://www.jetbrains.com/help/idea/spring-boot.html#configure-application-update-policies-with-devtools)

[https://segmentfault.com/a/1190000015930347](https://segmentfault.com/a/1190000015930347)


# 2. 开启`LiveReload`

实现修改代码后自动刷新浏览器页面，不需要手动刷新

`springboot`项目启动会默认开启`LiveReload`，但是需要chrome插件配合

![](http://fang.images.fangwenzheng.top/20191024115540.png)

## 2.1. 修改`pom.xml`

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

```
<plugins>
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <!--fork :  如果没有该项配置，肯定devtools不会起作用，即应用不会restart -->
        <fork>true</fork>
        <!--<addResources>true</addResources>-->
    </configuration>
</plugin>
</plugins>
```

## 2.2. 安装`LiveReload`

谷歌商店搜索`LiveReload`

[csdn下载地址](https://download.csdn.net/download/fangwenzheng88/11913253)

## 2.3. 方法一：

通过main方法启动一次项目

![](http://fang.images.fangwenzheng.top/idea热更新003.png)


打开启动配置窗口

![](http://fang.images.fangwenzheng.top/idea热更新.png)

修改启动类配置

![](http://fang.images.fangwenzheng.top/idea热更新002.png)

- `On 'Update' action`（手动触发ctrl+f10）: 选择一个策略。您只能更新资源，更新类和资源（构建应用程序），更新触发器文件（重新启动）或执行类热插拔，如果失败，则IntelliJ IDEA将更新触发器文件（重新启动）。

- `On frame deactivation`（idea窗口失去焦点）: 可以选择在切换到另一个应用程序后IDE将执行的操作。`IntelliJ IDEA`可以更新资源或构建您的应用程序。

> 以上配置效果，修改静态文件页面刷新后即可看到修改，修改java文件后ctrl+f10(或者点击下方启动窗口左侧的刷新按钮)即可刷新代码(也可以配置成自动更新,将上一张图update resourecs 修改为 update classes and resources)

## 2.4. 方法二：

1. IDEA按ctrl+alt+s——Build,Excution,Deployment——Compiler——勾选Build project automatically
2. IDEA按ctrl+shift+a——输入registry——Compiler——勾选compiler.automake.allow.when.app.running

> 这种方式实验时相比上一种慢一点，但是修改java代码不需要手动触发

## 2.5. 参考文章

[https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-devtools](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-devtools)









