<head><meta charset="UTF-8"></head><h1 class="heading">事务隔离级别和MVCC</h1>
<p>标签： MySQL是怎样运行的</p>
<hr>
<h2 class="heading">事前准备</h2>
<p>为了故事的顺利发展，我们需要创建一个表：</p>
<pre><code class="hljs bash" lang="bash">CREATE TABLE hero (
    number INT,
    name VARCHAR(100),
    country varchar(100),
    PRIMARY KEY (number)
) Engine=InnoDB CHARSET=utf8;
</code></pre><blockquote class="warning"><p>小贴士：

注意我们把这个hero表的主键命名为number，而不是id，主要是想和后边要用到的事务id做区别，大家不用大惊小怪哈～ 
</p></blockquote><p>然后向这个表里插入一条数据：</p>
<pre><code class="hljs bash" lang="bash">INSERT INTO hero VALUES(1, <span class="hljs-string">'刘备'</span>, <span class="hljs-string">'蜀'</span>);
</code></pre><p>现在表里的数据就是这样的：</p>
<pre><code class="hljs bash" lang="bash">mysql&gt; SELECT * FROM hero;
+--------+--------+---------+
| number | name   | country |
+--------+--------+---------+
|      1 | 刘备   | 蜀      |
+--------+--------+---------+
1 row <span class="hljs-keyword">in</span> <span class="hljs-built_in">set</span> (0.00 sec)
</code></pre><h2 class="heading">事务隔离级别</h2>
<p>我们知道<code>MySQL</code>是一个<code>客户端／服务器</code>架构的软件，对于同一个服务器来说，可以有若干个客户端与之连接，每个客户端与服务器连接上之后，就可以称之为一个会话（<code>Session</code>）。每个客户端都可以在自己的会话中向服务器发出请求语句，一个请求语句可能是某个事务的一部分，也就是对于服务器来说可能同时处理多个事务。在事务简介的章节中我们说过事务有一个称之为<code>隔离性</code>的特性，理论上在某个事务对某个数据进行访问时，其他事务应该进行排队，当该事务提交之后，其他事务才可以继续访问这个数据。但是这样子的话对性能影响太大，我们既想保持事务的<code>隔离性</code>，又想让服务器在处理访问同一数据的多个事务时性能尽量高些，鱼和熊掌不可得兼，舍一部分<code>隔离性</code>而取性能者也。</p>
<h3 class="heading">事务并发执行遇到的问题</h3>
<p>怎么个舍弃法呢？我们先得看一下访问相同数据的事务在不保证串行执行（也就是执行完一个再执行另一个）的情况下可能会出现哪些问题：</p>
<ul>
<li>
<p>脏写（<code>Dirty Write</code>）</p>
<p>如果<span style="color:red">一个事务修改了另一个未提交事务修改过的数据</span>，那就意味着发生了<code>脏写</code>，示意图如下：</p>
<p></p><figure><img alt="image_1d8nigfq618jd1cc56231rt0uq19.png-78.2kB" src="https://user-gold-cdn.xitu.io/2019/4/18/16a2f43405cb6e70?w=1020&amp;h=503&amp;f=png&amp;s=80035"><figcaption></figcaption></figure><p></p>
<p>如上图，<code>Session A</code>和<code>Session B</code>各开启了一个事务，<code>Session B</code>中的事务先将<code>number</code>列为<code>1</code>的记录的<code>name</code>列更新为<code>'关羽'</code>，然后<code>Session A</code>中的事务接着又把这条<code>number</code>列为<code>1</code>的记录的<code>name</code>列更新为<code>张飞</code>。如果之后<code>Session B</code>中的事务进行了回滚，那么<code>Session A</code>中的更新也将不复存在，这种现象就称之为<code>脏写</code>。这时<code>Session A</code>中的事务就很懵逼，我明明把数据更新了，最后也提交事务了，怎么到最后说自己啥也没干呢？</p>
</li>
<li>
<p>脏读（<code>Dirty Read</code>）</p>
<p>如果<span style="color:red">一个事务读到了另一个未提交事务修改过的数据</span>，那就意味着发生了<code>脏读</code>，示意图如下：</p>
<p></p><figure><img alt="image_1d8nn50kndkd8641epplvelhk9.png-91.8kB" src="https://user-gold-cdn.xitu.io/2019/4/18/16a2f79b4eacc05d?w=1002&amp;h=479&amp;f=png&amp;s=94019"><figcaption></figcaption></figure><p></p>
<p>如上图，<code>Session A</code>和<code>Session B</code>各开启了一个事务，<code>Session B</code>中的事务先将<code>number</code>列为<code>1</code>的记录的<code>name</code>列更新为<code>'关羽'</code>，然后<code>Session A</code>中的事务再去查询这条<code>number</code>为<code>1</code>的记录，如果du到列<code>name</code>的值为<code>'关羽'</code>，而<code>Session B</code>中的事务稍后进行了回滚，那么<code>Session A</code>中的事务相当于读到了一个不存在的数据，这种现象就称之为<code>脏读</code>。</p>
</li>
<li>
<p>不可重复读（Non-Repeatable Read）</p>
<p>如果<span style="color:red">一个事务只能读到另一个已经提交的事务修改过的数据，并且其他事务每对该数据进行一次修改并提交后，该事务都能查询得到最新值</span>，那就意味着发生了<code>不可重复读</code>，示意图如下：</p>
<p></p><figure><img alt="image_1d8nk4k1e1mt51nsj1hg41cd7v5950.png-139.4kB" src="https://user-gold-cdn.xitu.io/2019/4/18/16a2f5b32bc1f76b?w=988&amp;h=482&amp;f=png&amp;s=142755"><figcaption></figcaption></figure><p></p>
<p>如上图，我们在<code>Session B</code>中提交了几个隐式事务（注意是隐式事务，意味着语句结束事务就提交了），这些事务都修改了<code>number</code>列为<code>1</code>的记录的列<code>name</code>的值，每次事务提交之后，如果<code>Session A</code>中的事务都可以查看到最新的值，这种现象也被称之为<code>不可重复读</code>。</p>
</li>
<li>
<p>幻读（Phantom）</p>
<p>如果<span style="color:red">一个事务先根据某些条件查询出一些记录，之后另一个事务又向表中插入了符合这些条件的记录，原先的事务再次按照该条件查询时，能把另一个事务插入的记录也读出来</span>，那就意味着发生了<code>幻读</code>，示意图如下：</p>
<p></p><figure><img alt="image_1d8nl564faluogc1eqn1am812v79.png-96.1kB" src="https://user-gold-cdn.xitu.io/2019/4/18/16a2f5b32d7b9ada?w=1019&amp;h=377&amp;f=png&amp;s=98399"><figcaption></figcaption></figure><p></p>
<p>如上图，<code>Session A</code>中的事务先根据条件<code>number &gt; 0</code>这个条件查询表<code>hero</code>，得到了<code>name</code>列值为<code>'刘备'</code>的记录；之后<code>Session B</code>中提交了一个隐式事务，该事务向表<code>hero</code>中插入了一条新记录；之后<code>Session A</code>中的事务再根据相同的条件<code>number &gt; 0</code>查询表<code>hero</code>，得到的结果集中包含<code>Session B</code>中的事务新插入的那条记录，这种现象也被称之为<code>幻读</code>。</p>
<p>有的同学会有疑问，那如果<code>Session B</code>中是删除了一些符合<code>number &gt; 0</code>的记录而不是插入新记录，那<code>Session A</code>中之后再根据<code>number &gt; 0</code>的条件读取的记录变少了，这种现象算不算<code>幻读</code>呢？明确说一下，这种现象不属于<code>幻读</code>，<code>幻读</code>强调的是一个事务按照某个相同条件多次读取记录时，后读取时读到了之前没有读到的记录。</p>
<blockquote class="warning"><p>小贴士：

