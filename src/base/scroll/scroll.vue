<template>
    <div ref="wrapper">
      <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
    export default {
      name: "scroll",
      props:{
        probeType:{
          type:Number,
          default:1
        },
        click:{
          type:Boolean,
          default:true
        },
        listenScroll:{
          type:Boolean,
          default:false
        },
        data:{
          type:Array,
          default:null
        },
        pullup: {
          type: Boolean,
          default: false
        },
        beforeScroll: {
          type: Boolean,
          default: false
        },
        refreshDelay:{
          type:Number,
          default:20
        }
      },
      mounted() {
        setTimeout(()=>{
         this._initScroll()
        },20)
      },
      methods:{
        _initScroll() {
          if(!this.$refs.wrapper){
            return
          }
          this.scroll=new BScroll(this.$refs.wrapper,{
            probeType:this.probeType,
            click:this.click,
          })
          //监听scroll的滚动事件
          if(this.listenScroll){
            let me=this
            this.scroll.on('scroll', (pos) => {
              me.$emit('scroll', pos)
            })
          }
          //上拉加载
          if (this.pullup) {
            this.scroll.on('scrollEnd', () => {
              //款滚动到底部时
              if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                this.$emit('scrollToEnd')
              }
            })
          }
          //滚动列表时的事件
          if(this.beforeScroll) {
            this.scroll.on('beforeScrollStart',()=>{
              this.$emit('beforeScroll')//对外派发beforeScroll事件
            })
          }
        },
        enable(){
          this.scroll&&this.scroll.enable()

        },
        disable(){
          this.scroll&&this.scroll.disable()
        },
        refresh(){
          this.scroll&&this.scroll.refresh()
        },
        scrollTo(){
          this.scroll&&this.scroll.scrollTo.apply(this.scroll,arguments)
        },
        scrollToElement(){
          this.scroll&&this.scroll.scrollToElement.apply(this.scroll,arguments)
        }
      },
      watch:{
        data() {
          setTimeout(()=>{
            this.refresh()
          },this.refreshDelay)
        }
      }
    }
</script>

<style scoped>

</style>
