# Runnable/Thread

- 通常情况下的耗时操作会交给多线程来处理，Java中开启一个新线程很容易，继承自Thread或实现Runnable接口。下面是常规操作。

<img src="http://fang.images.fangwenzheng.top/20200421114253.png" style="zoom:67%;" />

- 开启多线程很多时候是为了利用CPU的多核能力。new Thread（）或实现Runnable很容易实现，那为何还需要Future、Callable呢？是JDK开发者嫌头发多了吗？
- 通常情况下我们只管一顿操作，开启线程扔出去，至于返回值我们开发中好像从来没管过。其实无论是new Thread（）还是实现Runnable在执行完了都是无法获取执行结果的，不是我们不想管而是管不了。至于线程执行成功还是失败，很多时候都是听天由命，因为大多情况下我们默认这个执行操作肯定会成功。出了问题也只能追日志了。
- 通过共享变量或者线程通信的方式倒是可以间接获取执行结果，但是相信我以你的水平，怕是要996解bug。
- 
# Future机制

## Callable

- 那既然到这里了，相信你也能猜到Java 1.5中引入的Callable就是解决这个返回值的问题，
```
package java.util.concurrent;

/** A task that returns a result and may throw an exception. ... */
@FunctionalInterface
public interface Callable<V> {
    /** Computes a result, or throws an exception if unable to do so. ... */
    V call() throws Exception;
}
```
- Callable是一个接口，一个函数式接口，也是个泛型接口。call（）有返回值，且返回值类型与泛型参数类型相同，且可以抛出异常。Callable可以看作是Runnable接口的补充。

# Future

- 也许Future的知名度更高，通常所说的Future机制而不是Callable机制。既然Callable可以解决无返回值的问题，那么Future又是什么呢？
- Future是为了配合Callable/Runnable而产生的，既然有返回值，那么返回什么？什么时候返回？这些问题其实都可以算在Future机制里。
- 简单来讲我认为Future是一个句柄，即Callable任务返回给调用方这么一个句柄，通过这个句柄我们可以跟这个异步任务联系起来，我们可以通过future来对任务查询、取消、执行结果的获取，是调用方与异步执行方之间沟通的桥梁。

```
package java.util.concurrent;

public interface Future<V> {

    /** Attempts to cancel execution of this task.  ... */
    boolean cancel(boolean mayInterruptIfRunning); // 取消任务

    /** Returns {@code true} if this task was cancelled before it completed .../
    boolean isCancelled(); // 判断任务是否已取消  

    /** Returns {@code true} if this task completed. ... */
    boolean isDone(); // 判断任务是否已结束

    /** Waits if necessary for the computation to complete, and then ...*/
    // 获得任务执行结果
    V get() throws InterruptedException, ExecutionException; 

    /** Waits if necessary for at most the given time for the computation ....*/
    // 获得任务执行结果，支持超时
    V get(long timeout, TimeUnit unit)
        throws InterruptedException, ExecutionException, TimeoutException; 
}
```

## FutureTask 

- 到现在基本清晰了，Future机制就是为了解决多线程返回值的问题。但是Callable、Future、RunnableFuture都是接口，接口不干活啊。没关系，FutureTask来了。

<img src="http://fang.images.fangwenzheng.top/2020042111590000.png" style="zoom:67%;" />

- FutureTask实现了RunnableFuture接口，同时具有Runnable、Future的能力，即既可以作为Future得到Callable的返回值，又可以作为一个Runnable。
- FutureTask是一个泛型类，下面是一个demo。

<img src="http://fang.images.fangwenzheng.top/20200421120139.png" style="zoom:67%;" />