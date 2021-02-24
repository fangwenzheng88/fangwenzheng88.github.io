[toc]

# 1. this

this是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件。this的绑定和函数声明的位置没有任何关系，**只取决于函数的调用方式**。

当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方法、传入的参数等信息。this就是记录的其中一个属性，会在函数执行的过程中用到。

# 2. this 绑定规则

> 箭头函数 -> new绑定 -> 显示绑定call/bind/apply -> 隐式绑定 -> 默认绑定

## 2.1. 默认绑定

默认绑定一般发生在回调函数,函数直接调用;

```
function test() {
    //严格模式下是undefined
    //非严格模式下是window
    console.log(this);
}
setTimeout(function () {
    //setTimeout的比较特殊
    //严格模式和非严格模式下都是window
    console.log(this);
});

arr.forEach(function () {
    //严格模式下是undefined
    //非严格模式下是window
    console.log(this);
});
```

## 2.2. 隐式绑定

这个通俗点用一句话概括就是谁调用就是指向谁

```
const obj = {
    name:'joy',
    getName(){
        console.log(this); //obj
        console.log(this.name); //joy
    }
};
obj.getName();
```

## 2.3. 显示绑定call,apply,bind

```
const obj1 = {
    name: 'joy',
    getName() {
        console.log(this); 
        console.log(this.name); 
    }
};

const obj2 = {
    name: 'sam'
};

obj1.getName.call(obj2); //obj2 sam
obj1.getName.apply(obj2); //obj2 sam
const fn = obj1.getName.bind(obj2);
fn();//obj2 sam
```

## 2.4. new绑定

```
function Vehicle() {
    this.a = 2
    console.log(this);
}
new Vehicle(); //this指向Vehicle这个new出来的对象
```

## 2.5. es6的箭头函数

es6的箭头函数比较特殊,箭头函数this为父作用域的this，不是调用时的this.要知道前四种方式,都是调用时确定,也就是动态的,而箭头函数的this指向是静态的,声明的时候就确定了下来.比较符合js的词法作用域吧

```
window.name = 'win';
const obj = {
    name: 'joy',
    age: 12,
    getName: () => {
        console.log(this); //其父作用域this是window,所以就是window
        console.log(this.name); //win 
    },
    getAge: function () {
        //通过obj.getAge调用,这里面this是指向obj
        setTimeout(() => {
            //所以这里this也是指向obj 所以结果是12
            console.log(this.age); 
        });
    }
};
obj.getName();
obj.getAge();
```

---





# 3. 第 1 章 关于this 

this关键字是JavaScript中最复杂的机制之一。它是一个很特别的关键字，被自动定义在所有函数 的作用域中。但是即使是非常有经验的JavaScript开发者也很难说清它到底指向什么。 

实际上，JavaScript中this的机制并没有那么先进，但是开发者往往会把理解过程复杂化，毫无疑 问，在缺乏清晰认识的情况下，this对你来说完全就是一种魔法。 

> “this”是沟通过程中极其常见的一个代词。所以，在交流过程中很难区分我们到底 把“this”当作代词还是当作关键字。清晰起见，我总一直使用this表示关键字，使用“this”或者 this来表示代词。 

<!-- more -->

## 3.1. 为什么要用this 

如果对于有经验的JavaScript开发者来说this都是一种非常复杂的机制，那它到底有用在哪里呢？ 真的值得我们付出这么大的代价学习吗？的确，在介绍怎么做之前我们需要先明白为什么。 下面我们来解释一下为什么要使用this： 

```
function identify() { 
    return this.name.toUpperCase(); 
}

function speak() { 
    var greeting = "Hello, I'm " + identify.call(this); 
    console.log(greeting); 
}
 
var me = { name: "Kyle" }; 
var you = { name: "Reader" }; 
identify.call(me); // KYLE 
identify.call( you ); // READER 
speak.call( me ); // Hello, 我是KYLE 
speak.call( you ); // Hello, 我是READER
```

看不懂这段代码？不用担心！我们很快就会讲解。现在请暂时抛开这些问题，专注于为什么。

这段代码可以在不同的上下文对象（me和you）中重复使用函数identify()和speak()，不用针对每 个对象编写不同版本的函数。 

如果不使用this，那就需要给identify()和speak()显式传入一个上下文对象。 
```
function identify(context) { 
    return context.name.toUpperCase(); 
}

function speak(context) { 
    var greeting = "Hello, I'm " + identify( context ); 
    console.log( greeting ); 
}

identify( you ); // READER 
speak(me); //Hello, 我是KYLE
```
然而，this提供了一种更优雅的方式来隐式“传递”一个对象引用，因此可以将API设计得更加简洁 并且易于复用。 

随着你的使用模式越来越复杂，显式传递上下文对象会让代码变得越来越混乱，使用this则不会 这样。当我们介绍对象和原型时，你就会明白函数可以自动引用合适的上下文对象有多重要。 

## 3.2. 误解 

我们之后会解释this到底是如何工作的，但是首先需要消除一些关于this的错误认识。 太拘泥于“this”的字面意思就会产生一些误解。有两种常见的对于this的解释，但是它们都是错误 的。 

### 3.2.1. 指向自身 

人们很容易把this理解成指向函数自身，这个推断从英语的语法角度来说是说得通的。 

那么为什么需要从函数内部引用函数自身呢？常见的原因是递归（从函数内部调用这个函数）或 者可以写一个在第一次被调用后自己解除绑定的事件处理器。 

