<template>
    <scroll class="suggest"
            :data="result"
            :pullup="pullup"
            @scrollToEnd="searchMore"
            ref="suggest"
            :beforeScroll="beforeScroll"
            @beforeScroll="listScroll"
    >
      <ul class="suggest-list">
        <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
          <div class="icon">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text" v-html="getDisplayName(item)" ></p>
          </div>
        </li>
        <loading v-show="hasMore" title=""></loading>
      </ul>
      <div v-show="!hasMore&& !result.length" class="no-result-wrapper">
        <no-result title="抱歉，暂无结果"></no-result>
      </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from "api/search"
  import {ERR_OK} from "api/config"
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {mapMutations,mapActions} from 'vuex'
  import NoResult from 'base/no-result/no-result'

  const TYPE_SINGER='singer' //区分是歌手还是歌曲
  const perpage=20 //定义常量每一页返回的个数

  export default {
      name: "suggest",
      props: {
        query: {
          type: String,
          default: ''
        },
        showSinger: {
          type:Boolean,
          default:true
        }
      },
      data() {
          return {
            page:1,
            result:[],
            pullup:true,
            beforeScroll:true,//滚动列表
            hasMore:true//标志位 上拉加载
          }
      },
      watch: {
        query() {
          this.search()
        }
      },
      methods: {
        search() {
          //当重置query时优化点
          this.page=1
          this.$refs.suggest.scrollTo(0,0)//将dom结构滚动到顶部

          this.hasMore=true
          search(this.query,this.page,this.showSinger,perpage).then((res)=>{
            if(res.code===ERR_OK)  {
              this.result=this._getResult(res.data)
              this._checkMore(res.data)
              console.log(this.result)
            }
          })
        },
        searchMore() {
          if(!this.hasMore) {
            return
          }
          this.page++
          search(this.query,this.page,this.showSinger,perpage).then((res)=>{
            if(res.code===ERR_OK)  {
              this.result=this.result.concat(this._getResult(res.data))//注意，此处需要进行数组的拼接
              this._checkMore(res.data)
            }
          })

        },
        getIconCls(item) {
          if(item.type===TYPE_SINGER) {
            return 'icon-mine'
          }else{
            return 'icon-music'
          }
        },
        getDisplayName(item) {
          if(item.type===TYPE_SINGER) {
            return item.singername
          }else{
            return `${item.name}-${item.singer}`
          }
        },
        selectItem(item) {
          //如果是歌手则跳转到歌手的路由
          if(item.type===TYPE_SINGER) {
            const singer=new Singer({
              id:item.singermid,
              name:item.singername
            })
            //二级路由地址
            this.$router.push({
              path:`/search/${singer.id}`
            })
            this.setSinger(singer)
          }else{
            this.insertSong(item)
          }
          this.$emit('select')//派发事件
        },
        //做一层代理，重新计算
        refresh() {
          this.$refs.suggest.refresh()
        },
        //滚动事件
        listScroll() {
          this.$emit("listScroll")
        },
        _checkMore(data) {
          const song=data.song
          if(!song.list.length ||song.curnum+song.curpage*perpage>=song.totalnum) {
            this.hasMore=false
          }

        },
        _getResult(data) {
          let ret=[]
          if(data.zhida && data.zhida.singerid) {
            //用2个对象扩展运算符添加到1个对象上
            ret.push({...data.zhida, ...{type:TYPE_SINGER}})
          }
          if(data.song) {
            ret=ret.concat(this._normalizeSongs(data.song.list))
          }
          return ret
        },
        _normalizeSongs(list) {
          let ret=[] //映射为song实例的一个数组
          list.forEach((musicDate)=>{
            if(musicDate.songid && musicDate.albumid) {
              ret.push(createSong(musicDate))
            }
          })
          return ret
        },
        ...mapMutations({
          setSinger:'SET_SINGER'
        }),
        ...mapActions([
          'insertSong'
        ])
      },
      components: {
        Scroll,
        Loading,
        Singer,
        NoResult
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
