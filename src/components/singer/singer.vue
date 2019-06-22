<template>
  <div class="singer" ref="singer">
    <listview @select="selectSinger" ref="list" :data="singers"></listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Listview from 'base/listview/listview'
  import {getSingerList} from "api/singer";
  import {ERR_OK} from "api/config";
  import Singer from 'common/js/singer'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from "common/js/mixin"

  const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

export default {
    mixins:[playlistMixin],
  data() {
    return {
      singers:[]
    }
  },
  created() {
    this._getSingerList()
  },
  methods:{
    handlePlaylist(playlist) {
      const bottom=playlist.length>0 ? '60px' : ''
      this.$refs.singer.style.bottom=bottom
      this.$refs.list.refresh()
    },
    selectSinger(singer){
      console.log("歌手"+singer.name);
      this.$router.push({
        path:`/singer/${singer.id}`
      })
      //提交mutation实现修改了state
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then((res)=>{
        if(res.code===ERR_OK){
          this.singers=this._normalizeSinger(res.data.list);
        }
      })
    },
    _normalizeSinger(list){
      let map={
        hot:{
          title:HOT_NAME,
          items:[]
        }
      }
      list.forEach((item,index)=>{
        if(index<HOT_SINGER_LEN){
          map.hot.items.push(new Singer({
            name:item.Fsinger_name,
            id:item.Fsinger_mid
          }))
        }
        const key=item.Findex
        if(!map[key]) {
          map[key]={
            title:key,
            items:[]
          }
        }
        map[key].items.push(new Singer({
          name:item.Fsinger_name,
          id:item.Fsinger_mid
        }))
      })
      console.log(map)
      //为了得到有序列表，需要处理map
      let ret=[]
      let hot=[]
      for(let key in map){
        let val=map[key]
        //正则校验match字母
        if(val.title.match(/[a-zA-Z]/)){
          ret.push(val)
        }else if(val.title===HOT_NAME){
          hot.push(val)
        }
      }
      //对数组的sort方法对数据最排序
      //charCodeAt() 方法可返回指定位置的字符的 Unicode 编码
      //charCodeAt(index)index表示字符串中某个位置的数字，即字符在字符串中的下标。
      ret.sort((a,b)=>{
        return a.title.charCodeAt(0)-b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger:'SET_SINGER'
    })
  },
  components:{
    Listview
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