JavaScript的新手开发者通常会认为，既然函数看作一个对象（JavaScript中的所有函数都是对 象），那就可以在调用函数时存储状态（属性的值）。这是可行的，有些时候也确实有用，但是在本书 即将介绍的许多模式中你会发现，除了函数对象还有许多更合适存储状态的地方。

不过现在我们先来分析一下这个模式，让大家看到this并不像我们所想的那样指向函数本身。
我们想要记录一下函数foo被调用的次数，思考一下下面的代码： 

```
function foo(num) { console.log( "foo: " + num ); // 记录foo被调用的次数 this.count++; }foo.count = 0; var i; for (i=0; i<10; i++)="" {="" if="" (i=""> 5) { foo( i ); } }// foo: 6 // foo: 7 // foo: 8 // foo: 9 // foo被调用了多少次？ console.log( foo.count ); // 0 -- WTF? 
```

console.log语句产生了4条输出，证明foo(..)确实被调用了4次，但是foo.count仍然是0。显然从字 面意思来理解this是错误的。 

执行foo.count = 0时，的确向函数对象foo添加了一个属性count。但是函数内部代码this.count中 的this并不是指向那个函数对象，所以虽然属性名相同，根对象却并不相同，困惑随之产生。 

> 负责的开发者一定会问“如果我增加的count属性和预期的不一样，那我增加的是哪 个count？”实际上，如果他深入探索的话，就会发现这段代码在无意中创建了一个全局变 量count（原理参见第2章），它的值为NaN。当然，如果他发现了这个奇怪的结果，那一定会接着 问：“为什么它是全局的，为什么它的值是NaN而不是其他更合适的值？”（参见第2章。） 

遇到这样的问题时，许多开发者并不会深入思考为什么this的行为和预期的不一致，也不会试图 回答那些很难解决但却非常重要的问题。他们只会回避这个问题并使用其他方法来达到目的，比 如创建另一个带有count属性的对象。 

```
function foo(num) { 
    console.log( "foo: " + num );
    // 记录foo被调用的次数 
    data.count++; 
}

var data = { count: 0 };

var i; 

for (i=0; i<10; i++) { 
    if (i > 5) { 
        foo( i ); 
    } 
}
// foo: 6 
// foo: 7 
// foo: 8 
// foo: 9 
// foo被调用了多少次？ 
console.log( data.count ); // 4 
```

从某种角度来说这个方法确实“解决”了问题，但可惜它忽略了真正的问题——无法理解this的含 义和工作原理——而是返回舒适区，使用了一种更熟悉的技术：词法作用域。 

> 词法作用域是一种非常优秀并且有用的技术。我丝毫没有贬低它的意思（可以参考本书 第一部分“作用域和闭包”）。但是如果你仅仅是因为无法猜对this的用法，就放弃学习this而去 使用词法作用域，就不能算是一种很好的解决办法了。 

如果要从函数对象内部引用它自身，那只使用this是不够的。一般来说你需要通过一个指向函数 对象的词法标识符（变量）来引用它。 

思考一下下面这两个函数： 

```
function foo() { 
    foo.count = 4; // foo指向它自身 
}

setTimeout( function(){ 
    // 匿名（没有名字的）函数无法指向自身 
}, 10 ); 
```

第一个函数被称为具名函数，在它内部可以使用foo来引用自身。 

但是在第二个例子中，传入setTimeout(..)的回调函数没有名称标识符（这种函数被称为匿名函 数），因此无法从函数内部引用自身。

> 还有一种传统的但是现在已经被弃用和批判的用法，是使用arguments.callee来引用当前 正在运行的函数对象。这是唯一一种可以从匿名函数对象内部引用自身的方法。然而，更好的 方式是避免使用匿名函数，至少在需要自引用时使用具名函数（表达式）。arguments.callee已 经被弃用，不应该再使用它。 

所以，对于我们的例子来说，另一种解决方法是使用foo标识符替代this来引用函数对象： 


```
function foo(num) { 
    console.log( "foo: " + num ); 
    // 记录foo被调用的次数 
    foo.count++; 
}

foo.count = 0 var i; 

for (i=0; i<10; i++) { 
    if (i > 5) { 
        foo( i ); 
    } 
}

// foo: 6 
// foo: 7 
// foo: 8 
// foo: 9 

// foo被调用了多少次？ 
console.log( foo.count ); // 4 
```

然而，这种方法同样回避了this的问题，并且完全依赖于变量foo的词法作用域。 

另一种方法是强制this指向foo函数对象： 

```
function foo(num) { 
    console.log( "foo: " + num ); 
    // 记录foo被调用的次数 
    // 注意，在当前的调用方式下（参见下方代码），this确实指向foo 
    this.count++; 
}

foo.count = 0; 
var i; 

for (i=0; i<10; i++) { 
    if (i > 5) { 
    // 使用call(..)可以确保this指向函数对象foo本身 
    foo.call( foo, i ); 
    } 
}

// foo: 6 
// foo: 7 
// foo: 8 
// foo: 9 

// foo被调用了多少次？ 
console.log( foo.count ); // 4 
```

这次我们接受了this，没有回避它。如果你仍然感到困惑的话，不用担心，之后我们会详细解释具 体的原理。 

### 3.2.2. 它的作用域 

第二种常见的误解是，this指向函数的作用域。这个问题有点复杂，因为在某种情况下它是正确 的，但是在其他情况下它却是错误的。 

需要明确的是，this在任何情况下都不指向函数的词法作用域。在JavaScript内部，作用域确实和 对象类似，可见的标识符都是它的属性。但是作用域“对象”无法通过JavaScript代码访问，它存在于 JavaScript引擎内部。 

