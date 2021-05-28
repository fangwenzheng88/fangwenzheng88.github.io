[toc]

---

# 1. 前提条件

* 必须 [翻墙](https://www.landeng8.org/cn/) 才行，网上各种方法新版本chrome基本都不行。
* 手机开启usb调试模式
* 浏览器调试，手机安装chrome手机版
* 微信浏览器调试，需要开启TBS内核Inspector调试功能

<!-- more -->

# 2. chrome调试

## 2.1. 手机打开usb调试模式(华为)

1. 打开手机【设置】——【关于手机】——找到【版本号】，连续点击版本号7次。

2. 返回上一步，就会多了一个【开发人员选项】的菜单。

3. 打开【开发人员选项】，即可找到USB调试，勾选“USB 调试”即可开启USB调试。

4. 进入开发者选项,并且下拉找到选择USB配置。

5. 打开之后会有一个选择的详细列表,选择RNDIS(选择USB网络)选项，不同手机可能不一样

6. 等几秒钟会有一个是否允许USB调试的弹窗，选择始终允许。

7. 这个页面弹出，基本及OK了。这时候PC端就可以检查到手机了，不行就多试几次。

  ![](http://fang.images.fangwenzheng.top/chrome调试1577339643.png)

## 2.2. PC端浏览器输入 `chrome://inspect/#devices`

![](http://fang.images.fangwenzheng.top/chrome远程调试.png)

手机端chrome浏览器打开需要调试的页面，此时pc端即可看到需要调试的页面

选择`inspect`进入，**没有翻墙的话,这时候会404报错**


# 3. 微信调试

- 上面操作都完成后
- 微信中打开链接 `http://debugx5.qq.com/`(debugtbs.qq.com)，选择 【信息】，勾选是否打开【TBS内核Inspector调试功能】
- 微信打开需要调试的页面，pc端即可看到

![](http://fang.images.fangwenzheng.top/chrome调试002.png)