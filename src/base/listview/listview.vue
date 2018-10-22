<template>
  <scroll
    class="listview"
    :data="data"
    ref="listview"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
  >
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="(item, i) in group.items" :key="i" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="list-shortcut">
      <li v-for="(item, index) in shortCutList" :key="index" :data-index="index" class="item"
          @touchstart.stop.prevent="onShortCutTouchStart"
          @touchmove.stop.prevent="onShortCutTouchMove"
          :class="{'current': currentIndex === index}">
        {{item}}
      </li>
    </ul>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {getData} from 'common/js/dom'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30
  export default {
    created() {
      // 为什么这个值在此处定义不在data或者props中定义？
      // 因为data和props中的数据都会别getter,setter,也就是被监听，但是这里不需要
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    computed: {
      shortCutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        // 当滚动的偏移位置在顶部
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      onShortCutTouchStart(e) {
        // 获取右侧点击的index
        let anchorIndex = getData(e.target, 'index')
        // 获取第一次touch时的位置
        let firstTouch = e.touches[0]
        // 将Y坐标保存
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        // 调用scroll,滚动到相应的list
        this._scrollTo(anchorIndex)
      },
      onShortCutTouchMove(e) {
        // 获取第一次move时的位置
        let firstTouch = e.touches[0]
        // 将Y坐标保存
        this.touch.y2 = firstTouch.pageY
        // 计算y轴上的偏移了几个锚点
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        // 得到move时的anchor index
        let anchorIndex = parseInt(this.touch.anchorIndex + delta)
        // 调用scroll,滚动到相应的list
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      selectItem(item) { // 向上派发事件
        this.$emit('select', item)
      },
      _scrollTo(index) {
        console.log(index)
        if (!index && index === 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        // 当手动点击右侧菜单时，手动设置scrollY,实现右侧高亮
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scroll.scrollToElement(this.$refs.listGroup[index], 20)
      },
      _calculateHeight() {
        // 每次计算时都初始化
        this.listHeight = []
        // 获取每个listGroup
        const list = this.$refs.listGroup
        /// 初始化第一个li的高度为0
        let height = 0
        // 将第一个高度添加到数组
        this.listHeight.push(height)
        // 遍历list
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          // 高度为累加当前元素的高度
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() { // 监听当data变化是，延时计算高度
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight

        // 当newY大于0，滚动到顶部
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 当newY 小于0，在中间滚动
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]

          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            // 得到滚动的位置与下一个title dom的距离差
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        console.log(newVal)

        // 获取title与 fixed title底部的距离
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        // 如果上次的距离与这次相等，就直接返回
        if (this.fixedTop === fixedTop) {
          return
        }
        // 存值
        this.fixedTop = fixedTop
        // 将fixed title向上顶
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