思考一下下面的代码，它试图（但是没有成功）跨越边界，使用this来隐式引用函数的词法作用域： 

```
function foo() { 
    var a = 2; 
    this.bar(); 
}

function bar() { 
    console.log( this.a ); 
}

foo(); // ReferenceError: a is not defined 
```

这段代码中的错误不止一个。虽然这段代码看起来好像是我们故意写出来的例子，但是实际上它 出自一个公共社区中互助论坛的精华代码。这段代码非常完美（同时也令人伤感）地展示了this多 么容易误导人。 

首先，这段代码试图通过this.bar()来引用bar()函数。这是绝对不可能成功的，我们之后会解释原 因。调用bar()最自然的方法是省略前面的this，直接使用词法引用标识符。 

此外，编写这段代码的开发者还试图使用this联通foo()和bar()的词法作用域，从而让bar()可以 访问foo()作用域里的变量a。这是不可能实现的，你不能使用this来引用一个词法作用域内部的东西。

每当你想要把this和词法作用域的查找混合使用时，一定要提醒自己，这是无法实现的。

## 3.3. this到底是什么 

排除了一些错误理解之后，我们来看看this到底是一种什么样的机制。 

之前我们说过this是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时 的各种条件。this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。 

当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包含函数在 哪里被调用（调用栈）、函数的调用方法、传入的参数等信息。this就是记录的其中一个属性，会在 函数执行的过程中用到。 

在下一章我们会学习如何寻找函数的调用位置，从而判断函数在执行过程中会如何绑定this。 

## 3.4. 小结 

对于那些没有投入时间学习this机制的JavaScript开发者来说，this的绑定一直是一件非常令人 困惑的事。this是非常重要的，但是猜测、尝试并出错和盲目地从Stack Overflow上复制和粘贴答 案并不能让你真正理解this的机制。 

学习this的第一步是明白this既不指向函数自身也不指向函数的词法作用域，你也许被这样的解 释误导过，但其实它们都是错误的。 

this实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。

# 4. 第 2 章 this全面解析 

在第1章中，我们排除了一些对于this的错误理解并且明白了每个函数的this是在调用时被绑定 的，完全取决于函数的调用位置（也就是函数的调用方法）。 

## 4.1. 调用位置 

在理解this的绑定过程之前，首先要理解调用位置：调用位置就是函数在代码中被调用的位置（而 不是声明的位置）。只有仔细分析调用位置才能回答这个问题：这个this到底引用的是什么？ 

通常来说，寻找调用位置就是寻找“函数被调用的位置”，但是做起来并没有这么简单，因为某些编 程模式可能会隐藏真正的调用位置。 

最重要的是要分析调用栈（就是为了到达当前执行位置所调用的所有函数）。我们关心的调用位置 就在当前正在执行的函数的前一个调用中。 

下面我们来看看到底什么是调用栈和调用位置： 

```
function baz() { 
    // 当前调用栈是：baz 
    // 因此，当前调用位置是全局作用域 
    
    console.log( "baz" ); bar(); 
    // <-- bar的调用位置 
}

function bar() { 
    // 当前调用栈是baz -> bar 
    // 因此，当前调用位置在baz中 
    
    console.log( "bar" ); 
    foo(); // <-- foo的调用位置 
}

function foo() { 
    // 当前调用栈是baz -> bar -> foo 
    // 因此，当前调用位置在bar中 
    
    console.log( "foo" ); 
}

baz(); // <-- baz的调用位置
```
📢注意我们是如何（从调用栈中）分析出真正的调用位置的，因为它决定了this的绑定。 

> 你可以把调用栈想象成一个函数调用链，就像我们在前面代码段的注释中所写的一样。但 是这种方法非常麻烦并且容易出错。另一个查看调用栈的方法是使用浏览器的调试工具。绝大
多数现代桌面浏览器都内置了开发者工具，其中包含JavaScript调试器。就本例来说，你可以在 工具中给foo()函数的第一行代码设置一个断点，或者直接在第一行代码之前插入一 条debugger;语句。运行代码时，调试器会在那个位置暂停，同时会展示当前位置的函数调用列 表，这就是你的调用栈。因此，如果你想要分析this的绑定，使用开发者工具得到调用栈，然后 找到栈中第二个元素，这就是真正的调用位置。 

## 4.2. 绑定规则 

我们来看看在函数的执行过程中调用位置如何决定this的绑定对象。 

你必须找到调用位置，然后判断需要应用下面四条规则中的哪一条。我们首先会分别解释这四条 规则，然后解释多条规则都可用时它们的优先级如何排列。 

### 4.2.1. 默认绑定 

首先要介绍的是最常用的函数调用类型：独立函数调用。可以把这条规则看作是无法应用其他规 则时的默认规则。 

思考一下下面的代码： 

```
function foo() { 
    console.log( this.a ); 
}

var a = 2; 

foo(); // 2 
```

你应该注意到的第一件事是，声明在全局作用域中的变量（比如var a = 2）就是全局对象的一个同 名属性。它们本质上就是同一个东西，并不是通过复制得到的，就像一个硬币的两面一样。 

接下来我们可以看到当调用foo()时，this.a被解析成了全局变量a。为什么？因为在本例中，函数 调用时应用了this的默认绑定，因此this指向全局对象。 

那么我们怎么知道这里应用了默认绑定呢？可以通过分析调用位置来看看foo()是如何调用的。在 代码中，foo()是直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定，无法应 用其他规则。 

如果使用严格模式（strict mode），那么全局对象将无法使用默认绑定，因此this会绑定 到undefined： 

