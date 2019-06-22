//缓存localStorage
import storage from 'good-storage'

//搜索KEY 双下划线定义表示比较内部的key
const SEARCH_KEY='__search__'
const SEARCH_MAX_LENGTH=15 //最大存储空间

//播放列表的存储
const PLAY_KEY='__play__'
const PLAY_MAX_LENGTH=200

//收藏列表存储
const FAVORITE_KEY='__favorite__'
const FAVORITE_MAX_LENGTH=200

//插入数组的方法  compare比较函数
function insertArray(arr,val,compare,maxLen) {
  //实现逻辑先查找arr中有没有val，如果有index===0则return，如果有index>0直接删除再插入，如果没有则直接插入
  //最大长度，如果超过了则pop出来
  const index=arr.findIndex(compare)  //findIndex查找当前数组中是不是有某个元素
  //index===0 是第一条数据，直接返回
  if(index===0) {
    return
  }
  //数组中有这条数据
  if(index>0){
    arr.splice(index,1)//删掉之前的数据
  }
  arr.unshift(val) //插到数组的第一个位置
  if(maxLen &&arr.length>maxLen) {
    arr.pop()//数组的最后一个pop出来
  }
}


//删除方法 当比较函数compare返回为true时 则删掉
function deleteFromArray(arr,compare) {
  const index=arr.findIndex(compare)
  if(index>-1){
    arr.splice(index,1)
  }

}

//query插入到数组中,最新搜索的结果在最前面，最后的一个去掉，重复的去掉
export function saveSearch(query) {
  let searches=storage.get(SEARCH_KEY,[])//如果没有值则默认值为[]
  insertArray(searches,query,(item)=>{
    return item===query //searches中的item是否包含query
  },SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY,searches)//存储
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY,[])
}

//删除历史数据并缓存
export function deleteSearch(query) {
  //先获取缓存列表
  let searches=storage.get(SEARCH_KEY,[])
  //删除数据
  deleteFromArray(searches,(item)=>{
    return item===query
  })
  storage.set(SEARCH_KEY,searches)//存储
  return searches
}


//垃圾桶删除历史数据缓存
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}


//播放列表的存储
export function savePlay(song) {
  let songs=storage.get(PLAY_KEY,[])
  insertArray(songs,song,(item)=>{
    return item.id===song.id
  },PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY,songs)
  return songs
}

//读取播放列表
export function loadPlay() {
  return storage.get(PLAY_KEY,[])
}

//收藏列表存储
export function saveFavorite(song) {
  let songs=storage.get(FAVORITE_KEY,[])
  insertArray(songs,song,(item)=>{
    return song.id===item.id
  },FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY,songs)
  return songs
}

//删除收藏列表
export function deleteFavorite(song) {
  let songs=storage.get(FAVORITE_KEY,[])
  deleteFromArray(songs,(item)=>{
    return song.id===item.id
  })
  storage.set(FAVORITE_KEY,songs)
  return songs
}

//读取收藏列表
export function loadFavorite() {
  return storage.get(FAVORITE_KEY,[])
}
