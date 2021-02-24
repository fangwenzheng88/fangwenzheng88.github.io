# Docker的数据持久化主要有两种方式：

- bind mount
- volume

`Docker` 的数据持久化即使数据不随着 `container` 的结束而结束，数据存在于 `host` 机器上——要么存在于 `host` 的某个指定目录中（使用 `bind mount`），要么使用 `docker` 自己管理的 `volume`（`/var/lib/docker/volumes`下）。

## bind mount

`bind mount` 自 `docker` 早期便开始为人们使用了，用于将 `host` 机器的目录 `mount` 到 `container` 中。但是 `bind mount` 在不同的宿主机系统时不可移植的，比如 `Windows` 和 `Linux` 的目录结构是不一样的，`bind mount` 所指向的 `host` 目录也不能一样。这也是为什么 `bind mount` 不能出现在 `Dockerfile` 中的原因，因为这样 `Dockerfile` 就不可移植了。

将 `host` 机器上当前目录下的 `host-data` 目录 `mount` 到 `container` 中的 `/container-data` 目录：

```
docker run -it -v $(pwd)/host-dava:/container-data alpine sh
```

有几点需要注意：

- `host` 机器的目录路径必须为全路径(准确的说需要以/或~/开始的路径)，不然 `docker` 会将其当做 `volume` 处理
- 如果 `host` 机器上的目录不存在，`docker` 会自动创建该目录
- 如果 `container` 中的目录不存在，`docker` 会自动创建该目录
- ==如果 `container` 中的目录已经有内容，那么 `docker` 会使用 `host` 上的目录将其覆盖掉==


## [使用 volume](https://docs.docker.com/storage/volumes/)

`volumes`是 `Docker` 数据持久化机制。`bind mounts` 依赖主机目录结构，`volumes` 完全由 `Docker` 管理。`Volumes`有以下优点：

- `Volumes`更容易备份和移植。
- 可以通过 `Docker CLI` 或 `API` 进行管理
- `Volumes` 可以无区别的工作中 `Windows` 和 `Linux` 下。
- 多个容器共享 `Volumes` 更安全。
- `Volume` 驱动可以允许你把数据存储到远程主机或者云端，并且加密数据内容，以及添加额外功能。
- ==一个新的数据内容可以由容器预填充==(挂载是Volumes为空会将容器目录里面的文件复制到Volumes中，挂载是Volumes不为空会清空容器的中目录，并将Volumes中的文件复制到容器的目录中去)。

而且，volumes不会增加容器的大小，生命周期独立与容器。

![](http://fang.images.fangwenzheng.top/20200417092936.png)

`volume` 也是绕过 `container` 的文件系统，直接将数据写到 `host` 机器上，只是 `volume` 是被 `docker` 管理的，`docker` 下所有的 `volume` 都在 `host` 机器上的指定目录下 `/var/lib/docker/volumes` 。

将 `my-volume` 挂载到 `container` 中的 `/mydata` 目录：

```
docker run -it -v my-volume:/mydata alpine sh
```

```
docker volume inspect my-volume
[
    {
        "CreatedAt": "2018-03-28T14:52:49Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/my-volume/_data",
        "Name": "my-volume",
        "Options": {},
        "Scope": "local"
    }
]
```

可以看到，`volume` 在 `host` 机器的目录为 `/var/lib/docker/volumes/my-volume/_data` 。此时，如果 `my-volume` 不存在，那么 `docker` 会自动创建 `my-volume`，然后再挂载。

也可以不指定 `host`上的 `volume`：

```
docker run -it -v /mydata alpine sh
```

此时 `docker` 将自动创建一个匿名的 `volume`，并将其挂载到 `container` 中的 `/mydata` 目录。匿名 `volume` 在 `host` 机器上的目录路径类似于：`/var/lib/docker/volumes/300c2264cd0acfe862507eedf156eb61c197720f69e7e9a053c87c2182b2e7d8/_data`。

除了让 `docker` 帮我们自动创建 `volume`，我们也可以自行创建：

```
docker volume create my-volume-2
```

然后将这个已有的 `my-volume-2` 挂载到 `container` 中:

```
docker run -it -v my-volume-2:/mydata alpine sh
```

需要注意的是，与`bind mount`不同的是，如果 `volume` 是空的而 `container` 中的目录有内容，那么 `docker` 会将 `container` 目录中的内容拷贝到 `volume` 中，但是如果 `volume` 中已经有内容，则会将 `container` 中的目录覆盖。请参考这里。