```
function foo() {
    "use strict";
    console.log( this.a ); 
}

var a = 2; 

foo(); // TypeError: this is undefined 
```

这里有一个微妙但是非常重要的细节，虽然this的绑定规则完全取决于调用位置，但是只有foo() 运行在非strict mode下时，默认绑定才能绑定到全局对象；严格模式下与foo()的调用位置无关： 

```
function foo() { 
    console.log( this.a ); 
}

var a = 2; 

(function(){ 
    "use strict"; 

    foo(); // 2 
})();
```

> 通常来说你不应该在代码中混合使用strict mode和non-strict mode。整个程序要么严格 要么非严格。然而，有时候你可能会用到第三方库，其严格程度和你的代码有所不同，因此一定 要注意这类兼容性细节。 

### 4.2.2. 隐式绑定 

另一条需要考虑的规则是调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含，不 过这种说法可能会造成一些误导。 

思考下面的代码： 
```
function foo() { 
    console.log( this.a ); 
}

var obj = { a: 2, foo: foo };

obj.foo(); // 2 
```

首先需要注意的是foo()的声明方式，及其之后是如何被当作引用属性添加到obj中的。但是无论是 直接在obj中定义还是先定义再添加为引用属性，这个函数严格来说都不属于obj对象。

然而，调用位置会使用obj上下文来引用函数，因此你可以说函数被调用时obj对象“拥有”或者“包 含”它。 

无论你如何称呼这个模式，当foo()被调用时，它的落脚点确实指向obj对象。当函数引用有上下文 对象时，隐式绑定规则会把函数调用中的this绑定到这个上下文对象。因为调用foo()时this被绑 定到obj，因此this.a和obj.a是一样的。 

对象属性引用链中只有最顶层或者说最后一层会影响调用位置。举例来说： 

```
function foo() { 
    console.log( this.a ); 
}

var obj2 = { a: 42, foo: foo };

var obj1 = { a: 2, obj2: obj2 };

obj1.obj2.foo(); // 42 
```

**隐式丢失**

一个最常见的this绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑 定，从而把this绑定到全局对象或者undefined上，取决于是否是严格模式。 

思考下面的代码： 

```
function foo() { 
    console.log( this.a ); 
}
    
var obj = { a: 2, foo: foo };

var bar = obj.foo; // 函数别名！ 

var a = "oops, global"; // a是全局对象的属性 

bar(); // "oops, global" 
```

虽然bar是obj.foo的一个引用，但是实际上，它引用的是foo函数本身，因此此时的bar()其实是一 个不带任何修饰的函数调用，因此应用了默认绑定。

一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时： 

```
function foo() { 
    console.log( this.a ); 
}

function doFoo(fn) { 
    // fn其实引用的是foo 
    
    fn(); // <-- 调用位置！ 
}

var obj = { a: 2, foo: foo };

var a = "oops, global"; // a是全局对象的属性 

doFoo( obj.foo ); // "oops, global" 
```

参数传递其实就是一种隐式赋值，因此我们传入函数时也会被隐式赋值，所以结果和上一个例子 一样。 

如果把函数传入语言内置的函数而不是传入你自己声明的函数，会发生什么呢？结果是一样的，没 有区别：

```
function foo() { 
    
    console.log( this.a ); 
    
}

var obj = { a: 2, foo: foo };

var a = "oops, global"; // a是全局对象的属性 

setTimeout( obj.foo, 100 ); // "oops, global" 
```

JavaScript环境中内置的setTimeout()函数实现和下面的伪代码类似： 

```
function setTimeout(fn,delay) {    
    // 等待delay毫秒 
    fn(); // <-- 调用位置！ 
}
```

就像我们看到的那样，回调函数丢失this绑定是非常常见的。除此之外，还有一种情况this的行为 会出乎我们意料：调用回调函数的函数可能会修改this。在一些流行的JavaScript库中事件处理器常会把回调函数的this强制绑定到触发事件的DOM元素上。这在一些情况下可能很有用，但是有 时它可能会让你感到非常郁闷。遗憾的是，这些工具通常无法选择是否启用这个行为。 

无论是哪种情况，this的改变都是意想不到的，实际上你无法控制回调函数的执行方式，因此就没 有办法控制会影响绑定的调用位置。之后我们会介绍如何通过固定this来修复（这里是双关，“修 复”和“固定”的英语单词都是fixing）这个问题。 


### 4.2.3. 显式绑定 

就像我们刚才看到的那样，在分析隐式绑定时，我们必须在一个对象内部包含一个指向函数的属 性，并通过这个属性间接引用函数，从而把this间接（隐式）绑定到这个对象上。 


那么如果我们不想在对象内部包含函数引用，而想在某个对象上强制调用函数，该怎么做呢？ JavaScript中的“所有”函数都有一些有用的特性（这和它们的[[原型]]有关——之后我们会详细介 绍原型），可以用来解决这个问题。具体点说，可以使用函数的call(..)和apply(..)方法。严格来 说，JavaScript的宿主环境有时会提供一些非常特殊的函数，它们并没有这两个方法。但是这样的 函数非常罕见，JavaScript提供的绝大多数函数以及你自己创建的所有函数都可以使用call(..) 和apply(..)方法。 

这两个方法是如何工作的呢？它们的第一个参数是一个对象，它们会把这个对象绑定到this，接着 在调用函数时指定这个this。因为你可以直接指定this的绑定对象，因此我们称之为显式绑定。 思考下面的代码： 

```
function foo() { 
    console.log( this.a ); 
}

var obj = { a:2 };

foo.call( obj ); // 2 
```

