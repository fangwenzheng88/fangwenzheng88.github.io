
```javascript
import Vue from 'vue'

const preventReClick = Vue.directive('preventReClick', {
  inserted: function(el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 3000) // 传入绑定值就使用，默认3000毫秒内不可重复触发
      }
    })
  }
})

export { preventReClick }
```

```javascript
// 节流函数
function debounce (func, delay, context, event) {
  clearTimeout(func.timer)
  func.timer = setTimeout(function () {
    func.call(context, event)
  }, delay)
}
// 导出新组件
export default {
  props: {},
  name: 'ButtonHoc',
  data () {
    return {}
  },
  mounted () {
    console.log('HOC succeed')
  },
  methods: {
    handleClickLink (event) {
      let that = this
      console.log('debounce')
      // that.$listeners.click为绑定在新组件上的click函数
      debounce(that.$listeners.click, 300, that, event)
    }
  },
  render (h) {
    const slots = Object.keys(this.$slots)
      .reduce((arr, key) => arr.concat(this.$slots[key]), [])
      .map(vnode => {
        vnode.context = this._self
        return vnode
      })
    return h('Button', {
      on: {
        click: this.handleClickLink //新组件绑定click事件
      },
      props: this.$props,
      // 透传 scopedSlots
      scopedSlots: this.$scopedSlots,
      attrs: this.$attrs
    }, slots)
  }
}
```

