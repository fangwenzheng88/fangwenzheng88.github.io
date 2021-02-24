# 让CSS flex布局最后一行列表左对齐的N种方法

[让CSS flex布局最后一行列表左对齐的N种方法](https://www.zhangxinxu.com/wordpress/2019/08/css-flex-last-align/);

# 响应式图片srcset全新释义sizes属性w描述符

[响应式图片srcset全新释义sizes属性w描述符](https://www.zhangxinxu.com/wordpress/2014/10/responsive-images-srcset-size-w-descriptor/)


# line-height取值问题

line-height: normal | <number> | <length> | <percentage>
* `normal` 根据浏览器决定，一般为1.2。
* `number` 仅指定数字时（无单位），实际行距为字号乘以该数字得出的结果。可以理解为一个系数，子元素仅继承该系数，子元素的真正行距是分别与自身元素字号相乘的计算结果。大多数情况下推荐使用，可以避免一些意外的继承问题。
* `length` 具体的长度，如px/em等。
* `percentage` 百分比，100%与1em相同。

> 有单位（包括百分比）与无单位之间的区别
有单位时，子元素继承了父元素计算得出的行距；无单位时继承了系数，子元素会分别计算各自行距（推荐使用）。