那对于先前已经读到的记录，之后又读取不到这种情况，算啥呢？其实这相当于对每一条记录都发生了不可重复读的现象。幻读只是重点强调了读取到了之前读取没有获取到的记录。
</p></blockquote></li>
</ul>
<h3 class="heading">SQL标准中的四种隔离级别</h3>
<p>我们上边介绍了几种并发事务执行过程中可能遇到的一些问题，这些问题也有轻重缓急之分，我们给这些问题按照严重性来排一下序：</p>
<pre><code class="hljs bash" lang="bash">脏写 &gt; 脏读 &gt; 不可重复读 &gt; 幻读
</code></pre><p>我们上边所说的舍弃一部分隔离性来换取一部分性能在这里就体现在：<span style="color:red">设立一些隔离级别，隔离级别越低，越严重的问题就越可能发生</span>。有一帮人（并不是设计<code>MySQL</code>的大叔们）制定了一个所谓的<code>SQL标准</code>，在标准中设立了4个<code>隔离级别</code>：</p>
<ul>
<li>
<p><code>READ UNCOMMITTED</code>：未提交读。</p>
</li>
<li>
<p><code>READ COMMITTED</code>：已提交读。</p>
</li>
<li>
<p><code>REPEATABLE READ</code>：可重复读。</p>
</li>
<li>
<p><code>SERIALIZABLE</code>：可串行化。</p>
</li>
</ul>
<p><code>SQL标准</code>中规定，针对不同的隔离级别，并发事务可以发生不同严重程度的问题，具体情况如下：</p>
<table>
<thead>
<tr>
<th style="text-align:center">隔离级别</th>
<th style="text-align:center">脏读</th>
<th style="text-align:center">不可重复读</th>
<th style="text-align:center">幻读</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center"><code>READ UNCOMMITTED</code></td>
<td style="text-align:center">Possible</td>
<td style="text-align:center">Possible</td>
<td style="text-align:center">Possible</td>
</tr>
<tr>
<td style="text-align:center"><code>READ COMMITTED</code></td>
<td style="text-align:center">Not Possible</td>
<td style="text-align:center">Possible</td>
<td style="text-align:center">Possible</td>
</tr>
<tr>
<td style="text-align:center"><code>REPEATABLE READ</code></td>
<td style="text-align:center">Not Possible</td>
<td style="text-align:center">Not Possible</td>
<td style="text-align:center">Possible</td>
</tr>
<tr>
<td style="text-align:center"><code>SERIALIZABLE</code></td>
<td style="text-align:center">Not Possible</td>
<td style="text-align:center">Not Possible</td>
<td style="text-align:center">Not Possible</td>
</tr>
</tbody>
</table>
<p>也就是说：</p>
<ul>
<li>
<p><code>READ UNCOMMITTED</code>隔离级别下，可能发生<code>脏读</code>、<code>不可重复读</code>和<code>幻读</code>问题。</p>
</li>
<li>
<p><code>READ COMMITTED</code>隔离级别下，可能发生<code>不可重复读</code>和<code>幻读</code>问题，但是不可以发生<code>脏读</code>问题。</p>
</li>
<li>
<p><code>REPEATABLE READ</code>隔离级别下，可能发生<code>幻读</code>问题，但是不可以发生<code>脏读</code>和<code>不可重复读</code>的问题。</p>
</li>
<li>
<p><code>SERIALIZABLE</code>隔离级别下，各种问题都不可以发生。</p>
</li>
</ul>
<p><code>脏写</code>是怎么回事儿？怎么里边都没写呢？<span style="color:red">这是因为脏写这个问题太严重了，不论是哪种隔离级别，都不允许脏写的情况发生</span>。</p>
<h3 class="heading">MySQL中支持的四种隔离级别</h3>
<p>不同的数据库厂商对<code>SQL标准</code>中规定的四种隔离级别支持不一样，比方说<code>Oracle</code>就只支持<code>READ COMMITTED</code>和<code>SERIALIZABLE</code>隔离级别。本书中所讨论的<code>MySQL</code>虽然支持4种隔离级别，但与<code>SQL标准</code>中所规定的各级隔离级别允许发生的问题却有些出入，<span style="color:red">MySQL在REPEATABLE READ隔离级别下，是可以禁止幻读问题的发生的</span>（关于如何禁止我们之后会详细说明的）。</p>
<p><code>MySQL</code>的默认隔离级别为<code>REPEATABLE READ</code>，我们可以手动修改一下事务的隔离级别。</p>
<h4 class="heading">如何设置事务的隔离级别</h4>
<p>我们可以通过下边的语句修改事务的隔离级别：</p>
<pre><code class="hljs bash" lang="bash">SET [GLOBAL|SESSION] TRANSACTION ISOLATION LEVEL level;
</code></pre><p>其中的<code>level</code>可选值有4个：</p>
<pre><code class="hljs bash" lang="bash">level: {
     REPEATABLE READ
   | READ COMMITTED
   | READ UNCOMMITTED
   | SERIALIZABLE
}
</code></pre><p>设置事务的隔离级别的语句中，在<code>SET</code>关键字后可以放置<code>GLOBAL</code>关键字、<code>SESSION</code>关键字或者什么都不放，这样会对不同范围的事务产生不同的影响，具体如下：</p>
<ul>
<li>
<p>使用<code>GLOBAL</code>关键字（在全局范围影响）：</p>
<p>比方说这样：</p>
<pre><code class="hljs bash" lang="bash">SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;
</code></pre><p>则：</p>
<ul>
<li>
<p>只对执行完该语句之后产生的会话起作用。</p>
</li>
<li>
<p>当前已经存在的会话无效。</p>
</li>
</ul>
</li>
<li>
<p>使用<code>SESSION</code>关键字（在会话范围影响）：</p>
<p>比方说这样：</p>
<pre><code class="hljs bash" lang="bash">SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;
</code></pre><p>则：</p>
<ul>
<li>
<p>对当前会话的所有后续的事务有效</p>
</li>
<li>
<p>该语句可以在已经开启的事务中间执行，但不会影响当前正在执行的事务。</p>
</li>
<li>
<p>如果在事务之间执行，则对后续的事务有效。</p>
</li>
</ul>
</li>
<li>
<p>上述两个关键字都不用（只对执行语句后的下一个事务产生影响）：</p>
<p>比方说这样：</p>
<pre><code class="hljs bash" lang="bash">SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
</code></pre><p>则：</p>
<ul>
<li>
<p>只对当前会话中下一个即将开启的事务有效。</p>
</li>
<li>
<p>下一个事务执行完后，后续事务将恢复到之前的隔离级别。</p>
</li>
<li>
<p>该语句不能在已经开启的事务中间执行，会报错的。</p>
</li>
</ul>
</li>
</ul>
<p>如果我们在服务器启动时想改变事务的默认隔离级别，可以修改启动参数<code>transaction-isolation</code>的值，比方说我们在启动服务器时指定了<code>--transaction-isolation=SERIALIZABLE</code>，那么事务的默认隔离级别就从原来的<code>REPEATABLE READ</code>变成了<code>SERIALIZABLE</code>。</p>
<p>想要查看当前会话默认的隔离级别可以通过查看系统变量<code>transaction_isolation</code>的值来确定：</p>
<pre><code class="hljs bash" lang="bash">mysql&gt; SHOW VARIABLES LIKE <span class="hljs-string">'transaction_isolation'</span>;
+-----------------------+-----------------+
| Variable_name         | Value           |
+-----------------------+-----------------+
| transaction_isolation | REPEATABLE-READ |
+-----------------------+-----------------+
1 row <span class="hljs-keyword">in</span> <span class="hljs-built_in">set</span> (0.02 sec)
</code></pre><p>或者使用更简便的写法：</p>
<pre><code class="hljs bash" lang="bash">mysql&gt; SELECT @@transaction_isolation;
+-------------------------+
| @@transaction_isolation |
+-------------------------+
| REPEATABLE-READ         |
+-------------------------+
1 row <span class="hljs-keyword">in</span> <span class="hljs-built_in">set</span> (0.00 sec)
</code></pre><blockquote class="warning"><p>小贴士：

