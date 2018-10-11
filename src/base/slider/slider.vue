<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="item"
            :class="{'active': currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      // 循环轮播
      loop: {
        type: Boolean,
        default: true
      },
      // 自动轮播
      autoPlay: {
        type: Boolean,
        default: true
      },
      // 自动轮播时间间隔
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      // 不用$nextTick的原因： 浏览器的刷新通常是17毫秒一次，这里使用20毫秒足够
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        // 如果是自动播放，则调用该方法
        if (this.autoPlay) {
          this._play()
        }
      }, 20)
      // 监听改变窗口大小的事件
      window.addEventListener('resize', () => {
        // 如果是第一次则不触发
        if (!this.slider) {
          return
        }
        // 重新计算宽度
        this._setSliderWidth(true)
        // 重新刷新BS
        this.slider.refresh()
      })
    },
    methods: {
      // 设置轮播的宽度
      _setSliderWidth(isResize) {
        // 获取轮播组中所有的子元素
        this.children = this.$refs.sliderGroup.children
        // 定义初始化宽度为0
        let width = 0
        // 获取轮播图片父容器的宽度
        let sliderWidth = this.$refs.slider.clientWidth

        // 循环遍历子元素
        for (let i = 0; i < this.children.length; i++) {
          // 获取当元素
          let child = this.children[i]
          // 向当前元素添加class
          addClass(child, 'slider-item')
          // 设置当前元素的宽度
          child.style.width = sliderWidth + 'px'
          // 总长度累加
          width += sliderWidth
        }
        // 如果是循环播放，会clone一个宽度，所以会需要2倍的宽度,并且不是改变窗口时才会+2
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        // 见最终宽度赋值给轮播组的宽度
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })
        this.slider.on('scrollEnd', () => {
          // 获取当前的index
          let pageIndex = this.slider.getCurrentPage().pageX
          // 因为会clone两个div(一前一后)， 所以要减1
          if (this.loop) {
            pageIndex -= 1
          }
          // 将值赋给当前页面index
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            // 避免手动拖动时重复操作
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _play() {
        // 获取当前page index 加一，因为第一个div的clone的多余的
        let pageIndex = this.currentPageIndex + 1
        // 如果是循环播放，则再加一
        if (this.loop) {
          pageIndex += 1
        }
        // 设置timer
        this.timer = setTimeout(() => {
          // 调用bs的方法goToPage ，参数x, y, interval
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    },
    destroyed() {
      // 在组件销毁的时候，清除掉组件上的timer，利于内存的释放
      clearTimeout(this.timer)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
