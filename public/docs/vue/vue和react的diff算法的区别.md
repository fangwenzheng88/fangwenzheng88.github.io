# vue和react的diff算法的区别

vue和react的diff算法，都是忽略跨级比较，只做同级比较。`vue diff`时调动`patch`函数，参数是`vnode`和`oldVnode`，分别代表新旧节点。

1. vue比对节点，当节点元素类型相同，但是className不同，认为是不同类型元素，删除重建，而react会认为是同类型节点，只是修改节点属性

2. vue的列表比对，采用从两端到中间的比对方式，而react则采用从左到右依次比对的方式。当一个集合，只是把最后一个节点移动到了第一个，react会把前面的节点依次移动，而vue只会把最后一个节点移动到第一个。总体上，vue的对比方式更高效。



















**参考文章**

- [Vue和React中的diff算法核心](https://segmentfault.com/a/1190000021972083)
- [React 源码剖析系列 － 不可思议的 react diff](https://zhuanlan.zhihu.com/p/20346379)