我们也可以使用设置系统变量transaction_isolation的方式来设置事务的隔离级别，不过我们前边介绍过，一般系统变量只有GLOBAL和SESSION两个作用范围，而这个transaction_isolation却有3个（与上边 SET TRANSACTION ISOLATION LEVEL的语法相对应），设置语法上有些特殊，更多详情可以参见文档：https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_transaction_isolation。

另外，transaction_isolation是在MySQL 5.7.20的版本中引入来替换tx_isolation的，如果你使用的是之前版本的MySQL，请将上述用到系统变量transaction_isolation的地方替换为tx_isolation。
</p></blockquote><h2 class="heading">MVCC原理</h2>
<h3 class="heading">版本链</h3>
<p>我们前边说过，对于使用<code>InnoDB</code>存储引擎的表来说，它的聚簇索引记录中都包含两个必要的隐藏列（<code>row_id</code>并不是必要的，我们创建的表中有主键或者非NULL的UNIQUE键时都不会包含<code>row_id</code>列）：</p>
<ul>
<li>
<p><code>trx_id</code>：每次一个事务对某条聚簇索引记录进行改动时，都会把该事务的<code>事务id</code>赋值给<code>trx_id</code>隐藏列。</p>
</li>
<li>
<p><code>roll_pointer</code>：每次对某条聚簇索引记录进行改动时，都会把旧的版本写入到<code>undo日志</code>中，然后这个隐藏列就相当于一个指针，可以通过它来找到该记录修改前的信息。</p>
</li>
</ul>
<p>比方说我们的表<code>hero</code>现在只包含一条记录：</p>
<pre><code class="hljs bash" lang="bash">mysql&gt; SELECT * FROM hero;
+--------+--------+---------+
| number | name   | country |
+--------+--------+---------+
|      1 | 刘备   | 蜀      |
+--------+--------+---------+
1 row <span class="hljs-keyword">in</span> <span class="hljs-built_in">set</span> (0.07 sec)
</code></pre><p>假设插入该记录的<code>事务id</code>为<code>80</code>，那么此刻该条记录的示意图如下所示：</p>
<p></p><figure><img alt="image_1d8oab1ubb7v5f41j2pai21co19.png-22.4kB" src="https://user-gold-cdn.xitu.io/2019/4/19/16a337f526c95a9e?w=934&amp;h=237&amp;f=png&amp;s=22949"><figcaption></figcaption></figure><p></p>
<blockquote class="warning"><p>小贴士：

