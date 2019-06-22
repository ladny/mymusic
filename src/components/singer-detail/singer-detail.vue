<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs">
    </music-list>
  </transition>

</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {getSingerDetail} from "api/singer";
  import {mapGetters} from 'vuex'
  import {ERR_OK} from "api/config";
  import {createSong,isValidMusic} from "common/js/song";

  export default {
      name: "singer-detail",
      data() {
        return {
          songs:[]
        }
      },
      computed:{
        title() {
          return this.singer.name
        },
        bgImage() {
          return this.singer.avatar
        },
        ...mapGetters([
          'singer'
        ])
      },
      created() {
        this._getDetail()
        console.log(this.singer)
      },
      methods:{
        _getDetail() {
          //当刷新当前页面时，没有获取singer数据时的的场景
          if(!this.singer.id){
            this.$router.push('/singer')
            return
          }
          getSingerDetail(this.singer.id).then((res)=>{
            if(res.code===ERR_OK){
              this.songs=this._normalizeSongs(res.data.list)
              console.log(this.songs)
            }
          })
        },
        _normalizeSongs(list){
          let ret=[]
          list.forEach((item)=>{
            let {musicData}=item
            if(isValidMusic(musicData)){
              ret.push(createSong(musicData))
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
