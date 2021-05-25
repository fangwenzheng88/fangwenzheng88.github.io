![](http://fang.images.fangwenzheng.top/20200731171746.png)

## clientWidth/clientHeight

这个属性是只读属性，对于没有定义CSS或者内联布局盒子的元素为0，否则，它是元素内部的高度(单位像素)，==包含内边距(padding)==，但==不包括水平滚动条==、边框(border)和外边距(margin)。

![](http://fang.images.fangwenzheng.top/20200731172645.png)

> 备注: 此属性会将获取的值四舍五入取整数。 如果你需要小数结果, 请使用 element.getBoundingClientRect().

> 备注：上面的有问题 因为使用element.getBoundingClientRect()只能获取元素的width / height，但是这个值是 offsetWidth / offsetHeight ，包括边框的长度，所以不能获取clientWidth / clientHeight

## clientLeft/clientTop

clientLeft：表示一个元素的左边框的宽度，以像素表示。如果元素的文本方向是从右向左（RTL, right-to-left），并且由于内容溢出导致左边出现了一个垂直滚动条，则该属性包括滚动条的宽度。clientLeft 不包括左外边距和左内边距。clientLeft 是只读的。

clientTop：一个元素顶部边框的宽度（以像素表示）。不包括顶部外边距或内边距。clientTop 是只读的。



## offsetLeft/offsetLeft/offsetWidth/offsetHeight

**`HTMLElement.offsetLeft`** 是一个只读属性，返回当前元素*左上角*相对于  [`HTMLElement.offsetParent`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetParent) 节点的左边界偏移的像素值。

对块级元素来说，`offsetTop`、`offsetLeft`、`offsetWidth` 及 `offsetHeight` 描述了元素相对于 `offsetParent` 的边界框。

然而，对于可被截断到下一行的行内元素（如 **span**），`offsetTop` 和 `offsetLeft` 描述的是*第一个*边界框的位置（使用 [`Element.getClientRects()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getClientRects) 来获取其宽度和高度），而 `offsetWidth` 和 `offsetHeight` 描述的是边界框的尺寸（使用 [`Element.getBoundingClientRect`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect) 来获取其位置）。因此，使用 `offsetLeft、offsetTop、offsetWidth`、`offsetHeight` 来对应 left、top、width 和 height 的一个盒子将不会是文本容器 span 的盒子边界。





# Element.getBoundingClientRect()

**`Element.getBoundingClientRect()`** 方法返回元素的大小及其相对于视口的位置。

如果是标准盒子模型，元素的尺寸等于`width/height` + `padding` + `border-width`的总和。如果`box-sizing: border-box`，元素的的尺寸等于 `width/height`。

![image-20210524155545751](http://fang.images.fangwenzheng.top/image-20210524155545751.png)

返回值是一个 [`DOMRect`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMRect) 对象，这个对象是由该元素的 [`getClientRects()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getClientRects) 方法返回的一组矩形的集合，就是该元素的 CSS 边框大小。返回的结果是包含完整元素的最小矩形，并且拥有`left`, `top`, `right`, `bottom`, `x`, `y`, `width`, 和 `height`这几个以像素为单位的只读属性用于描述整个边框。除了`width` 和 `height` 以外的属性是相对于视图窗口的左上角来计算的。

空边框盒（译者注：没有内容的边框）会被忽略。如果所有的元素边框都是空边框，那么这个矩形给该元素返回的 `width`、`height` 值为 0，`left`、`top` 值为第一个 CSS 盒子（按内容顺序）的 top-left 值。

当计算边界矩形时，会考虑视口区域（或其他可滚动元素）内的滚动操作，也就是说，当滚动位置发生了改变，top和left属性值就会随之立即发生变化（因此，它们的值是相对于视口的，而不是绝对的）。如果你需要获得相对于整个网页左上角定位的属性值，那么只要给top、left属性值加上当前的滚动位置（通过 window.scrollX 和 window.scrollY），这样就可以获取与当前的滚动位置无关的值。











































