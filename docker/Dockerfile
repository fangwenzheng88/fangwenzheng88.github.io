FROM alpine:3.7
LABEL AUTHOR="none" \
        VERSION=0.1.3

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
        && set -ex \
        && apk update && apk upgrade \
        && apk add --no-cache git  nodejs nginx \
        && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
        && echo "Asia/Shanghai" > /etc/timezone

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