实际上insert undo只在事务回滚时起作用，当事务提交后，该类型的undo日志就没用了，它占用的Undo Log Segment也会被系统回收（也就是该undo日志占用的Undo页面链表要么被重用，要么被释放）。虽然真正的insert undo日志占用的存储空间被释放了，但是roll_pointer的值并不会被清除，roll_pointer属性占用7个字节，第一个比特位就标记着它指向的undo日志的类型，如果该比特位的值为1时，就代表着它指向的undo日志类型为insert undo。所以我们之后在画图时都会把insert undo给去掉，大家留意一下就好了。
</p></blockquote><p>假设之后两个<code>事务id</code>分别为<code>100</code>、<code>200</code>的事务对这条记录进行<code>UPDATE</code>操作，操作流程如下：</p>
<p></p><figure><img alt="image_1d8obbc861ulkpt3no31gecrho16.png-92.3kB" src="https://user-gold-cdn.xitu.io/2019/4/19/16a337f52a913b66?w=939&amp;h=511&amp;f=png&amp;s=94535"><figcaption></figcaption></figure><p></p>
<blockquote class="warning"><p>小贴士：

能不能在两个事务中交叉更新同一条记录呢？哈哈，这不就是一个事务修改了另一个未提交事务修改过的数据，沦为了脏写了么？InnoDB使用锁来保证不会有脏写情况的发生，也就是在第一个事务更新了某条记录后，就会给这条记录加锁，另一个事务再次更新时就需要等待第一个事务提交了，把锁释放之后才可以继续更新。关于锁的更多细节我们后续的文章中再唠叨哈～
</p></blockquote><p>每次对记录进行改动，都会记录一条<code>undo日志</code>，每条<code>undo日志</code>也都有一个<code>roll_pointer</code>属性（<code>INSERT</code>操作对应的<code>undo日志</code>没有该属性，因为该记录并没有更早的版本），可以将这些<code>undo日志</code>都连起来，串成一个链表，所以现在的情况就像下图一样：</p>
<p></p><figure><img alt="image_1d8po6kgkejilj2g4t3t81evm20.png-81.7kB" src="https://user-gold-cdn.xitu.io/2019/4/19/16a33e277a98dbec?w=1144&amp;h=605&amp;f=png&amp;s=83629"><figcaption></figcaption></figure><p></p>
<p>对该记录每次更新后，都会将旧值放到一条<code>undo日志</code>中，就算是该记录的一个旧版本，随着更新次数的增多，所有的版本都会被<code>roll_pointer</code>属性连接成一个链表，我们把这个链表称之为<code>版本链</code>，<span style="color:red">版本链的头节点就是当前记录最新的值</span>。另外，每个版本中还包含生成该版本时对应的<code>事务id</code>，这个信息很重要，我们稍后就会用到。</p>
<h3 class="heading">ReadView</h3>
<p>对于使用<code>READ UNCOMMITTED</code>隔离级别的事务来说，由于可以读到未提交事务修改过的记录，所以直接读取记录的最新版本就好了；对于使用<code>SERIALIZABLE</code>隔离级别的事务来说，设计<code>InnoDB</code>的大叔规定使用加锁的方式来访问记录（加锁是啥我们后续文章中说哈）；对于使用<code>READ COMMITTED</code>和<code>REPEATABLE READ</code>隔离级别的事务来说，都必须保证读到已经提交了的事务修改过的记录，也就是说假如另一个事务已经修改了记录但是尚未提交，是不能直接读取最新版本的记录的，核心问题就是：<span style="color:red">需要判断一下版本链中的哪个版本是当前事务可见的</span>。为此，设计<code>InnoDB</code>的大叔提出了一个<code>ReadView</code>的概念，这个<code>ReadView</code>中主要包含4个比较重要的内容：</p>
<ul>
<li>
<p><code>m_ids</code>：表示在生成<code>ReadView</code>时当前系统中活跃的读写事务的<code>事务id</code>列表。</p>
</li>
<li>
<p><code>min_trx_id</code>：表示在生成<code>ReadView</code>时当前系统中活跃的读写事务中最小的<code>事务id</code>，也就是<code>m_ids</code>中的最小值。</p>
</li>
<li>
<p><code>max_trx_id</code>：表示生成<code>ReadView</code>时系统中应该分配给下一个事务的<code>id</code>值。</p>
<blockquote class="warning"><p>小贴士：

