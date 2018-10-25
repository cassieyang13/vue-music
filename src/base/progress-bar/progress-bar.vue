<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'

  const transform = prefixStyle('transform')
  const progressBtnWidth = 16
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      // 用来存储一些参数
      this.touch = {}
    },
    methods: {
      progressTouchStart(e) {
        // 是否初始化flg
        this.touch.initaited = true
        // 获取开始时候的位置
        this.touch.startX = e.touches[0].pageX
        // 获取开始时的偏移位置
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if (!this.touch.initaited) {
          return
        }
        // 计算move的距离
        const deltaX = e.touches[0].pageX - this.touch.startX

        // 获取偏移位置，最大不能超过进度条总长度，最小不能小于0
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd() {
        this.touch.initaited = false
        // 触发设置audio的时间
        this._triggerPercent()
      },
      progressClick(e) { // 进度条点击的功能
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        // this._offset(e.offsetX)
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left

        this._offset(offsetWidth)
          // 触发设置audio的时间
          this._triggerPercent()
      },
      _triggerPercent() {
        // 获取进度条的总长度，
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 计算percent
        let percent = this.$refs.progress.clientWidth / barWidth
        // 向上派发事件
        this.$emit('percentChange', percent)
      },
      _offset(offsetWidth) {
        // 设置已播放的长度
        this.$refs.progress.style.width = `${offsetWidth}px`
        // 在设置按钮的偏移位置
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch: {
      percent(newPercent) { // 是不断改变的
        if (newPercent >= 0) {
          // 获取进度条的总长度，
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          // 计算要偏移的长度
          const offsetWidth = newPercent * barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
