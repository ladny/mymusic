<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
      <div class="bar-inner">
        <div class="progress" ref="progress"></div>
        <div class="progress-btn-wrapper" ref="progressBtn"
             @touchstart.prevent="progressTouchStart"
             @touchmove.preveny="progressTouchMove"
             @touchend="progressTouchEnd"
        >
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
</template>

<script>
  import {prefixStyle} from "common/js/dom"
  const transform=prefixStyle('transform')

  const progressBtnWidth=16
    export default {
        props: {
          percent: {
            type: Number,
            default: 0
          }
        },
      created() {
          //用于不同的回调函数中共享数据的时候，把共享数据挂载到这个touch对象上
          this.touch={}
      },
      methods: {
        progressTouchStart(e) {
          this.touch.initiated=true //表示初始化
          this.touch.startX=e.touches[0].pageX //第一个手指横向的坐标
          this.touch.left=this.$refs.progress.clientWidth//进度条上偏移的宽度

        },
        progressTouchMove(e) {
          //没有初始化时直接return掉
          if(!this.touch.initiated) {
            return
          }
          const deltaX=e.touches[0].pageX-this.touch.startX //移动的距离
          const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
          this._offset(offsetWidth)

        },
        progressTouchEnd(e) {
          //重置初始化为false
          this.touch.initiated=false
          //派发一个事件
          this._triggerPercent()

        },
        //点击时的位移
        progressClick(e) {
          const rect=this.$refs.progressBar.getBoundingClientRect()
          const offsetWidth=e.pageX-rect.left
          this._offset(offsetWidth)
          //这里当我们点击progressBtn时e.offsetX获取不对
          // this._offset(e.offsetX) //偏移量
          this._triggerPercent() //派发事件
        },
        _triggerPercent() {
          const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
          const percent=this.$refs.progress.clientWidth/barWidth
          this.$emit('percentChange',percent)
        },
        _offset(offsetWidth) {
          //进度条
          this.$refs.progress.style.width=`${offsetWidth}px`
          //小球的距离
          this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`
        }
      },
      watch: {
        percent(newPercent) {
            if(newPercent>=0 && !this.touch.initiated) {
              const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
              const offsetWidth=newPercent*barWidth
              this._offset(offsetWidth)
            }
          }
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
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
