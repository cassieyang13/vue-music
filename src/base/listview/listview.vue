<template>
  <scroll class="listview" :data="data" ref="listview">
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item, i) in group.items" :key="i" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="list-shortcut">
      <li v-for="(item, index) in shortCutList" :key="index" :data-index="index" class="item"
          @touchstart="onShortCutTouchStart"
          @touchmove="onShortCutTouchMove">
        {{item}}
      </li>
    </ul>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {getData} from 'common/js/dom'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'

  export default {
    created() {
      // 为什么这个值在此处定义不在data或者props中定义？
      // 因为data和props中的数据都会别getter,setter,也就是被监听，但是这里不需要
      this.touch = {}
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
      }
    },
    methods: {
      onShortCutTouchStart(e) {
        // 获取右侧点击的index
        let anchorIndex = getData(e.target, 'index')
        // 获取第一次touch时的位置
        let firstTouch = e.touchs[0]
        // 将Y坐标保存
        this.touch.y1 = firstTouch.pageY
        // 调用scroll,滚动到相应的list
        this.$refs.listview.scroll.scrollToElement(this.$refs.listGroup[anchorIndex])
      },
      onShortCutTouchMove(e) {
        // 获取第一次move时的位置
        let firstTouch = e.touchs[0]
        // 将Y坐标保存
        this.touch.y2 = firstTouch.pageY
        // 计算y轴上的偏移
        let data = this.touch.y2 - this.touch.y1
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