通过foo.call(..)，我们可以在调用foo时强制把它的this绑定到obj上。 如果你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作this的绑定对象，这个原 始值会被转换成它的对象形式（也就是new String(..)、new Boolean(..)或者new Number(..)）。这通 常被称为“装箱”。 

> 从this绑定的角度来说，call(..)和apply(..)是一样的，它们的区别体现在其他的参数
上，但是现在我们不用考虑这些。 

可惜，显式绑定仍然无法解决我们之前提出的丢失绑定问题。 

#### 4.2.3.1. 硬绑定 

但是显式绑定的一个变种可以解决这个问题。 

思考下面的代码： 

```
function foo() { 
    console.log( this.a ); 
}

var obj = { a:2 };

var bar = function() { 
    foo.call( obj ); 
};

bar(); // 2 
setTimeout( bar, 100 ); // 2 

// 硬绑定的bar不可能再修改它的this 
bar.call( window ); // 2 
```

我们来看看这个变种到底是怎样工作的。我们创建了函数bar()，并在它的内部手动调用 了foo.call(obj)，因此强制把foo的this绑定到了obj。无论之后如何调用函数bar，它总会手动 在obj上调用foo。这种绑定是一种显式的强制绑定，因此我们称之为硬绑定。 


硬绑定的典型应用场景就是创建一个包裹函数，传入所有的参数并返回接收到的所有值： 

```
function foo(something) { 
    console.log( this.a, something ); 
    return this.a + something; 
}

var obj = { 
    a:2 
};

var bar = function() { 
    return foo.apply( obj, arguments ); 
};

var b = bar( 3 ); // 2 3 
console.log( b ); // 5 
```

另一种使用方法是创建一个i可以重复使用的辅助函数：

```
function foo(something) { 
    console.log( this.a, something ); 
    return this.a + something; 
}

// 简单的辅助绑定函数 

function bind(fn, obj) { 
    return function() { 
        return fn.apply( obj, arguments ); 
    }; 
}

var obj = { a:2 };

var bar = bind( foo, obj ); 

var b = bar( 3 ); // 2 3 
console.log( b ); // 5 

```
由于硬绑定是一种非常常用的模式，所以在ES5中提供了内置的方法
Function.prototype.bind，它 的用法如下： 

```
function foo(something) { 
    console.log( this.a, something ); 
    return this.a + something; 
}

var obj = { a:2 };
var bar = foo.bind( obj ); 
var b = bar( 3 ); // 2 3 
console.log( b ); // 5 
```

bind(..)会返回一个硬编码的新函数，它会把参数设置为this的上下文并调用原始函数。 


#### 4.2.3.2. API调用的“上下文” 

第三方库的许多函数，以及JavaScript语言和宿主环境中许多新的内置函数，都提供了一个可选的 参数，通常被称为“上下文”（context），其作用和bind(..)一样，确保你的回调函数使用指定的this。 举例来说： 

```
function foo(el) { 
    console.log( el, this.id ); 
}

var obj = {
    id: "awesome" 
};

// 调用foo(..)时把this绑定到obj 
[1, 2, 3].forEach( foo, obj ); 
// 1 awesome 2 awesome 3 awesome 
```
这些函数实际上就是通过call(..)或者apply(..)实现了显式绑定，这样你可以少些一些代码。 

### 4.2.4. new绑定 

这是第四条也是最后一条this的绑定规则，在讲解它之前我们首先需要澄清一个非常常见的关于 JavaScript中函数和对象的误解。 

在传统的面向类的语言中，“构造函数”是类中的一些特殊方法，使用new初始化类时会调用类中的 构造函数。通常的形式是这样的： 

```
something = new MyClass(..); 
```

JavaScript也有一个new操作符，使用方法看起来也和那些面向类的语言一样，绝大多数开发者都 认为JavaScript中new的机制也和那些语言一样。然而，JavaScript中new的机制实际上和面向类的 语言完全不同。 

首先我们重新定义一下JavaScript中的“构造函数”。JavaScript，构造函数只是一些使用new操作符 时被调用的函数。它们并不会属于某个类，也不会实例化一个类。实际上，它们甚至都不能说是一 种特殊的函数类型，它们只是被new操作符调用的普通函数而已。 

举例来说，思考一下Number(..)作为构造函数时的行为，ES5.1中这样描述它： 

> 15.7.2 Number构造函数 <br><br>
当Number在new表达式中被调用时，它是一个构造函数：它会初始化新创建的对象。 

所以，包括内置对象函数（比如Number(..)，详情请查看第3章）在内的所有函数都可以用new来调 用，这种函数调用被称为构造函数调用。这里有一个重要但是非常细微的区别：实际上并不存在所 谓的“构造函数”，只有对于函数的“构造调用”。 

使用new来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。 

1. 创建（或者说构造）一个全新的对象。 
2. 这个新对象会被执行[[原型]]连接。
3. 这个新对象会绑定到函数调用的this。
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。

我们现在关心的是第1步、第3步、第4步，所以暂时跳过第2步，第5章会详细介绍它。 

思考下面的代码： 
```
function foo(a) { 
    this.a = a; 
}

var bar = new foo(2); 

console.log( bar.a ); // 2 
```
使用new来调用foo(..)时，我们会构造一个新对象并把它绑定到foo(..)调用中的this上。new是最 后一种可以影响函数调用时this绑定行为的方法，我们称之为new绑定。 

## 4.3. 优先级 

