import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from "common/js/util"

//定义playlistMixin对象实现底部播放器高度自适应的功能
export const playlistMixin={
  computed: {
    ...mapGetters([
      'playlist'
    ])

  },
  //mounted是组件dom ready的时候会触发mounted
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  //activated是keep-alive的组件当它切过来的时候会触发activated事件
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    //引用的组件必须写这个方法
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')

    }
  }
}


//共享播放模式JS逻辑
export const playerMixin={
  computed:{
    iconMode() {
      return this.mode===playMode.sequence ? "icon-sequence" : this.mode===playMode.loop ? "icon-loop" : "icon-random"
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playlist',
      'mode',
      'favoriteList'
    ])
  },
  methods:{
    changeMode() {
      const mode=(this.mode+1)%3
      this.setPlayMode(mode)
      let list =null
      if(mode===playMode.random) {
        list=shuffle(this.sequenceList)
      }else{
        list=this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    //保证currentSong的Id不变
    resetCurrentIndex(list) {
      //在list中找到当前歌曲对应的索引
      let index=list.findIndex((item)=>{
        return item.id===this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon(song) {
      if(this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite(song) {
      if(this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      }else{
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song) {
      const index=this.favoriteList.findIndex((item)=>{
        return item.id===song.id
      })
      return index>-1
    },
    ...mapMutations({
      setPlayingState:'SET_PLAYING_STATE',
      setCurrentIndex:'SET_CURRENT_INDEX',
      setPlayMode:'SET_PLAY_MODE',
      setPlayList:'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

//共享search相关的逻辑
export const searchMixin={
  data() {
    return {
      query:'',
      refreshDelay:120
    }
  },
  computed: {
  ...mapGetters([
      'searchHistory'
    ])
  },
  methods:{
    blurInput() {
      this.$refs.searchBox.blur()
    },
    //保存搜索结果
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    //从搜索框中拿到query变化值
    onQueryChange(query) {
      this.query=query
    },
    addQuery(query) {
      //调用子组件setQuery方法
      this.$refs.searchBox.setQuery(query)
    },
    //相当于已经在实例中挂方法了，所以可以直接用
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])

  }

}
