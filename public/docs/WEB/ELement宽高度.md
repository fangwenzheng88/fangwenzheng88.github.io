[toc]

![](http://fang.images.fangwenzheng.top/20200731171746.png)

## clientWidth/clientHeight

这个属性是只读属性，对于没有定义CSS或者内联布局盒子的元素为0，否则，它是元素内部的高度(单位像素)，==包含内边距(padding)==，但==不包括水平滚动条==、边框(border)和外边距(margin)。

![](http://fang.images.fangwenzheng.top/20200731172645.png)

> 备注: 此属性会将获取的值四舍五入取整数。 如果你需要小数结果, 请使用 element.getBoundingClientRect().

> 备注：上面的有问题 因为使用element.getBoundingClientRect()只能获取元素的width / height，但是这个值是 offsetWidth / offsetHeight ，包括边框的长度，所以不能获取clientWidth / clientHeight


## clientLeft/clientTop

clientLeft：表示一个元素的左边框的宽度，以像素表示。如果元素的文本方向是从右向左（RTL, right-to-left），并且由于内容溢出导致左边出现了一个垂直滚动条，则该属性包括滚动条的宽度。clientLeft 不包括左外边距和左内边距。clientLeft 是只读的。

clientTop：一个元素顶部边框的宽度（以像素表示）。不包括顶部外边距或内边距。clientTop 是只读的。