现在我们已经了解了函数调用中this绑定的四条规则，你需要做的就是找到函数的调用位置并判 断应当应用哪条规则。但是，如果某个调用位置可以应用多条规则该怎么办？为了解决这个问题就 必须给这些规则设定优先级，这就是我们接下来要介绍的内容。 

毫无疑问，默认绑定的优先级是四条规则中最低的，所以我们可以先不考虑它。 

隐式绑定和显式绑定哪个优先级更高？我们来测试一下： 

```
function foo() { 
    console.log( this.a ); 
}

var obj1 = { a: 2, foo: foo };

var obj2 = { a: 3, foo: foo };

obj1.foo(); // 2 
obj2.foo(); // 3 

obj1.foo.call( obj2 ); // 3 
obj2.foo.call( obj1 ); // 2 
```

可以看到，显式绑定优先级更高，也就是说在判断时应当先考虑是否可以应用显式绑定。

现在我们需要搞清楚new绑定和隐式绑定的优先级谁高谁低： 

```
function foo(something) { 
    this.a = something; 
}

var obj1 = { 
    foo: foo 
};

var obj2 = {}; 

obj1.foo( 2 ); 
console.log( obj1.a ); // 2 

obj1.foo.call( obj2, 3 ); 
console.log( obj2.a ); // 3 

var bar = new obj1.foo( 4 ); 
console.log( obj1.a ); // 2 
console.log( bar.a ); // 4 
```

可以看到new绑定比隐式绑定优先级高。但是new绑定和显式绑定谁的优先级更高呢？ 

> new和call/apply无法一起使用，因此无法通过new foo.call(obj1)来直接进行测试。
但是 我们可以使用硬绑定来测试它俩的优先级。 

在看代码之前先回忆一下硬绑定是如何工作的。Function.prototype.bind(..)会创建一个新的包装 函数，这个函数会忽略它当前的this绑定（无论绑定的对象是什么），并把我们提供的对象绑定 到this上。 

这样看起来硬绑定（也是显式绑定的一种）似乎比new绑定的优先级更高，无法使用new来控制this 绑定。 

我们看看是不是这样： 

```
function foo(something) { 
    this.a = something; 
}

var obj1 = {}; 

var bar = foo.bind( obj1 ); 
bar( 2 );
console.log( obj1.a ); // 2 

var baz = newbar(3); 
console.log( obj1.a ); // 2 
console.log( baz.a ); // 3
```

出乎意料！bar被硬绑定到obj1上，但是new bar(3)并没有像我们预计的那样把obj1.a修改为3。相 反，new修改了硬绑定（到obj1的）调用bar(..)中的this。因为使用了new绑定，我们得到了一个名字 为baz的新对象，并且baz.a的值是3。 

再来看看我们之前介绍的“裸”辅助函数bind： 

```
function bind(fn, obj) { 
    return function() { 
        fn.apply( obj, arguments ); 
    }; 
}
```

非常令人惊讶，因为看起来在辅助函数中new操作符的调用无法修改this绑定，但是在刚才的代码 中new确实修改了this绑定。 

实际上，ES5中内置的Function.prototype.bind(..)更加复杂。下面是MDN提供的一种bind(..)实 现，为了方便阅读我们对代码进行了排版： 

```
if (!Function.prototype.bind) { Function.prototype.bind = function(oThis) { if (typeof this !== "function") { // 与 ECMAScript 5 最接近的 // 内部 IsCallable 函数 throw new TypeError( "Function.prototype.bind - what is trying " + "to be bound is not callable" ); }var aArgs = Array.prototype.slice.call( arguments, 1 ), fToBind = this, fNOP = function(){}, fBound = function(){ return fToBind.apply( ( this instanceof fNOP && oThis ? this : oThis ),aArgs.concat( Array.prototype.slice.call( arguments ) ); } ;fNOP.prototype = this.prototype; fBound.prototype = new fNOP(); return fBound; }; }
```

> 这种bind(..)是一种polyfill代码（polyfill就是我们常说的刮墙用的腻子，polyfill代码 主要用于旧浏览器的兼容，比如说在旧的浏览器中并没有内置bind函数，因此可以使 用polyfill代码在旧浏览器中实现新的功能），对于new使用的硬绑定函数来说，这段polyfill 代码和ES5内置的bind(..)函数并不完全相同（后面会介绍为什么要在new中使用硬绑定函 数）。由于polyfill并不是内置函数，所以无法创建一个不包含.prototype的函数，因此会具有 一些副作用。如果你要在new中使用硬绑定函数并且依赖polyfill代码的话，一定要非常小心。 

下面是new修改this的相关代码： 

```
this instanceof fNOP && 
oThis ? this : oThis 

// ... 以及： 

fNOP.prototype = this.prototype; 
fBound.prototype = new fNOP(); 
```

我们并不会详细解释这段代码做了什么（这非常复杂并且不在我们的讨论范围之内），不过简单来 说，这段代码会判断硬绑定函数是否是被new调用，如果是的话就会使用新创建的this替换硬绑定 的this。 那么，为什么要在new中使用硬绑定函数呢？直接使用普通函数不是更简单吗？ 之所以要在new中使用硬绑定函数，主要目的是预先设置函数的一些参数，这样在使用new进行初 始化时就可以只传入其余的参数。bind(..)的功能之一就是可以把除了第一个参数（第一个参数用 于绑定this）之外的其他参数都传给下层的函数（这种技术称为“部分应用”，是“柯里化”的一种）。 举例来说： function foo(p1,p2) { this.val = p1 + p2; }// 之所以使用null是因为在本例中我们并不关心硬绑定的this是什么 // 反正使用new时this会被修改 var bar = foo.bind( null, "p1" ); var baz = new bar( "p2" ); baz.val; // p1p2 

