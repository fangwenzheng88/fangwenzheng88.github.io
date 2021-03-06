<head><meta charset="UTF-8"></head><h1 class="heading">MySQL 的数据目录</h1>
<p>标签： MySQL 是怎样运行的</p>
<hr>
<h2 class="heading">数据库和文件系统的关系</h2>
<p>我们知道像<code>InnoDB</code>、<code>MyISAM</code>这样的存储引擎都是把表存储在磁盘上的，而操作系统用来管理磁盘的那个东东又被称为<code>文件系统</code>，所以用专业一点的话来表述就是：<span style="color:red">像 <em><strong>InnoDB</strong></em> 、 <em><strong>MyISAM</strong></em> 这样的存储引擎都是把表存储在文件系统上的</span>。当我们想读取数据的时候，这些存储引擎会从文件系统中把数据读出来返回给我们，当我们想写入数据的时候，这些存储引擎会把这些数据又写回文件系统。本章就是要唠叨一下<code>InnoDB</code>和<code>MyISAM</code>这两个存储引擎的数据如何在文件系统中存储的。</p>
<h2 class="heading">MySQL数据目录</h2>
<p>MySQL服务器程序在启动时会到文件系统的某个目录下加载一些文件，之后在运行过程中产生的数据也都会存储到这个目录下的某些文件中，这个目录就称为<code>数据目录</code>，我们下边就要详细唠唠这个目录下具体都有哪些重要的东西。</p>
<h3 class="heading">数据目录和安装目录的区别</h3>
<p>我们之前只接触过<code>MySQL</code>的安装目录（在安装<code>MySQL</code>的时候我们可以自己指定），我们重点强调过这个<code>安装目录</code>下非常重要的<code>bin</code>目录，它里边存储了许多关于控制客户端程序和服务器程序的命令（许多可执行文件，比如<code>mysql</code>，<code>mysqld</code>，<code>mysqld_safe</code>等等等等好几十个）。而<code>数据目录</code>是用来存储<code>MySQL</code>在运行过程中产生的数据，一定要和本章要讨论的<code>安装目录</code>区别开！<span style="color:red">一定要区分开</span>！<span style="color:red">一定要区分开</span>！<span style="color:red">一定要区分开</span>！</p>
<h3 class="heading">如何确定MySQL中的数据目录</h3>
<p>那说了半天，到底<code>MySQL</code>把数据都存到哪个路径下呢？其实<code>数据目录</code>对应着一个系统变量<code>datadir</code>，我们在使用客户端与服务器建立连接之后查看这个系统变量的值就可以了：</p>
<pre><code class="hljs bash" lang="bash">mysql&gt; SHOW VARIABLES LIKE <span class="hljs-string">'datadir'</span>;
+---------------+-----------------------+
| Variable_name | Value                 |
+---------------+-----------------------+
| datadir       | /usr/<span class="hljs-built_in">local</span>/var/mysql/ |
+---------------+-----------------------+
1 row <span class="hljs-keyword">in</span> <span class="hljs-built_in">set</span> (0.00 sec)
</code></pre><p>从结果中可以看出，<span style="color:red">在我的计算机上</span><code>MySQL</code>的数据目录就是<code>/usr/local/var/mysql/</code>，你用你的计算机试试呗～</p>
<h2 class="heading">数据目录的结构</h2>
<p><code>MySQL</code>在运行过程中都会产生哪些数据呢？当然会包含我们创建的数据库、表、视图和触发器吧啦吧啦的用户数据，除了这些用户数据，为了程序更好的运行，<code>MySQL</code>也会创建一些其他的额外数据，我们接下来细细的品味一下这个<code>数据目录</code>下的内容。</p>
<h3 class="heading">数据库在文件系统中的表示</h3>
<p>每当我们使用<code>CREATE DATABASE 数据库名</code>语句创建一个数据库的时候，在文件系统上实际发生了什么呢？其实很简单，<span style="color:red">每个数据库都对应数据目录下的一个子目录，或者说对应一个文件夹</span>，我们每当我们新建一个数据库时，<code>MySQL</code>会帮我们做这两件事儿：</p>
<ol>
<li>
<p>在<code>数据目录</code>下创建一个和数据库名同名的子目录（或者说是文件夹）。</p>
</li>
<li>
<p>在该与数据库名同名的子目录下创建一个名为<code>db.opt</code>的文件，这个文件中包含了该数据库的各种属性，比方说该数据库的字符集和比较规则是个啥。</p>
</li>
</ol>
<p>比方说我们查看一下<span style="color:red">在我的计算机上</span>当前有哪些数据库：</p>
<pre><code class="hljs bash" lang="bash">mysql&gt; SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| charset_demo_db    |
| dahaizi            |
| mysql              |
| performance_schema |
| sys                |
| xiaohaizi          |
+--------------------+
7 rows <span class="hljs-keyword">in</span> <span class="hljs-built_in">set</span> (0.00 sec)
</code></pre><p>可以看到在我的计算机上当前有7个数据库，其中<code>charset_demo_db</code>、<code>dahaizi</code>和<code>xiaohaizi</code>数据库是我们自定义的，其余4个数据库是属于MySQL自带的系统数据库。我们再看一下<span style="color:red">我的计算机上</span>的<code>数据目录</code>下的内容：</p>
<pre><code class="hljs bash" lang="bash">.
├── auto.cnf
├── ca-key.pem
├── ca.pem
├── charset_demo_db
├── client-cert.pem
├── client-key.pem
├── dahaizi
├── ib_buffer_pool
├── ib_logfile0
├── ib_logfile1
├── ibdata1
├── ibtmp1
├── mysql
├── performance_schema
├── private_key.pem
├── public_key.pem
├── server-cert.pem
├── server-key.pem
├── sys
├── xiaohaizideMacBook-Pro.local.err
├── xiaohaizideMacBook-Pro.local.pid
└── xiaohaizi

