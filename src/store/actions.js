import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from "common/js/util";
import {saveSearch,deleteSearch,clearSearch,savePlay,saveFavorite,deleteFavorite} from "common/js/cache";

//查找列表中有没有这首歌
function findIndex(list,song) {
  return list.findIndex((item)=>{
    return item.id===song.id
  })

}

export const selectPlay=function ({commit,state},{list,index}) {
  commit(types.SET_SEQUENCE_LIST,list)
  if(state.mode===playMode.random) {
    let randomlist=shuffle(list)
    commit(types.SET_PLAYLIST,randomlist)
    index=findIndex(randomlist,list[index])
  }else{
    commit(types.SET_PLAYLIST,list)
  }
  commit(types.SET_CURRENT_INDEX,index)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING_STATE,true)
}

export const randomPlay=function ({commit},{list}) {
  commit(types.SET_PLAY_MODE,playMode.random)
  commit(types.SET_SEQUENCE_LIST,list)
  let randomlist=shuffle(list)
  commit(types.SET_PLAYLIST,randomlist)
  commit(types.SET_CURRENT_INDEX,0)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING_STATE,true)
}


//搜索页插入歌曲封装
export const insertSong = function ({commit,state},song) {
  let playlist=state.playlist.slice()//副本,不会修改state中的值
  let sequenceList=state.sequenceList.slice()
  let currentIndex=state.currentIndex
  //记录当前歌曲
  let currentSong=playlist[currentIndex]
  //查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex=findIndex(playlist,song)
  //因为是插入歌曲 插入的位置是当前索引的下一个所以索引 +1
  currentIndex++
  //插入这首歌到当前索引位置
  playlist.splice(currentIndex,0,song)
  //如果已经包含了这首歌
  if(fpIndex>-1){
    //如果当前插入的序号大于列表中的序号
    if(currentIndex>fpIndex){
      //删除找到的这个索引,数组长度减1,所以currentIndex-1
      playlist.splice(fpIndex,1)
      currentIndex--
    }else{
      playlist.splice(fpIndex+1,1)
    }
  }

  //currentSIndex 当前sequenceList的索引,应该要插入的位置
  let currentSIndex=findIndex(sequenceList,currentSong)+1
  //查找当前列表中是否有待插入的歌曲并返回其索引
  let fsIndex=findIndex(sequenceList,song)
  //插入这首歌到当前索引位置
  sequenceList.splice(currentSIndex,0,song)
  if(fsIndex>-1){
    if(currentSIndex>fsIndex){
      sequenceList.splice(fsIndex,1)//直接删掉
    }else{
      sequenceList.splice(fsIndex+1,1)
    }
  }

  commit(types.SET_PLAYLIST,playlist)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX,currentIndex)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING_STATE,true)
}


//存储历史缓存
export const saveSearchHistory=function ({commit},query) {
  commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}

//删除历史缓存
export const deleteSearchHistory=function ({commit},query) {
  commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}

//垃圾桶删除
export const clearSearchHistory=function ({commit}) {
  commit(types.SET_SEARCH_HISTORY,clearSearch())
}

//删除歌曲
export const deleteSong=function ({commit,state},song) {
  let playlist=state.playlist.slice()//副本,不会修改state中的值
  let sequenceList=state.sequenceList.slice()
  let currentIndex=state.currentIndex
  let pIndex=findIndex(playlist,song)
  playlist.splice(pIndex,1)//删掉这首歌
  let sIndex=findIndex(sequenceList,song)
  sequenceList.splice(sIndex,1)

  //当前歌曲的索引>播放列表的索引 ||删除最后一首歌
  if(currentIndex>pIndex || currentIndex===playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST,playlist)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX,currentIndex)

  const playingState=playlist.length>0
  commit(types.SET_PLAYING_STATE,playingState)

}

export const deleteSongList=function ({commit}) {
  commit(types.SET_PLAYLIST,[])
  commit(types.SET_SEQUENCE_LIST,[])
  commit(types.SET_CURRENT_INDEX,-1)
  commit(types.SET_PLAYING_STATE,false)
}

export const savePlayHistory=function ({commit},song) {
  commit(types.SET_PLAY_HISTORY,savePlay(song))

}

export const saveFavoriteList=function ({commit},song) {
  commit(types.SET_FAVORITE_LIST,saveFavorite(song))
}

export const deleteFavoriteList=function ({commit},song) {
  commit(types.SET_FAVORITE_LIST,deleteFavorite(song))
}