注意max_trx_id并不是m_ids中的最大值，事务id是递增分配的。比方说现在有id为1，2，3这三个事务，之后id为3的事务提交了。那么一个新的读事务在生成ReadView时，m_ids就包括1和2，min_trx_id的值就是1，max_trx_id的值就是4。
</p></blockquote></li>
<li>
<p><code>creator_trx_id</code>：表示生成该<code>ReadView</code>的事务的<code>事务id</code>。</p>
<blockquote class="warning"><p>小贴士：

我们前边说过，只有在对表中的记录做改动时（执行INSERT、DELETE、UPDATE这些语句时）才会为事务分配事务id，否则在一个只读事务中的事务id值都默认为0。
</p></blockquote></li>
</ul>
<p>有了这个<code>ReadView</code>，这样在访问某条记录时，只需要按照下边的步骤判断记录的某个版本是否可见：</p>
<ul>
<li>
<p>如果被访问版本的<code>trx_id</code>属性值与<code>ReadView</code>中的<code>creator_trx_id</code>值相同，意味着当前事务在访问它自己修改过的记录，所以该版本可以被当前事务访问。</p>
</li>
<li>
<p>如果被访问版本的<code>trx_id</code>属性值小于<code>ReadView</code>中的<code>min_trx_id</code>值，表明生成该版本的事务在当前事务生成<code>ReadView</code>前已经提交，所以该版本可以被当前事务访问。</p>
</li>
<li>
<p>如果被访问版本的<code>trx_id</code>属性值大于<code>ReadView</code>中的<code>max_trx_id</code>值，表明生成该版本的事务在当前事务生成<code>ReadView</code>后才开启，所以该版本不可以被当前事务访问。</p>
</li>
<li>
<p>如果被访问版本的<code>trx_id</code>属性值在<code>ReadView</code>的<code>min_trx_id</code>和<code>max_trx_id</code>之间，那就需要判断一下<code>trx_id</code>属性值是不是在<code>m_ids</code>列表中，如果在，说明创建<code>ReadView</code>时生成该版本的事务还是活跃的，该版本不可以被访问；如果不在，说明创建<code>ReadView</code>时生成该版本的事务已经被提交，该版本可以被访问。</p>
</li>
</ul>
<p>如果某个版本的数据对当前事务不可见的话，那就顺着版本链找到下一个版本的数据，继续按照上边的步骤判断可见性，依此类推，直到版本链中的最后一个版本。如果最后一个版本也不可见的话，那么就意味着该条记录对该事务完全不可见，查询结果就不包含该记录。</p>
<p>在<code>MySQL</code>中，<code>READ COMMITTED</code>和<code>REPEATABLE READ</code>隔离级别的的一个非常大的区别就是<span style="color:red">它们生成ReadView的时机不同</span>。我们还是以表<code>hero</code>为例来，假设现在表<code>hero</code>中只有一条由<code>事务id</code>为<code>80</code>的事务插入的一条记录：</p>
<pre><code class="hljs bash" lang="bash">mysql&gt; SELECT * FROM hero;
+--------+--------+---------+
| number | name   | country |
+--------+--------+---------+
|      1 | 刘备   | 蜀      |
+--------+--------+---------+
1 row <span class="hljs-keyword">in</span> <span class="hljs-built_in">set</span> (0.07 sec)
</code></pre><p>接下来看一下<code>READ COMMITTED</code>和<code>REPEATABLE READ</code>所谓的<span style="color:red">生成ReadView的时机不同</span>到底不同在哪里。</p>
<h4 class="heading">READ COMMITTED —— 每次读取数据前都生成一个ReadView</h4>
<p>比方说现在系统里有两个<code>事务id</code>分别为<code>100</code>、<code>200</code>的事务在执行：</p>
<pre><code class="hljs bash" lang="bash"><span class="hljs-comment"># Transaction 100</span>
BEGIN;

UPDATE hero SET name = <span class="hljs-string">'关羽'</span> WHERE number = 1;

UPDATE hero SET name = <span class="hljs-string">'张飞'</span> WHERE number = 1;
</code></pre><pre><code class="hljs bash" lang="bash"><span class="hljs-comment"># Transaction 200</span>
BEGIN;

<span class="hljs-comment"># 更新了一些别的表的记录</span>
...
</code></pre><blockquote class="warning"><p>小贴士：

再次强调一遍，事务执行过程中，只有在第一次真正修改记录时（比如使用INSERT、DELETE、UPDATE语句），才会被分配一个单独的事务id，这个事务id是递增的。所以我们才在Transaction 200中更新一些别的表的记录，目的是让它分配事务id。
</p></blockquote><p>此刻，表<code>hero</code>中<code>number</code>为<code>1</code>的记录得到的版本链表如下所示：</p>
<p></p><figure><img alt="image_1d8poeb056ck1d552it4t91aro2d.png-63.7kB" src="https://user-gold-cdn.xitu.io/2019/4/19/16a33e277e11d7b8?w=1150&amp;h=382&amp;f=png&amp;s=65259"><figcaption></figcaption></figure><p></p>
<p>假设现在有一个使用<code>READ COMMITTED</code>隔离级别的事务开始执行：</p>
<pre><code class="hljs bash" lang="bash"><span class="hljs-comment"># 使用READ COMMITTED隔离级别的事务</span>
BEGIN;

