**申请SSL证书**

`https://console.cloud.tencent.com/ssl`

![](http://fang.images.fangwenzheng.top/20200909135502.png)

![](http://fang.images.fangwenzheng.top/20200909135540.png)

申请完成后按照提示进行验证,验证完成后等待审核通过即可下载证书文件

下载证书解压后的文件

![](http://fang.images.fangwenzheng.top/20200909135944.png)

![](http://fang.images.fangwenzheng.top/20200909140031.png)

将这两个文件丢到/etc/nginx/文件夹中,也可以放到其他文件夹

**修改nginx.conf文件**

```
server {
        listen 443 ssl;  # 1.1版本后这样写
        server_name www.domain.com; #填写绑定证书的域名
        ssl_certificate /etc/nginx/1_www.domain.com_bundle.crt;  # 指定证书的位置，绝对路径
        ssl_certificate_key /etc/nginx/2_www.domain.com.key;  # 绝对路径，同上
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #按照这个协议配置
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;#按照这个套件配置
        ssl_prefer_server_ciphers on;
        location / {
            root   html; #站点目录，绝对路径
            index  index.html index.htm;
        }
    }
```

重启项目就可以使用https访问项目


**配置http跳转https**

完成上面配置后将不能使用http访问到web页面，可以配置http跳转https

```
server {  
    listen  80;
    server_name fangwenzheng.top;
  
    rewrite ^(.*)$  https://$host$1 permanent;
}
```









```

user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;

    server {  
        listen  80;
        server_name fangwenzheng.top;
      
         rewrite ^(.*)$  https://$host$1 permanent;
    }

    server {
        listen 443 ssl;
        server_name  fangwenzheng.top;

        ssl_certificate /etc/nginx/1_fangwenzheng.top_bundle.crt;  # 指定证书的位置，绝对路径
        ssl_certificate_key /etc/nginx/2_fangwenzheng.top.key;  # 绝对路径，同上
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #按照这个协议配置
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;#按照这个套件配置
        ssl_prefer_server_ciphers on;
        
        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }
}
```