6 directories, 16 files
</code></pre><p>当然这个数据目录下的文件和子目录比较多哈，但是如果仔细看的话，除了<code>information_schema</code>这个系统数据库外，其他的数据库在<code>数据目录</code>下都有对应的子目录。这个<code>information_schema</code>比较特殊，设计MySQL的大叔们对它的实现进行了特殊对待，没有使用相应的数据库目录，我们忽略它的存在就好了哈。</p>
<h3 class="heading">表在文件系统中的表示</h3>
<p>我们的数据其实都是以记录的形式插入到表中的，每个表的信息其实可以分为两种：</p>
<ol>
<li>
<p>表结构的定义</p>
</li>
<li>
<p>表中的数据</p>
</li>
</ol>
<p><code>表结构</code>就是该表的名称是啥，表里边有多少列，每个列的数据类型是啥，有啥约束条件和索引，用的是啥字符集和比较规则吧啦吧啦的各种信息，这些信息都体现在了我们的建表语句中了。为了保存这些信息，<code>InnoDB</code>和<code>MyISAM</code>这两种存储引擎都在<code>数据目录</code>下对应的数据库子目录下创建了一个专门用于描述表结构的文件，文件名是这样：</p>
<pre><code class="hljs bash" lang="bash">表名.frm
</code></pre><p>比方说我们在<code>dahaizi</code>数据库下创建一个名为<code>test</code>的表：</p>
<pre><code class="hljs bash" lang="bash">mysql&gt; USE dahaizi;
Database changed

mysql&gt; CREATE TABLE <span class="hljs-built_in">test</span> (
    -&gt;     c1 INT
    -&gt; );