<span class="hljs-comment"># SELECT1：Transaction 100、200未提交</span>
SELECT * FROM hero WHERE number = 1; <span class="hljs-comment"># 得到的列name的值为'刘备'</span>
</code></pre><p>这个<code>SELECT1</code>的执行过程如下：</p>
<ul>
<li>
<p>在执行<code>SELECT</code>语句时会先生成一个<code>ReadView</code>，<code>ReadView</code>的<code>m_ids</code>列表的内容就是<code>[100, 200]</code>，<code>min_trx_id</code>为<code>100</code>，<code>max_trx_id</code>为<code>201</code>，<code>creator_trx_id</code>为<code>0</code>。</p>
</li>
<li>
<p>然后从版本链中挑选可见的记录，从图中可以看出，最新版本的列<code>name</code>的内容是<code>'张飞'</code>，该版本的<code>trx_id</code>值为<code>100</code>，在<code>m_ids</code>列表内，所以不符合可见性要求，根据<code>roll_pointer</code>跳到下一个版本。</p>
</li>
<li>
<p>下一个版本的列<code>name</code>的内容是<code>'关羽'</code>，该版本的<code>trx_id</code>值也为<code>100</code>，也在<code>m_ids</code>列表内，所以也不符合要求，继续跳到下一个版本。</p>
</li>
<li>
<p>下一个版本的列<code>name</code>的内容是<code>'刘备'</code>，该版本的<code>trx_id</code>值为<code>80</code>，小于<code>ReadView</code>中的<code>min_trx_id</code>值<code>100</code>，所以这个版本是符合要求的，最后返回给用户的版本就是这条列<code>name</code>为<code>'刘备'</code>的记录。</p>
</li>
</ul>
<p>之后，我们把<code>事务id</code>为<code>100</code>的事务提交一下，就像这样：</p>
<pre><code class="hljs bash" lang="bash"><span class="hljs-comment"># Transaction 100</span>
BEGIN;

UPDATE hero SET name = <span class="hljs-string">'关羽'</span> WHERE number = 1;

UPDATE hero SET name = <span class="hljs-string">'张飞'</span> WHERE number = 1;

COMMIT;
</code></pre><p>然后再到<code>事务id</code>为<code>200</code>的事务中更新一下表<code>hero</code>中<code>number</code>为<code>1</code>的记录：</p>
<pre><code class="hljs bash" lang="bash"><span class="hljs-comment"># Transaction 200</span>
BEGIN;

<span class="hljs-comment"># 更新了一些别的表的记录</span>
...

UPDATE hero SET name = <span class="hljs-string">'赵云'</span> WHERE number = 1;

UPDATE hero SET name = <span class="hljs-string">'诸葛亮'</span> WHERE number = 1;
</code></pre><p>此刻，表<code>hero</code>中<code>number</code>为<code>1</code>的记录的版本链就长这样：</p>
<p></p><figure><img alt="image_1d8poudrjdrk4k0i22bj10g82q.png-78.6kB" src="https://user-gold-cdn.xitu.io/2019/4/19/16a33e277f08dc3c?w=1112&amp;h=585&amp;f=png&amp;s=80473"><figcaption></figcaption></figure><p></p>
<p>然后再到刚才使用<code>READ COMMITTED</code>隔离级别的事务中继续查找这个<code>number</code>为<code>1</code>的记录，如下：</p>
<pre><code class="hljs bash" lang="bash"><span class="hljs-comment"># 使用READ COMMITTED隔离级别的事务</span>
BEGIN;

<span class="hljs-comment"># SELECT1：Transaction 100、200均未提交</span>
SELECT * FROM hero WHERE number = 1; <span class="hljs-comment"># 得到的列name的值为'刘备'</span>

<span class="hljs-comment"># SELECT2：Transaction 100提交，Transaction 200未提交</span>
SELECT * FROM hero WHERE number = 1; <span class="hljs-comment"># 得到的列name的值为'张飞'</span>
</code></pre><p>这个<code>SELECT2</code>的执行过程如下：</p>
<ul>
<li>
<p>在执行<code>SELECT</code>语句时会<span style="color:red">又会单独生成</span>一个<code>ReadView</code>，该<code>ReadView</code>的<code>m_ids</code>列表的内容就是<code>[200]</code>（<code>事务id</code>为<code>100</code>的那个事务已经提交了，所以再次生成快照时就没有它了），<code>min_trx_id</code>为<code>200</code>，<code>max_trx_id</code>为<code>201</code>，<code>creator_trx_id</code>为<code>0</code>。</p>
</li>
<li>
<p>然后从版本链中挑选可见的记录，从图中可以看出，最新版本的列<code>name</code>的内容是<code>'诸葛亮'</code>，该版本的<code>trx_id</code>值为<code>200</code>，在<code>m_ids</code>列表内，所以不符合可见性要求，根据<code>roll_pointer</code>跳到下一个版本。</p>
</li>
<li>
<p>下一个版本的列<code>name</code>的内容是<code>'赵云'</code>，该版本的<code>trx_id</code>值为<code>200</code>，也在<code>m_ids</code>列表内，所以也不符合要求，继续跳到下一个版本。</p>
</li>
<li>
<p>下一个版本的列<code>name</code>的内容是<code>'张飞'</code>，该版本的<code>trx_id</code>值为<code>100</code>，小于<code>ReadView</code>中的<code>min_trx_id</code>值<code>200</code>，所以这个版本是符合要求的，最后返回给用户的版本就是这条列<code>name</code>为<code>'张飞'</code>的记录。</p>
</li>
</ul>
<p>以此类推，如果之后<code>事务id</code>为<code>200</code>的记录也提交了，再此在使用<code>READ COMMITTED</code>隔离级别的事务中查询表<code>hero</code>中<code>number</code>值为<code>1</code>的记录时，得到的结果就是<code>'诸葛亮'</code>了，具体流程我们就不分析了。总结一下就是：<span style="color:red">使用READ COMMITTED隔离级别的事务在每次查询开始时都会生成一个独立的ReadView</span>。</p>
<h4 class="heading">REPEATABLE READ —— 在第一次读取数据时生成一个ReadView</h4>
<p>对于使用<code>REPEATABLE READ</code>隔离级别的事务来说，只会在第一次执行查询语句时生成一个<code>ReadView</code>，之后的查询就不会重复生成了。我们还是用例子看一下是什么效果。</p>
<p>比方说现在系统里有两个<code>事务id</code>分别为<code>100</code>、<code>200</code>的事务在执行：</p>
<pre><code class="hljs bash" lang="bash"><span class="hljs-comment"># Transaction 100</span>
BEGIN;

