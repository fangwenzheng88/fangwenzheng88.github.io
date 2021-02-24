[toc]

# 1. 构造函数继承

构造函数继承没有用到 `prototype` 这种方式比较常见，定义和使用也较为简单，下面是一个例子：

- 👍 可以定义私有属性方法
- 👍 子类可以传递参数给父类
- ❌ 不能定义共享属性方法/或写在外面失去了封装性

<!-- more -->

```
function Parent(name, friends) {
    this.name = name
    this.friends = friends // 👍 可以定义私有 引用类型不会被共享
    this.share = share // ❌ 可以定义公有 但需要放在外部
    this.log = log // ❌ 避免重复声明，为了复用需要放在外面
}
// ❌ 公有属性和方法定义在外面失去了封装性
let share = [1, 2, 3]
function log() {
    return this.name
}

function Child(name, friends, gender) {
    Parent.call(this, name, friends) // 👍 可以在子类传递参数给父类
    this.gender = gender
}

//console.log(new Child('jack', 'tom', 18))

```

![](http://fang.images.fangwenzheng.top/js继承001.png)

# 2. 原型链继承

原型链模式需要手动重新绑定 `constructor` 而且不能定义私有变量

- 👍 可以定义公有属性方法
- ❌ 无论是定义还是继承都需要手动修改 `constructor`
- ❌ 封装性一般
- ❌ 不能定义私有属性方法
- ❌ 没办法向父类传递参数

```
function Parent() {}
Parent.prototype = {
    constructor: Parent, // ❌ 需要手动绑定 constructor
    name: 'oli', // ❌ 不能定义私有属性，全部都是公有
    friends: ['alice', 'troy'], // 👍 可以定义公有属性 所有实例都引用这个
    log: function() { // 👍 方法被共享了
        return this.name
    }
}
// 也可以写成多个 Parent.prototype.func1 = function(){} 封装性更差 但不用修改 constructor
// ❌ 封装性一般

function Child() {} // ❌ 没办法向父类传递参数
Child.prototype = new Parent() // 使用 new 操作符创建并重写 prototype
Child.prototype.constructor = Child // ❌ 每次继承都需要手动修改 constructor 谁叫你是覆盖 prototype 属性呢
```

# 3. 组合继承

上面两者结合即成为组合继承模式，这个是结合了两者的优势，在 ES6 的 class 出现之前的常用方法，看看例子：

- 👍 公有的写在原型
- 👍 私有的写在构造函数
- 👍 可以向父类传递参数
- ❌ 需要手动绑定 constructor
- ❌ 封装性一般
- ⚡ 重复调用父类性能损耗

```
function Parent(name, friends) {
    // 私有的写这里
    this.name = name // 👍 可以定义私有属性
    this.friends = friends // 👍 可以定义公有引用属性不会被共享
}
Parent.prototype = {
    // 公有的写这里
    constructor: Parent, // ❌ 需要手动绑定 constructor
    share: [1, 2, 3], // 👍 这里定义的公有属性会被共享
    log: function() { // 👍 方法被共享了
        return this.name
    }
}
// ❌ 封装性一般

function Child(name, friends, gender) {
    Parent.call(this, name, friends) // 👍 可以向父类传递参数 ⚡ 这里又调用了一次 Parent
    this.gender = gender
}
Child.prototype = new Parent() // 使用 new 操作符创建并重写 prototype ⚡ 这里调用了一次 Parent
// 有方法避免多次调用直接去掉 new 操作符 转而写成 Child.prototype = Parent.prototype 这样并不好，虽然避免出现重复调用但导致修改子类 constructor 的时候父类也被修改了
Child.prototype.constructor = Child // ❌ 每次继承都需要手动修改 constructor 谁叫你是覆盖 prototype 属性呢
// 如果使用 Child.prototype = Parent.prototype 那么 constructor 子类父类是同一个
```


# 4. 原型式继承

原型式继承直接使用 ES5 `Object.create` 方法，该方法的原理是创建一个构造函数，构造函数的原型指向对象，然后调用 new 操作符创建实例，并返回这个实例，本质是一个浅拷贝

- 👍 父类方法可以复用
- ❌ 父类引用属性全部被共享
- ❌ 子类不可传递参数给父类

```
let parent = {
    name: 'parent',
    share: [1, 2, 3], // ❌ 父类的引用属性全部被子类所共享
    log: function() { // 👍 父类方法可以复用
        return this.name
    }
}

let child = Object.create(parent) // ❌ 子类不能向父类传递参数
```

# 5. 寄生式继承

原型式继承的基础上为子类增加属性和方法

- 👍 父类方法可以复用
- 👍 增加了别的属性和方法
- ❌ 父类引用属性全部被共享
- ❌ 子类不可传递参数给父类

```
let parent = {
    name: 'parent',
    share: [1, 2, 3],
    log: function() {
        return this.name
    }
}

function create(obj) {
    let clone = Object.create(obj) // 本质上还是 Object.create
    clone.print = function() { // 增加一些属性或方法
        console.log(this.name)
    }
    return clone
}

let child = create(parent)
```

# 6. 寄生组合式继承

杂糅了原型链式、构造函数式、组合式、原型式、寄生式而形成的一种方式：

组合继承的方法会调用两次 `Parent`，一次是在 `Child.prototype = new Parent()` ，一次是在 `Parent.call()`。这个是组合继承的唯一缺点，寄生组合式解决了这个问题：

- 👍 公有的写在原型
- 👍 私有的写在构造函数
- 👍 可以向父类传递参数
- 👍 不会重复调用父类
- ❌ 需要手动绑定 constructor （如果重写 prototype）
- ❌ 需要调用额外的方法封装性一般

```
function Parent(name, friends) {
    this.name = name
    this.friends = friends
}
Parent.prototype = {
    constructor: Parent, // ❌ 需要手动绑定 constructor
    share: [1, 2, 3],
    log: function() {
        return this.name
    }
}

function Child(name, friends, gender) {
    Parent.call(this, name, friends) // ⚡ 这里只需要调用一次 Parent
    this.gender = gender
}
// 上半部分和组合继承一样

let F = function() {} // 创建一个中介函数
F.prototype = Parent.prototype // 这个中介的原型指向 Parent 的原型
Child.prototype = new F() // 注意这里没有使用 new 操作符调用 Parent
Child.prototype.constructor = Child
```

对上述方法进行一个封装：

```
function Parent(name, friends) {
    this.name = name // 👍 可以定义私有属性
    this.friends = friends // 👍 可以定义公有引用属性不会被共享
}
Parent.prototype = {
    constructor: Parent, // ❌ 需要手动绑定 constructor
    share: [1, 2, 3], // 👍 这里定义的公有属性会被共享
    log: function() { // 👍 方法被共享了
        return this.name
    }
}

function Child(name, friends, gender) {
    Parent.call(this, name, friends) // 👍 可以向父类传递参数 ⚡ 这里又调用了一次 Parent
    this.gender = gender
}

function proto(child, parent) {
    child.prototype = Object.create(parent.prototype)
    child.prototype.constructor = child
}

proto(Child, Parent)
```

# 7. class继承
```
class Parent {
    constructor(name, friends) { // 该属性在构造函数上，不共享
        this.name = name
        this.friends = friends
    }
    log() { // 该方法在原型上，共享
        return this
    }
}
Parent.prototype.share = [1, 2, 3] // 原型上的属性，共享

class Child extends Parent {
    constructor(name, friends, gender) {
        super(name, friends)
        this.gender = gender
    }
}
```