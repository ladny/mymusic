<template>
   <transition name="slide">
     <music-list :title="title" :bg-image="bgImage" :songs="songs">
     </music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from "api/config";
  import {createSong} from "common/js/song";

  export default {
      data() {
        return {
          songs:[]
        }
      },
      computed: {
        title() {
          return this.disc.dissname
        },
        bgImage() {
          return this.disc.imgurl
        },
        ...mapGetters([
          'disc'
        ])
      },
    created() {
        this._getSongList()
    },
    methods: {
      _getSongList() {
        //当刷新时没有数据时，返回到上一级路径
        if(!this.disc.dissid){
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.dissid).then((res)=>{
          if(res.code===ERR_OK) {
            this.songs=this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret=[] //定义返回值 以song实例为item的数组
        list.forEach((musicData)=>{
          if(musicData.songid&&musicData.albumid) {
            ret.push(createSong(musicData))//返回song的实例添加到数组里
          }
        })
        return ret
      }
    },
      components: {
        MusicList
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