Query OK, 0 rows affected (0.03 sec)
</code></pre><p>那在数据库<code>dahaizi</code>对应的子目录下就会创建一个名为<code>test.frm</code>的用于描述表结构的文件。值得注意的是，<span style="color:red">这个后缀名为.frm是以二进制格式存储的，我们直接打开会是乱码的～</span> 你还不赶紧在你的计算机上创建个表试试～</p>
<p>描述表结构的文件我们知道怎么存储了，那表中的数据存到什么文件中了呢？在这个问题上，不同的存储引擎就产生了分歧了，下边我们分别看一下<code>InnoDB</code>和<code>MyISAM</code>是用什么文件来保存表中数据的。</p>
<h4 class="heading">InnoDB是如何存储表数据的</h4>
<p>我们前边重点唠叨过<code>InnoDB</code>的一些实现原理，到现在为止我们应该熟悉下边这些东东：</p>
<ul>
<li>
<p><code>InnoDB</code>其实是使用<code>页</code>为基本单位来管理存储空间的，默认的<code>页</code>大小为<code>16KB</code>。</p>
</li>
<li>
<p>对于<code>InnoDB</code>存储引擎来说，每个索引都对应着一棵<code>B+</code>树，该<code>B+</code>树的每个节点都是一个数据页，数据页之间不必要是物理连续的，因为数据页之间有<code>双向链表</code>来维护着这些页的顺序。</p>
</li>
<li>
<p><code>InnoDB</code>的聚簇索引的叶子节点存储了完整的用户记录，也就是所谓的<span style="color:red">索引即数据，数据即索引</span>。</p>
</li>
</ul>
<p>为了更好的管理这些页，设计<code>InnoDB</code>的大叔们提出了一个<code>表空间</code>或者<code>文件空间</code>（英文名：<code>table space</code>或者<code>file space</code>）的概念，这个表空间是一个抽象的概念，它可以对应文件系统上一个或多个真实文件（不同表空间对应的文件数量可能不同）。每一个<code>表空间</code>可以被划分为很多很多很多个<code>页</code>，我们的表数据就存放在某个<code>表空间</code>下的某些页里。设计<code>InnoDB</code>的大叔将表空间划分为几种不同的类型，我们一个一个看一下。</p>
<h5 class="heading">系统表空间（system tablespace）</h5>
<p>这个所谓的<code>系统表空间</code>可以对应文件系统上一个或多个实际的文件，默认情况下，<code>InnoDB</code>会在<code>数据目录</code>下创建一个名为<code>ibdata1</code>（在你的数据目录下找找看有木有）、大小为<code>12M</code>的文件，这个文件就是对应的<code>系统表空间</code>在文件系统上的表示。怎么才<code>12M</code>？这么点儿还没插多少数据就用完了，哈哈，那是因为这个文件是所谓的<code>自扩展文件</code>，也就是当不够用的时候它会自己增加文件大小～</p>
<p>当然，如果你想让系统表空间对应文件系统上多个实际文件，或者仅仅觉得原来的<code>ibdata1</code>这个文件名难听，那可以在<code>MySQL</code>启动时配置对应的文件路径以及它们的大小，比如我们这样修改一下配置文件：</p>
<pre><code class="hljs bash" lang="bash">[server]
innodb_data_file_path=data1:512M;data2:512M:autoextend
</code></pre><p>这样在<code>MySQL</code>启动之后就会创建这两个512M大小的文件作为<code>系统表空间</code>，其中的<code>autoextend</code>表明这两个文件如果不够用会自动扩展<code>data2</code>文件的大小。</p>
<p>我们也可以把<code>系统表空间</code>对应的文件路径不配置到<code>数据目录</code>下，甚至可以配置到单独的磁盘分区上，涉及到的启动参数就是<code>innodb_data_file_path</code>和<code>innodb_data_home_dir</code>，具体的配置逻辑挺绕的，我们这就不多唠叨了，知道改哪个参数可以修改<code>系统表空间</code>对应的文件，有需要的时候到官方文档里一查就好了。</p>
<p>需要注意的一点是，在一个MySQL服务器中，系统表空间只有一份。从MySQL5.5.7到MySQL5.6.6之间的各个版本中，我们表中的数据都会被默认存储到这个 <em><strong>系统表空间</strong></em>。</p>
<h5 class="heading">独立表空间(file-per-table tablespace)</h5>
<p>在MySQL5.6.6以及之后的版本中，<code>InnoDB</code>并不会默认的把各个表的数据存储到系统表空间中，而是为每一个表建立一个独立表空间，也就是说我们创建了多少个表，就有多少个独立表空间。使用<code>独立表空间</code>来存储表数据的话，会在该表所属数据库对应的子目录下创建一个表示该<code>独立表空间</code>的文件，文件名和表名相同，只不过添加了一个<code>.ibd</code>的扩展名而已，所以完整的文件名称长这样：</p>
<pre><code class="hljs bash" lang="bash">表名.ibd
</code></pre><p>比方说假如我们使用了<code>独立表空间</code>去存储<code>xiaohaizi</code>数据库下的<code>test</code>表的话，那么在该表所在数据库对应的<code>xiaohaizi</code>目录下会为<code>test</code>表创建这两个文件：</p>
<pre><code class="hljs bash" lang="bash">test.frm
test.ibd
</code></pre><p>其中<code>test.ibd</code>文件就用来存储<code>test</code>表中的数据和索引。当然我们也可以自己指定使用<code>系统表空间</code>还是<code>独立表空间</code>来存储数据，这个功能由启动参数<code>innodb_file_per_table</code>控制，比如说我们想刻意将表数据都存储到<code>系统表空间</code>时，可以在启动<code>MySQL</code>服务器的时候这样配置：</p>
<pre><code class="hljs bash" lang="bash">[server]
innodb_file_per_table=0
</code></pre><p>当<code>innodb_file_per_table</code>的值为<code>0</code>时，代表使用系统表空间；当<code>innodb_file_per_table</code>的值为<code>1</code>时，代表使用独立表空间。不过<code>innodb_file_per_table</code>参数只对新建的表起作用，对于已经分配了表空间的表并不起作用。如果我们想把已经存在系统表空间中的表转移到独立表空间，可以使用下边的语法：</p>
<pre><code class="hljs bash" lang="bash">ALTER TABLE 表名 TABLESPACE [=] innodb_file_per_table;
</code></pre><p>或者把已经存在独立表空间的表转移到系统表空间，可以使用下边的语法：</p>
<pre><code class="hljs bash" lang="bash">ALTER TABLE 表名 TABLESPACE [=] innodb_system;
</code></pre><p>其中中括号扩起来的<code>=</code>可有可无，比方说我们想把<code>test</code>表从独立表空间移动到系统表空间，可以这么写：</p>
<pre><code class="hljs bash" lang="bash">ALTER TABLE <span class="hljs-built_in">test</span> TABLESPACE innodb_system;
</code></pre><h5 class="heading">其他类型的表空间</h5>
<p>随着MySQL的发展，除了上述两种老牌表空间之外，现在还新提出了一些不同类型的表空间，比如通用表空间（general tablespace）、undo表空间（undo tablespace）、临时表空间（temporary tablespace）吧啦吧啦的，具体情况我们就不细唠叨了，等用到的时候再提。</p>
<h4 class="heading">MyISAM是如何存储表数据的</h4>
<p>好了，唠叨完了<code>InnoDB</code>的系统表空间和独立表空间，现在轮到<code>MyISAM</code>了。我们知道不像<code>InnoDB</code>的索引和数据是一个东东，在<code>MyISAM</code>中的索引全部都是<code>二级索引</code>，该存储引擎的数据和索引是分开存放的。所以在文件系统中也是使用不同的文件来存储数据文件和索引文件。而且和<code>InnoDB</code>不同的是，<code>MyISAM</code>并没有什么所谓的<code>表空间</code>一说，<span style="color:red">表数据都存放到对应的数据库子目录下</span>。假如<code>test</code>表使用<code>MyISAM</code>存储引擎的话，那么在它所在数据库对应的<code>xiaohaizi</code>目录下会为<code>test</code>表创建这三个文件：</p>
<pre><code class="hljs bash" lang="bash">test.frm
test.MYD
test.MYI
</code></pre><p>其中<code>test.MYD</code>代表表的数据文件，也就是我们插入的用户记录；<code>test.MYI</code>代表表的索引文件，我们为该表创建的索引都会放到这个文件中。</p>
<h3 class="heading">视图在文件系统中的表示</h3>
<p>我们知道<code>MySQL</code>中的视图其实是虚拟的表，也就是某个查询语句的一个别名而已，所以在存储<code>视图</code>的时候是不需要存储真实的数据的，<span style="color:red">只需要把它的结构存储起来就行了</span>。和<code>表</code>一样，描述视图结构的文件也会被存储到所属数据库对应的子目录下边，只会存储一个<code>视图名.frm</code>的文件。</p>
<h3 class="heading">其他的文件</h3>
<p>除了我们上边说的这些用户自己存储的数据以外，<code>数据目录</code>下还包括为了更好运行程序的一些额外文件，主要包括这几种类型的文件：</p>
<ul>
<li>
<p>服务器进程文件。</p>
<p>我们知道每运行一个<code>MySQL</code>服务器程序，都意味着启动一个进程。<code>MySQL</code>服务器会把自己的进程ID写入到一个文件中。</p>
</li>
<li>
<p>服务器日志文件。</p>
<p>在服务器运行过程中，会产生各种各样的日志，比如常规的查询日志、错误日志、二进制日志、redo日志吧啦吧啦各种日志，这些日志各有各的用途，我们之后会重点唠叨各种日志的用途，现在先了解一下就可以了。</p>
</li>
<li>
<p>默认/自动生成的SSL和RSA证书和密钥文件。</p>
<p>主要是为了客户端和服务器安全通信而创建的一些文件， 大家看不懂可以忽略～</p>
</li>
</ul>
<h2 class="heading">文件系统对数据库的影响</h2>
<p>因为<code>MySQL</code>的数据都是存在文件系统中的，就不得不受到文件系统的一些制约，这在数据库和表的命名、表的大小和性能方面体现的比较明显，比如下边这些方面：</p>
<ul>
<li>
<p>数据库名称和表名称不得超过文件系统所允许的最大长度。</p>
<p>每个数据库都对应<code>数据目录</code>的一个子目录，数据库名称就是这个子目录的名称；每个表都会在数据库子目录下产生一个和表名同名的<code>.frm</code>文件，如果是<code>InnoDB</code>的独立表空间或者使用<code>MyISAM</code>引擎还会有别的文件的名称与表名一致。这些目录或文件名的长度都受限于文件系统所允许的长度～</p>
</li>
<li>
<p>特殊字符的问题</p>
<p>为了避免因为数据库名和表名出现某些特殊字符而造成文件系统不支持的情况，<code>MySQL</code>会<span style="color:red">把数据库名和表名中所有除数字和拉丁字母以外的所有字符在文件名里都映射成 <code>@+编码值</code>的形式作为文件名</span>。比方说我们创建的表的名称为<code>'test?'</code>，由于<code>?</code>不属于数字或者拉丁字母，所以会被映射成编码值，所以这个表对应的<code>.frm</code>文件的名称就变成了<code>test@003f.frm</code>。</p>
</li>
<li>
<p>文件长度受文件系统最大长度限制</p>
<p>对于<code>InnoDB</code>的独立表空间来说，每个表的数据都会被存储到一个与表名同名的<code>.ibd</code>文件中；对于<code>MyISAM</code>存储引擎来说，数据和索引会分别存放到与表同名的<code>.MYD</code>和<code>.MYI</code>文件中。这些文件会随着表中记录的增加而增大，它们的大小受限于文件系统支持的最大文件大小。</p>
</li>
</ul>
<h2 class="heading">MySQL系统数据库简介</h2>
<p>我们前边提到了MySQL的几个系统数据库，这几个数据库包含了MySQL服务器运行过程中所需的一些信息以及一些运行状态信息，我们现在稍微了解一下。</p>
<ul>
<li>
<p><code>mysql</code></p>
<p>这个数据库贼核心，它存储了MySQL的用户账户和权限信息，一些存储过程、事件的定义信息，一些运行过程中产生的日志信息，一些帮助信息以及时区信息等。</p>
</li>
<li>
<p><code>information_schema</code></p>
<p>这个数据库保存着MySQL服务器维护的所有其他数据库的信息，比如有哪些表、哪些视图、哪些触发器、哪些列、哪些索引吧啦吧啦。这些信息并不是真实的用户数据，而是一些描述性信息，有时候也称之为元数据。</p>
</li>
<li>
<p><code>performance_schema</code></p>
<p>这个数据库里主要保存MySQL服务器运行过程中的一些状态信息，算是对MySQL服务器的一个性能监控。包括统计最近执行了哪些语句，在执行过程的每个阶段都花费了多长时间，内存的使用情况等等信息。</p>
</li>
<li>
<p><code>sys</code></p>
<p>这个数据库主要是通过视图的形式把<code>information_schema</code>和<code>performance_schema</code>结合起来，让程序员可以更方便的了解MySQL服务器的一些性能信息。</p>
</li>
</ul>
<p>啥？这四个系统数据库这就介绍完了？是的，我们的标题写的就是<code>简介</code>嘛！如果真的要唠叨一下这几个系统库的使用，那怕是又要写一本书了... 这里只是因为介绍数据目录里遇到了，为了内容的完整性跟大家提一下，具体如何使用还是要参照文档～</p>