UPDATE hero SET name = <span class="hljs-string">'关羽'</span> WHERE number = 1;

UPDATE hero SET name = <span class="hljs-string">'张飞'</span> WHERE number = 1;
</code></pre><pre><code class="hljs bash" lang="bash"><span class="hljs-comment"># Transaction 200</span>
BEGIN;

<span class="hljs-comment"># 更新了一些别的表的记录</span>
...
</code></pre><p>此刻，表<code>hero</code>中<code>number</code>为<code>1</code>的记录得到的版本链表如下所示：</p>
<p></p><figure><img alt="image_1d8pt2nd6moqtjn12hibgj91f37.png-60.9kB" src="https://user-gold-cdn.xitu.io/2019/4/19/16a33e277f5bfb75?w=1117&amp;h=361&amp;f=png&amp;s=62362"><figcaption></figcaption></figure><p></p>
<p>假设现在有一个使用<code>REPEATABLE READ</code>隔离级别的事务开始执行：</p>
<pre><code class="hljs bash" lang="bash"><span class="hljs-comment"># 使用REPEATABLE READ隔离级别的事务</span>
BEGIN;

<span class="hljs-comment"># SELECT1：Transaction 100、200未提交</span>
SELECT * FROM hero WHERE number = 1; <span class="hljs-comment"># 得到的列name的值为'刘备'</span>
</code></pre><p>这个<code>SELECT1</code>的执行过程如下：</p>
<ul>
<li>
<p>在执行<code>SELECT</code>语句时会先生成一个<code>ReadView</code>，<code>ReadView</code>的<code>m_ids</code>列表的内容就是<code>[100, 200]</code>，<code>min_trx_id</code>为<code>100</code>，<code>max_trx_id</code>为<code>201</code>，<code>creator_trx_id</code>为<code>0</code>。</p>
</li>
<li>
<p>然后从版本链中挑选可见的记录，从图中可以看出，最新版本的列<code>name</code>的内容是<code>'张飞'</code>，该版本的<code>trx_id</code>值为<code>100</code>，在<code>m_ids</code>列表内，所以不符合可见性要求，根据<code>roll_pointer</code>跳到下一个版本。</p>
</li>
<li>
<p>下一个版本的列<code>name</code>的内容是<code>'关羽'</code>，该版本的<code>trx_id</code>值也为<code>100</code>，也在<code>m_ids</code>列表内，所以也不符合要求，继续跳到下一个版本。</p>
</li>
<li>
<p>下一个版本的列<code>name</code>的内容是<code>'刘备'</code>，该版本的<code>trx_id</code>值为<code>80</code>，小于<code>ReadView</code>中的<code>min_trx_id</code>值<code>100</code>，所以这个版本是符合要求的，最后返回给用户的版本就是这条列<code>name</code>为<code>'刘备'</code>的记录。</p>
</li>
</ul>
<p>之后，我们把<code>事务id</code>为<code>100</code>的事务提交一下，就像这样：</p>
<pre><code class="hljs bash" lang="bash"><span class="hljs-comment"># Transaction 100</span>
BEGIN;

UPDATE hero SET name = <span class="hljs-string">'关羽'</span> WHERE number = 1;

UPDATE hero SET name = <span class="hljs-string">'张飞'</span> WHERE number = 1;

COMMIT;
</code></pre><p>然后再到<code>事务id</code>为<code>200</code>的事务中更新一下表<code>hero</code>中<code>number</code>为<code>1</code>的记录：</p>
<pre><code class="hljs bash" lang="bash"><span class="hljs-comment"># Transaction 200</span>
BEGIN;

<span class="hljs-comment"># 更新了一些别的表的记录</span>
...

UPDATE hero SET name = <span class="hljs-string">'赵云'</span> WHERE number = 1;

UPDATE hero SET name = <span class="hljs-string">'诸葛亮'</span> WHERE number = 1;
</code></pre><p>此刻，表<code>hero</code>中<code>number</code>为<code>1</code>的记录的版本链就长这样：</p>
<p></p><figure><img alt="image_1d8ptbc339kdk0b1du3nef6s03k.png-78.2kB" src="https://user-gold-cdn.xitu.io/2019/4/19/16a33e277f809c36?w=1099&amp;h=580&amp;f=png&amp;s=80117"><figcaption></figcaption></figure><p></p>
<p>然后再到刚才使用<code>REPEATABLE READ</code>隔离级别的事务中继续查找这个<code>number</code>为<code>1</code>的记录，如下：</p>
<pre><code class="hljs bash" lang="bash"><span class="hljs-comment"># 使用REPEATABLE READ隔离级别的事务</span>
BEGIN;

