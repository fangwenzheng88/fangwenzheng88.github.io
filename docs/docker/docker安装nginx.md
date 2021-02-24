
```
docker pull nginx:latest
```

运行nginx
```
docker run \
--restart=always \
--name docker_nginx \
-p 80:80 \
-p 443:443 \
-v nginx_logs:/var/log/nginx  \
-v nginx_conf:/etc/nginx \
-v nginx_html:/usr/share/nginx/html \
-d nginx
```

命令说明：

- `-p 8080:80`： 将主机的 8080 端口 映射到 容器的 80 端口
- `--name docker_nginx`：将容器命名为 docker_nginx
