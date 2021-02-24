    查看firewall服务状态
    systemctl status firewalld
    
    查看firewall的状态
    firewall-cmd --state
    
    开启
    service firewalld start
    
    重启
    service firewalld restart
    
    关闭
    service firewalld stop
    
    查看防火墙规则
    firewall-cmd --list-all 
    
    # 查询端口是否开放
    firewall-cmd --query-port=8080/tcp
    # 开放80端口
    firewall-cmd --permanent --add-port=80/tcp
    # 移除端口
    firewall-cmd --permanent --remove-port=8080/tcp
    
    #重启防火墙(修改配置后要重启防火墙)
    firewall-cmd --reload
    
    # 参数解释
    1、firwall-cmd：是Linux提供的操作firewall的一个工具；
    2、--permanent：表示设置为持久；
    3、--add-port：标识添加的端口；


配置firewalld-cmd

    查看版本： firewall-cmd --version
    查看帮助： firewall-cmd --help
    显示状态： firewall-cmd --state
    查看所有打开的端口： firewall-cmd --zone=public --list-ports
    更新防火墙规则： firewall-cmd --reload
    查看区域信息: firewall-cmd --get-active-zones
    查看指定接口所属区域： firewall-cmd --get-zone-of-interface=eth0
    拒绝所有包：firewall-cmd --panic-on
    取消拒绝状态： firewall-cmd --panic-off
    查看是否拒绝： firewall-cmd --query-panic