### 4.3.1. 判断this 

现在我们可以根据优先级来判断函数在某个调用位置应用的是哪条规则。可以按照下面的顺序来 进行判断：

1. 函数是否在new中调用（new绑定）？如果是的话this绑定的是新创建的对象。 
```
var bar = new foo() 
```
2. 函数是否通过call、apply（显式绑定）或者硬绑定调用？如果是的话，this绑定的是指定的对象。 
```
var bar = foo.call(obj2) 
```
3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this绑定的是那个上下文对象。 
```
var bar = obj1.foo()
```

4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到undefined，否则绑定到全局对象。 
```
var bar = foo()
```

就是这样。对于正常的函数调用来说，理解了这些知识你就可以明白this的绑定原理了。不过…… 凡事总有例外。 

## 4.4. 绑定例外 

规则总有例外，这里也一样。 

在某些场景下this的绑定行为会出乎意料，你认为应当应用其他绑定规则时，实际上应用的可能 是默认绑定规则。 

### 4.4.1. 被忽略的this 

如果你把null或者undefined作为this的绑定对象传入call、apply或者bind，这些值在调用时会被 忽略，实际应用的是默认绑定规则： 

```
function foo() { 
    console.log( this.a ); 
}
var a = 2; 
foo.call( null ); // 2 
```
那么什么情况下你会传入null呢？ 

一种非常常见的做法是使用apply(..)来“展开”一个数组，并当作参数传入一个函数。类似 地，bind(..)可以对参数进行柯里化（预先设置一些参数），这种方法有时非常有用： 
```
function foo(a,b) { 
    console.log( "a:" + a + ", b:" + b );
}

// 把数组“展开”成参数 
foo.apply( null, [2, 3] ); // a:2, b:3 

// 使用 bind(..) 进行柯里化 
var bar = foo.bind( null, 2 ); 
bar( 3 ); // a:2, b:3 
```
这两种方法都需要传入一个参数当作this的绑定对象。如果函数并不关心this的话，你仍然需要 传入一个占位值，这时null可能是一个不错的选择，就像代码所示的那样。 

> 尽管本书中未提到，但在ES6中，可以用...操作符代替apply(..)来“展开”数 组，foo(...[1,2])和foo(1,2)是一样的，这样可以避免不必要的this绑定。可惜，在ES6中没有 柯里化的相关语法，因此还是需要使用bind(..)。 

然而，总是使用null来忽略this绑定可能产生一些副作用。如果某个函数确实使用了this（比如第 三方库中的一个函数），那默认绑定规则会把this绑定到全局对象（在浏览器中这个对象 是window），这将导致不可预计的后果（比如修改全局对象）。 

显而易见，这种方式可能会导致许多难以分析和追踪的bug。 

**更安全的this**

一种“更安全”的做法是传入一个特殊的对象，把this绑定到这个对象不会对你的程序产生任何副 作用。就像网络（以及军队）一样，我们可以创建一个“DMZ”（demilitarized zone，非军事区）对象 ——它就是一个空的非委托的对象（委托在第5章和第6章介绍）。 

如果我们在忽略this绑定时总是传入一个DMZ对象，那就什么都不用担心了，因为任何对于this 的使用都会被限制在这个空对象中，不会对全局对象产生任何影响。 

由于这个对象完全是一个空对象，我自己喜欢用变量名ø（这是数学中表示空集合符号的小写形 式）来表示它。在大多数键盘（比如说Mac的US布局键盘）上都可以使用⌥+o（Option-o）来打出这 个符号。有些系统允许你为特殊符号设定快捷键。如果你不喜欢ø符号或者你的键盘不太容易打出 这个符号，那你可以换一个喜欢的名字来称呼它。 

无论你叫它什么，在JavaScript中创建一个空对象最简单的方法都是Object.create(null)（详细介 绍请看第5章）。Object.create(null)和{}很像，但是并不会创建Object.prototype这个委托，所以它 比{}“更空”：

```
function foo(a,b) { 
    console.log( "a:" + a + ", b:" + b ); 
}

// 我们的DMZ空对象 
var ø = Object.create( null ); 

// 把数组展开成参数 
foo.apply( ø, [2, 3] ); // a:2, b:3 

// 使用bind(..)进行柯里化 
var bar = foo.bind( ø, 2 ); 
bar( 3 ); // a:2, b:3
```

使用变量名ø不仅让函数变得更加“安全”，而且可以提高代码的可读性，因为ø表示“我希望this是 空”，这比null的含义更清楚。不过再说一遍，你可以用任何喜欢的名字来命名DMZ对象。 

### 4.4.2. 间接引用 

另一个需要注意的是，你有可能（有意或者无意地）创建一个函数的“间接引用”，在这种情况下，调 用这个函数会应用默认绑定规则。 

间接引用最容易在赋值时发生： 
```
function foo() { 
    console.log( this.a ); 
}

var a = 2; 
var o = { a: 3, foo: foo }; 
var p = { a: 4 }; 

o.foo(); // 3 
(p.foo = o.foo)(); // 2 
```

赋值表达式p.foo = o.foo的返回值是目标函数的引用，因此调用位置是foo()而不是p.foo()或 者o.foo()。根据我们之前说过的，这里会应用默认绑定。 

📢注意：对于默认绑定来说，决定this绑定对象的并不是调用位置是否处于严格模式，而是函数体是 否处于严格模式。如果函数体处于严格模式，this会被绑定到undefined，否则this会被绑定到全局 对象。 