<span class="hljs-comment"># SELECT1：Transaction 100、200均未提交</span>
SELECT * FROM hero WHERE number = 1; <span class="hljs-comment"># 得到的列name的值为'刘备'</span>

<span class="hljs-comment"># SELECT2：Transaction 100提交，Transaction 200未提交</span>
SELECT * FROM hero WHERE number = 1; <span class="hljs-comment"># 得到的列name的值仍为'刘备'</span>
</code></pre><p>这个<code>SELECT2</code>的执行过程如下：</p>
<ul>
<li>
<p>因为当前事务的隔离级别为<code>REPEATABLE READ</code>，而之前在执行<code>SELECT1</code>时已经生成过<code>ReadView</code>了，所以此时直接复用之前的<code>ReadView</code>，之前的<code>ReadView</code>的<code>m_ids</code>列表的内容就是<code>[100, 200]</code>，<code>min_trx_id</code>为<code>100</code>，<code>max_trx_id</code>为<code>201</code>，<code>creator_trx_id</code>为<code>0</code>。</p>
</li>
<li>
<p>然后从版本链中挑选可见的记录，从图中可以看出，最新版本的列<code>name</code>的内容是<code>'诸葛亮'</code>，该版本的<code>trx_id</code>值为<code>200</code>，在<code>m_ids</code>列表内，所以不符合可见性要求，根据<code>roll_pointer</code>跳到下一个版本。</p>
</li>
<li>
<p>下一个版本的列<code>name</code>的内容是<code>'赵云'</code>，该版本的<code>trx_id</code>值为<code>200</code>，也在<code>m_ids</code>列表内，所以也不符合要求，继续跳到下一个版本。</p>
</li>
<li>
<p>下一个版本的列<code>name</code>的内容是<code>'张飞'</code>，该版本的<code>trx_id</code>值为<code>100</code>，而<code>m_ids</code>列表中是包含值为<code>100</code>的<code>事务id</code>的，所以该版本也不符合要求，同理下一个列<code>name</code>的内容是<code>'关羽'</code>的版本也不符合要求。继续跳到下一个版本。</p>
</li>
<li>
<p>下一个版本的列<code>name</code>的内容是<code>'刘备'</code>，该版本的<code>trx_id</code>值为<code>80</code>，小于<code>ReadView</code>中的<code>min_trx_id</code>值<code>100</code>，所以这个版本是符合要求的，最后返回给用户的版本就是这条列<code>c</code>为<code>'刘备'</code>的记录。</p>
</li>
</ul>
<p>也就是说两次<code>SELECT</code>查询得到的结果是重复的，记录的列<code>c</code>值都是<code>'刘备'</code>，这就是<code>可重复读</code>的含义。如果我们之后再把<code>事务id</code>为<code>200</code>的记录提交了，然后再到刚才使用<code>REPEATABLE READ</code>隔离级别的事务中继续查找这个<code>number</code>为<code>1</code>的记录，得到的结果还是<code>'刘备'</code>，具体执行过程大家可以自己分析一下。</p>
<h3 class="heading">MVCC小结</h3>
<p>从上边的描述中我们可以看出来，所谓的<code>MVCC</code>（Multi-Version Concurrency Control ，多版本并发控制）指的就是在使用<code>READ COMMITTD</code>、<code>REPEATABLE READ</code>这两种隔离级别的事务在执行普通的<code>SEELCT</code>操作时访问记录的版本链的过程，这样子可以使不同事务的<code>读-写</code>、<code>写-读</code>操作并发执行，从而提升系统性能。<code>READ COMMITTD</code>、<code>REPEATABLE READ</code>这两个隔离级别的一个很大不同就是：<span style="color:red">生成ReadView的时机不同，READ COMMITTD在每一次进行普通SELECT操作前都会生成一个ReadView，而REPEATABLE READ只在第一次进行普通SELECT操作前生成一个ReadView，之后的查询操作都重复使用这个ReadView就好了</span>。</p>
<blockquote class="warning"><p>小贴士：

我们之前说执行DELETE语句或者更新主键的UPDATE语句并不会立即把对应的记录完全从页面中删除，而是执行一个所谓的delete mark操作，相当于只是对记录打上了一个删除标志位，这主要就是为MVCC服务的，大家可以对比上边举的例子自己试想一下怎么使用。

另外，所谓的MVCC只是在我们进行普通的SEELCT查询时才生效，截止到目前我们所见的所有SELECT语句都算是普通的查询，至于啥是个不普通的查询，我们稍后再说哈～
</p></blockquote><h2 class="heading">关于purge</h2>
<p>大家有没有发现两件事儿：</p>
<ul>
<li>
<p>我们说<code>insert undo</code>在事务提交之后就可以被释放掉了，而<code>update undo</code>由于还需要支持<code>MVCC</code>，不能立即删除掉。</p>
</li>
<li>
<p>为了支持<code>MVCC</code>，对于<code>delete mark</code>操作来说，仅仅是在记录上打一个删除标记，并没有真正将它删除掉。</p>
</li>
</ul>
<p>随着系统的运行，在确定系统中包含最早产生的那个<code>ReadView</code>的事务不会再访问某些<code>update undo日志</code>以及被打了删除标记的记录后，有一个后台运行的<code>purge线程</code>会把它们真正的删除掉。关于更多的purge细节，我们将放到纸质书中进行详细唠叨，不见不散哈～</p>