### 4.4.3. 软绑定 

之前我们已经看到过，硬绑定这种方式可以把this强制绑定到指定的对象（除了使用new时），防止函数调用应用默认绑定规则。问题在于，硬绑定会大大降低函数的灵活性，使用硬绑定之后就无法 使用隐式绑定或者显式绑定来修改this。 

如果可以给默认绑定指定一个全局对象和undefined以外的值，那就可以实现和硬绑定相同的效 果，同时保留隐式绑定或者显式绑定修改this的能力。 

可以通过一种被称为软绑定的方法来实现我们想要的效果： 
```
if (!Function.prototype.softBind) { 
    Function.prototype.softBind = function(obj) { 
        var fn = this; 
        // 捕获所有 curried 参数 
        var curried = [].slice.call( arguments, 1 ); 
        var bound = function() { 
            return fn.apply( 
                (!this || this === (window || global)) ? obj : this curried.concat.apply( curried, arguments ) 
                ); 
        };
        bound.prototype = Object.create( fn.prototype ); 
        return bound; 
    }; 
}
```

除了软绑定之外，softBind(..)的其他原理和ES5内置的bind(..)类似。它会对指定的函数进行封 装，首先检查调用时的this，如果this绑定到全局对象或者undefined，那就把指定的默认对象obj 绑定到this，否则不会修改this。此外，这段代码还支持可选的柯里化（详情请查看之前和bind(..) 相关的介绍）。 

下面我们看看softBind是否实现了软绑定功能： 

```
function foo() { 
    console.log("name: " + this.name); 
}

var obj = { name: "obj" }, 
    obj2 = { name: "obj2" }, 
    obj3 = { name: "obj3" }; 
    
var fooOBJ = foo.softBind( obj ); 

fooOBJ(); // name: obj 

obj2.foo = foo.softBind(obj); 
obj2.foo(); // name: obj2 <---- 看！！！ 

fooOBJ.call( obj3 ); // name: obj3 <---- 看！ setTimeout( obj2.foo, 10 ); 
// name: obj <---- 应用了软绑定
```

可以看到，软绑定版本的foo()可以手动将this绑定到obj2或者obj3上，但如果应用默认绑定，则会 将this绑定到obj。

## 4.5. this词法 

我们之前介绍的四条规则已经可以包含所有正常的函数。但是ES6中介绍了一种无法使用这些规 则的特殊函数类型：箭头函数。 

箭头函数并不是使用function关键字定义的，而是使用被称为“胖箭头”的操作符=>定义的。箭头函 数不使用this的四种标准规则，而是根据外层（函数或者全局）作用域来决定this。 

我们来看看箭头函数的词法作用域： 
```
function foo() { 
    // 返回一个箭头函数 
    return (a) => { //this继承自foo() 
    console.log( this.a ); 
    }; 
}

var obj1 = { a:2 };
var obj2 = { a:3 };

var bar = foo.call( obj1 ); 
bar.call( obj2 ); // 2, 不是3！ 
```
foo()内部创建的箭头函数会捕获调用时foo()的this。由于foo()的this绑定到obj1，bar（引用箭头 函数）的this 也会绑定到obj1，箭头函数的绑定无法被修改。（new也不行！）

箭头函数最常用于回调函数中，例如事件处理器或者定时器： 


```
function foo() { 
    setTimeout(() => { 
        // 这里的this在此法上继承自foo() 
        console.log( this.a ); 
    },100); 
}
    
var obj = { a:2 };

foo.call( obj ); // 2 
```

箭头函数可以像bind(..)一样确保函数的this被绑定到指定对象，此外，其重要性还体现在它用更常见的词法作用域取代了传统的this机制。实际上，在ES6之前我们就已经在使用一种几乎和箭头 函数完全一样的模式。 

```
function foo() { 
    var self = this; // lexical capture of this 
    setTimeout( function(){ 
        console.log( self.a ); 
    }, 100 ); 
}

var obj = { a: 2 };
foo.call( obj ); // 2
```

虽然self = this和箭头函数看起来都可以取代bind(..)，但是从本质上来说，它们想替代的是this 机制。 

如果你经常编写this风格的代码，但是绝大部分时候都会使用self = this或者箭头函数来否 定this机制，那你或许应当： 

1. 只使用词法作用域并完全抛弃错误this风格的代码； 
2. 完全采用this风格，在必要时使用bind(..)，尽量避免使用self = this和箭头函数。 

当然，包含这两种代码风格的程序可以正常运行，但是在同一个函数或者同一个程序中混合使用 这两种风格通常会使代码更难维护，并且可能也会更难编写。 

## 4.6. 小结 

如果要判断一个运行中函数的this绑定，就需要找到这个函数的直接调用位置。找到之后就可以 顺序应用下面这四条规则来判断this的绑定对象。 
1. 由new调用？绑定到新创建的对象。 
2. 由call或者apply（或者bind）调用？绑定到指定的对象。 
3. 由上下文对象调用？绑定到那个上下文对象。 
4. 默认：在严格模式下绑定到undefined，否则绑定到全局对象。 

一定要注意，有些调用可能在无意中使用默认绑定规则。如果想“更安全”地忽略this绑定，你可以 使用一个DMZ对象，比如ø = Object.create(null)，以保护全局对象。 

ES6中的箭头函数并不会使用四条标准的绑定规则，而是根据当前的词法作用域来决定this，具体来说，箭头函数会继承外层函数调用的this绑定（无论this绑定到什么）。这其实和ES6之前代码中 的self = this机制一样。


# 5. 参考文章

<<你不知道的JavaScript>>